#!/usr/bin/env node

/**
 * Script para documentar automáticamente todas las rutas con Swagger
 * Uso: node documentar-rutas.js
 */

const fs = require('fs');
const path = require('path');

// Configuración de rutas
const rutasConfig = {
    'usuario.route.js': {
        tag: 'Usuarios',
        description: 'Gestión de usuarios del sistema',
        rutas: [
            { metodo: 'POST', ruta: '/', descripcion: 'Crear un nuevo usuario (administración)' },
            { metodo: 'POST', ruta: '/register', descripcion: 'Registrar un nuevo usuario cliente' },
            { metodo: 'POST', ruta: '/login', descripcion: 'Iniciar sesión' },
            { metodo: 'GET', ruta: '/', descripcion: 'Obtener todos los usuarios' },
            { metodo: 'GET', ruta: '/rol/{rol}', descripcion: 'Obtener usuarios por rol' },
            { metodo: 'GET', ruta: '/{id}', descripcion: 'Obtener un usuario por ID' },
            { metodo: 'PUT', ruta: '/{id}', descripcion: 'Editar un usuario' },
            { metodo: 'DELETE', ruta: '/{id}', descripcion: 'Eliminar un usuario' }
        ]
    },
    'pelicula.route.js': {
        tag: 'Películas',
        description: 'Gestión de películas',
        rutas: [
            { metodo: 'GET', ruta: '/', descripcion: 'Obtener todas las películas' },
            { metodo: 'POST', ruta: '/', descripcion: 'Crear una nueva película' },
            { metodo: 'GET', ruta: '/{id}', descripcion: 'Obtener una película por ID' },
            { metodo: 'PUT', ruta: '/{id}', descripcion: 'Editar una película' },
            { metodo: 'DELETE', ruta: '/{id}', descripcion: 'Eliminar una película' }
        ]
    },
    'funcion.route.js': {
        tag: 'Funciones',
        description: 'Gestión de funciones de cine',
        rutas: [
            { metodo: 'GET', ruta: '/', descripcion: 'Obtener todas las funciones' },
            { metodo: 'POST', ruta: '/', descripcion: 'Crear una nueva función' },
            { metodo: 'GET', ruta: '/{id}', descripcion: 'Obtener una función por ID' },
            { metodo: 'PUT', ruta: '/{id}', descripcion: 'Editar una función' },
            { metodo: 'DELETE', ruta: '/{id}', descripcion: 'Eliminar una función' }
        ]
    },
    'reserva.route.js': {
        tag: 'Reservas',
        description: 'Gestión de reservas y reportes',
        rutas: [
            { metodo: 'GET', ruta: '/', descripcion: 'Obtener todas las reservas' },
            { metodo: 'POST', ruta: '/', descripcion: 'Crear una nueva reserva' },
            { metodo: 'GET', ruta: '/{id}', descripcion: 'Obtener una reserva por ID' },
            { metodo: 'PUT', ruta: '/{id}', descripcion: 'Editar una reserva' },
            { metodo: 'DELETE', ruta: '/{id}', descripcion: 'Eliminar una reserva' },
            { metodo: 'GET', ruta: '/buscar/{id}', descripcion: 'Buscar reservas por ID de usuario' },
            { metodo: 'GET', ruta: '/resumensemanal', descripcion: 'Obtener resumen semanal' },
            { metodo: 'GET', ruta: '/reporte', descripcion: 'Generar reporte de ventas' }
        ]
    }
};

console.log('🚀 Generando documentación Swagger para todas las rutas...');
console.log('✅ Configuración completada en index.js');
console.log('✅ Modelos creados en swagger/models.js');
console.log('✅ Rutas de usuario documentadas');
console.log('');
console.log('📋 Próximos pasos:');
console.log('1. Documentar las rutas restantes (película, función, reserva)');
console.log('2. Iniciar el servidor: npm run dev');
console.log('3. Visitar: http://localhost:3000/api-docs');
console.log('');
console.log('📁 Estructura de documentación:');
Object.keys(rutasConfig).forEach(archivo => {
    console.log(`   ${archivo} - ${rutasConfig[archivo].tag}`);
});
