/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nombre
 *         - apellido
 *         - username
 *         - password
 *         - email
 *         - rol
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único del usuario
 *         nombre:
 *           type: string
 *           description: Nombre del usuario
 *         apellido:
 *           type: string
 *           description: Apellido del usuario
 *         username:
 *           type: string
 *           description: Nombre de usuario único
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         email:
 *           type: string
 *           description: Email único del usuario
 *         rol:
 *           type: string
 *           description: Rol del usuario (administrador, empleado, cliente)
 *         estado:
 *           type: boolean
 *           description: Estado activo/inactivo del usuario
 *           default: true
 *         fechaRegistro:
 *           type: string
 *           format: date-time
 *           description: Fecha de registro del usuario
 *       example:
 *         nombre: "Carlos"
 *         apellido: "González"
 *         username: "admin_carlos"
 *         password: "Admin123456"
 *         email: "carlos.admin@cinemax.com"
 *         rol: "administrador"
 *         estado: true
 * 
 *     Pelicula:
 *       type: object
 *       required:
 *         - titulo
 *         - genero
 *         - duracion
 *         - director
 *         - reparto
 *         - sinopsis
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la película
 *         titulo:
 *           type: string
 *           description: Título de la película
 *         genero:
 *           type: string
 *           description: Género de la película
 *         duracion:
 *           type: number
 *           description: Duración en minutos
 *         director:
 *           type: string
 *           description: Director de la película
 *         reparto:
 *           type: string
 *           description: Reparto principal
 *         sinopsis:
 *           type: string
 *           description: Sinopsis de la película
 *         poster:
 *           type: string
 *           description: URL del poster
 *         estado:
 *           type: boolean
 *           description: Estado activo/inactivo
 *           default: true
 * 
 *     Funcion:
 *       type: object
 *       required:
 *         - pelicula
 *         - fecha
 *         - horario
 *         - sala
 *         - precio
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la función
 *         pelicula:
 *           type: string
 *           description: ID de la película
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha de la función
 *         horario:
 *           type: string
 *           description: Horario de la función
 *         sala:
 *           type: string
 *           description: Número de sala
 *         precio:
 *           type: number
 *           description: Precio de la entrada
 *         asientosDisponibles:
 *           type: number
 *           description: Cantidad de asientos disponibles
 *         estado:
 *           type: string
 *           description: Estado de la función
 *           enum: [activa, completada, cancelada]
 * 
 *     Reserva:
 *       type: object
 *       required:
 *         - usuario
 *         - funcion
 *         - cantidadEntradas
 *         - montoTotal
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único de la reserva
 *         usuario:
 *           type: string
 *           description: ID del usuario
 *         funcion:
 *           type: string
 *           description: ID de la función
 *         cantidadEntradas:
 *           type: number
 *           description: Cantidad de entradas reservadas
 *         montoTotal:
 *           type: number
 *           description: Monto total de la reserva
 *         fechaReserva:
 *           type: string
 *           format: date-time
 *           description: Fecha de la reserva
 *         estado:
 *           type: string
 *           description: Estado de la reserva
 *           enum: [activa, cancelada, completada]
 * 
 *     Error:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado de la respuesta
 *         msg:
 *           type: string
 *           description: Mensaje de error
 *       example:
 *         status: "0"
 *         msg: "Error en la operación"
 * 
 *     Success:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: Estado de la respuesta
 *         msg:
 *           type: string
 *           description: Mensaje de éxito
 *         data:
 *           type: object
 *           description: Datos de respuesta
 *       example:
 *         status: "1"
 *         msg: "Operación exitosa"
 *         data: {}
 */
