require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemon');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/v1', authRoutes);
app.use('/api/v1', pokemonRoutes);

app.get('/', (req, res) => {
    res.json({
        message: 'API is running',
        endpoints: {
            login: 'POST /api/v1/auth',
            pokemon: 'POST /api/v1/pokemonDetails',
            home: 'GET /'
        },
        timestamp: new Date().toISOString()
    })
});

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

app.listen(PORT, () => {
    console.log(`📍 Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`🔑 Email válido: ${process.env.VALID_EMAIL}`);
    console.log(`🔑 Password válido: ${process.env.VALID_PASSWORD}`);
    console.log('📝 Endpoints disponibles:');
    console.log('   🔐 POST /api/v1/auth');
    console.log('   🐱‍👤 POST /api/v1/pokemonDetails (protegido)');
    console.log('   ℹ️  GET  /');
});