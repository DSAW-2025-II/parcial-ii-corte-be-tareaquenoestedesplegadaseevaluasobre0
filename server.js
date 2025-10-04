require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemon');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration to allow FE origin and Authorization header
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const corsOptions = {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
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

module.exports = app;