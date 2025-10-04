//Cargado de variables de entorno
require('dotenv').config();

//Importación de dependencias y routes
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemon');

//Inicialización de app por medio de express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir solicitudes desde el frontend
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';
const corsOptions = {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

//Middlewares globales
app.use(cors(corsOptions));
app.use(express.json());

//Configuración de las distintas rutas al servidor
app.use('/api/v1', authRoutes);
app.use('/api/v1', pokemonRoutes);

//Ruta principal
app.get('/', (req, res) => {
    //Respuesta JSON para las operaciones de la API
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

//Manejo de rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

//Exportación del módulo app
module.exports = app;