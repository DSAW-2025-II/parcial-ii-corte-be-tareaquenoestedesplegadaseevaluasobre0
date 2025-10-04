const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');

// POST /api/v1/pokemonDetails
router.post('/pokemonDetails', authenticateToken, async (req, res) => {

    try {
        const { pokemonName } = req.body;
        
        console.log('Buscando Pokémon:', pokemonName);

        // 1. Validar que venga el nombre
        if (!pokemonName) {
        console.log('No se proporcionó nombre de Pokémon');
        return res.status(400).json({
            name: "",
            species: "",
            weight: "",
            img_url: ""
        });
        }

        // 2. Hacer petición a PokeAPI usando fetch nativo
        console.log('Consultando PokeAPI...');
        const apiUrl = process.env.API_URL || 'https://pokeapi.co/api/v2/pokemon/';
        const response = await fetch(`${apiUrl}${pokemonName.toLowerCase()}`);
        
        // 3. Verificar si el Pokémon existe
        if (!response.ok) {
            if (response.status === 404) {
                console.log('Pokémon no encontrado:', pokemonName);
                return res.status(400).json({
                name: "",
                species: "",
                weight: "",
                img_url: ""
                });
            }
            throw new Error(`Error en PokeAPI: ${response.status}`);
        }

        // 4. Obtener datos del Pokémon
        const pokemonData = await response.json();
        console.log('Pokémon encontrado:', pokemonData.name);

        // 5. Filtrar y formatear la respuesta
        const filteredData = {
            name: pokemonData.name,
            species: pokemonData.species.name,
            weight: pokemonData.weight.toString(),
            img_url: (
                pokemonData.sprites.other?.['official-artwork']?.front_default ||
                pokemonData.sprites.other?.dream_world?.front_default ||
                pokemonData.sprites.other?.home?.front_default ||
                pokemonData.sprites.front_default ||
                pokemonData.sprites.back_default ||
                ''
            )
        };

        console.log('📤 Enviando datos filtrados:', filteredData);
        
        // 6. Responder al frontend
        res.status(200).json(filteredData);
        
    } catch (error) {
        console.error('Error interno:', error.message);
        res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message 
        });
    }
});

module.exports = router;