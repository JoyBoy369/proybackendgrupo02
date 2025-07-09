// Configurar dotenv ANTES de importar otros módulos que puedan usar variables de entorno
const dotenv = require("dotenv");
dotenv.config();

const express = require('express');
const cors = require('cors');
const { mongoose } = require('./database');
const cron = require('node-cron');
const funcionCtrl = require('./controllers/funcion.controller');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

var app = express();

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Sistema de Cine',
            version: '1.0.0',
            description: 'API para el sistema de gestión de cine con reservas, películas, funciones y usuarios',
        },
        servers: [
            {
                url: 'https://proybackendgrupo02.onrender.com',
                description: 'Servidor de producción',
            },
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: ['./routes/*.js', './swagger/*.js'], // archivos que contienen anotaciones de Swagger
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(cors({ origin: 'https://proyfrontendgrupo02.onrender.com' }));

app.use('/api/usuario', require('./routes/usuario.route.js'));
app.use('/api/pelicula', require('./routes/pelicula.route.js'));
app.use('/api/funcion', require('./routes/funcion.route.js'));
app.use('/api/reserva', require('./routes/reserva.route.js'));
app.use('/api/reporte', require('./routes/reporte.route.js'));

app.set('port', process.env.PORT || 3000);
//Mercado Pago
app.use('/api/mp', require('./routes/mp.routes.js'));

// Tarea programada para archivar funciones pasadas
// Se ejecutará cada día a la medianoche (00:00 AM) hora del servidor donde se ejecute este proceso.
// Esto significa que las funciones con 'fecha' anterior al día actual, y con estado 'activa',
// serán marcadas como 'completada'.
cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando tarea programada: Archivando funciones pasadas...');
    const result = await funcionCtrl.archivePastFunciones();
    console.log(result.msg);
});

app.listen(app.get('port'), () => {
    console.log(`Server started on port`, app.get('port'));
});