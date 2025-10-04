//Dependencias
const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/auth');

// Post para obtener los detalles de un Pokémon
router.post('/pokemonDetails', authenticateToken, async (req, res) => {

    try {
        //Extracción del nombre del Pokémon del cuerpo del request
        const { pokemonName } = req.body;
        
        //Validación de que se haya proporcionado un nombre
        if (!pokemonName) {
        return res.status(400).json({
            name: "",
            species: "",
            weight: "",
            img_url: ""
        });
        }

        // Fetch a la API para obtener el Pokémon
        const apiURL = process.env.API_URL || 'https://pokeapi.co/api/v2/pokemon/';
        const response = await fetch(`${apiURL}${pokemonName.toLowerCase()}`);
        
        //Acá se verifica si el Pokémon existe
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

        //Datos del Pokémon
        const pokemonData = await response.json();
        console.log('Pokémon encontrado:', pokemonData.name);

        //Formateo de datos para envíarlos al frontend
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
        
        // Respuesta al frontend por medio de JSON de los datos filtrados
        res.status(200).json(filteredData);
        
    } catch (error) {
        //Manejo de errores
        res.status(500).json({ 
        error: 'Error interno del servidor',
        details: error.message 
        });
    }
});

//Exportación del router
module.exports = router;