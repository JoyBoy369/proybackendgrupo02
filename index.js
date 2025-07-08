const express = require('express');
const cors = require('cors');
const { mongoose } = require('./database');
const cron = require('node-cron');
const funcionCtrl = require('./controllers/funcion.controller');
const dotenv = require("dotenv");
dotenv.config();

var app = express();

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
