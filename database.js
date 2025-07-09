const mongoose = require('mongoose');

// Modifica esta línea para leer la URI desde process.env
const URI = process.env.MONGODB_URI;

// Asegúrate de que la URI exista antes de intentar conectar
if (!URI) {
    console.error('Error: La variable de entorno MONGODB_URI no está definida.');
    process.exit(1); // Salir del proceso si la URI no está configurada
}

mongoose.connect(URI)
    .then(db => console.log('DB is connected'))
    .catch(err => {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1); // Salir con un error si la conexión falla
    });

module.exports = mongoose;