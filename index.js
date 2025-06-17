const path = require('path');
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('./database/config');
require('dotenv').config();

// Crear el servidor de express
const app = express();

// Conexión a la base de datos
dbConnection();

//CORS
app.use(cors());

// Directorio publico
app.use(express.static('public'));

// Lectura y parseo del body
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

app.use('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${process.env.PORT}`);
});
