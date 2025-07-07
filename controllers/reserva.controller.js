const Reserva = require('../models/reserva');
const Funcion = require('../models/funcion');
const Pelicula = require('../models/pelicula');
// Importa la librería 'axios' para realizar solicitudes HTTP a APIs externas (como Mercado Pago y Placid.app).
const axios = require('axios');
const reservaCtrl = {};



//Función auxiliar que crea una promesa que se resuelve después de un tiempo determinado.
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Colores estáticos para los reportes
const COLORS = {
    PELICULAS: '#4CAF50',
    VENTAS: '#2196F3',
    FUNCIONES: '#FF9800',
    RESERVAS: '#9C27B0'
};

//Obtiene todas las reservas de la base de datos(no implemtenté ninguna en el front)
reservaCtrl.getReservas = async (req, res) => {
    try {
        const reservas = await Reserva.find().populate({
            path: 'funcion',
            populate: {
                path: 'pelicula',
                model: 'Pelicula'
            }
        });;
        res.json(reservas);
    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error al obtener las reservas.'
        });
    }
};

//Obtiene una reserva específica por su ID, incluyendo detalles de la función y la película.
reservaCtrl.getReserva = async (req, res) => {
    const { id } = req.params;
    try {
        let reserva;
        reserva = await Reserva.findById(id)
            .populate({
                path: 'funcion',
                populate: {
                    path: 'pelicula',
                    model: 'Pelicula'
                }
            });

        if (!reserva) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada.'
            });
        }
        res.json(reserva);
    } catch (error) {
        console.error("Error al obtener la reserva:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error procesando la operación.'
        });
    }
};

// Crea una nueva reserva de cine y actualiza las butacas ocupadas en la función asociada
reservaCtrl.createReserva = async (req, res) => {
    const { usuario, funcion, cantidadReservas, fecha, precioFinal, butacasReservadas, qr } = req.body;

    try {
        const funcionExistente = await Funcion.findById(funcion).populate('pelicula');

        if (!funcionExistente) {
            return res.status(404).json({
                'status': '0',
                'msg': 'La función especificada no existe.'
            });
        }

        if (butacasReservadas.length !== cantidadReservas) {
            return res.status(400).json({
                'status': '0',
                'msg': 'La cantidad de butacas seleccionadas no coincide con la cantidad total de reservas.'
            });
        }

        // Obtiene las butacas ya ocupadas de la función existente.
        const butacasOcupadas = funcionExistente.butacasOcupadas || [];
        // Comprueba si alguna de las butacas que se intentan reservar ya está ocupada.
        const butacasSolapadas = butacasReservadas.filter(butaca => butacasOcupadas.includes(butaca));
        if (butacasSolapadas.length > 0) {
            return res.status(400).json({
                'status': '0',
                'msg': `Las butacas ${butacasSolapadas.join(', ')} ya están reservadas.`,
            });
        }

        const nuevaReserva = new Reserva(req.body);
        // Guarda la nueva reserva en la base de datos.
        await nuevaReserva.save();

        // Después de guardar la reserva, la vuelve a buscar y popular para devolver un objeto completo al cliente.
        const populatedReserva = await Reserva.findById(nuevaReserva._id)
            .populate({
                path: 'funcion',
                populate: {
                    path: 'pelicula',
                    model: 'Pelicula'
                }
            });

        // Actualiza el array de 'butacasOcupadas' en la función asociada.
        // Asegura que el array exista antes de intentar hacer push.
        if (funcionExistente.butacasOcupadas) {
            funcionExistente.butacasOcupadas.push(...butacasReservadas);
            // Guarda los cambios en la función.
            await funcionExistente.save();
        }

        res.status(201).json({
            'status': '1',
            'msg': 'Reserva creada exitosamente.',
            'reserva': populatedReserva
        });
    } catch (error) {
        console.error("Error al crear la reserva:", error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación. Verifique los datos enviados.'
        });
    }
};

// Actualiza una reserva existente por su ID
reservaCtrl.editReserva = async (req, res) => {
    const { id } = req.params;
    const { _id, ...updateData } = req.body;

    try {
        // Busca la reserva por ID y la actualiza.
        // { new: true } devuelve el documento modificado.
        // { runValidators: true } ejecuta las validaciones del esquema.
        const reservaActualizada = await Reserva.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!reservaActualizada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada para actualizar.'
            });
        }

        res.json({
            'status': '1',
            'msg': 'Reserva actualizada exitosamente.',
            'reserva': reservaActualizada
        });
    } catch (error) {
        console.error("Error al actualizar la reserva:", error);
        res.status(400).json({
            'status': '0',
            'msg': 'Error procesando la operación de actualización.'
        });
    }
};

// Elimina una reserva y libera las butacas asociadas en la función
reservaCtrl.deleteReserva = async (req, res) => {
    try {
        const reservaEliminada = await Reserva.findByIdAndDelete(req.params.id);

        if (!reservaEliminada) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada para eliminar.'
            });
        }

        const funcionAsociada = await Funcion.findById(reservaEliminada.funcion);
        if (funcionAsociada) {
            funcionAsociada.butacasOcupadas = funcionAsociada.butacasOcupadas.filter(
                butaca => !reservaEliminada.butacasReservadas.includes(butaca)
            );
            // Guarda los cambios en la función para reflejar las butacas liberadas.
            await funcionAsociada.save();
        }

        res.json({
            status: '1',
            msg: '¡Reserva eliminada con éxito!',
            reserva: reservaEliminada
        });
    } catch (error) {
        console.error("Error al eliminar la reserva:", error);
        res.status(500).json({
            'status': '0',
            'msg': 'Error al eliminar la reserva.'
        });
    }
};


reservaCtrl.getResumenSemanal = async (req, res) => {
    try {
        const hoy = new Date();
        // Establece la hora al final del día de hoy para incluir todas las reservas de hoy
        hoy.setHours(23, 59, 59, 999);

        // Calcula la fecha de hace 7 días, comenzando al inicio de ese día
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hoy.getDate() - 6); // Restamos 6 para incluir el día actual y los 6 anteriores
        hace7Dias.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

        const ventasPorDia = await Reserva.aggregate([
            {
                $match: {
                    // Aseguramos que la fecha de la reserva esté en el rango inclusivo
                    fecha: { $gte: hace7Dias, $lte: hoy }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$fecha" } // Agrupa por fecha (formato YYYY-MM-DD)
                    },
                    totalBoletosVendidos: { $sum: "$cantidadReservas" } // Suma la cantidad de reservas por día
                }
            },
            {
                $sort: { _id: 1 } // Ordena por fecha ascendente
            }
        ]);

        // Preparar los datos para Chart.js
        const labels = [];
        const data = [];
        const backgroundColors = ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'];

        // Mapear las ventas obtenidas para facilitar la búsqueda
        const ventasMap = new Map(ventasPorDia.map(item => [item._id, item.totalBoletosVendidos]));

        // Llenar los datos para los últimos 7 días
        for (let i = 0; i < 7; i++) {
            const fechaIteracion = new Date(hace7Dias);
            fechaIteracion.setDate(hace7Dias.getDate() + i);
            const fechaFormateada = fechaIteracion.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            const boletosVendidos = ventasMap.get(fechaFormateada) || 0; // Obtiene el total o 0 si no hay ventas

            labels.push(fechaFormateada);
            data.push(boletosVendidos);
        }

        res.status(200).json({
            labels: labels,
            data: data,
            backgroundColor: backgroundColors
        });

    } catch (error) {
        console.error("Error al obtener las ventas de los últimos 7 días:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }

};

reservaCtrl.getIngresosSemanales = async (req, res) => {
    try {
        const hoy = new Date();
        // Establece la hora al final del día de hoy para incluir todas las reservas de hoy
        hoy.setHours(23, 59, 59, 999);

        // Calcula la fecha de hace 7 días, comenzando al inicio de ese día
        const hace7Dias = new Date(hoy);
        hace7Dias.setDate(hoy.getDate() - 6); // Restamos 6 para incluir el día actual y los 6 anteriores
        hace7Dias.setHours(0, 0, 0, 0); // Establece la hora al inicio del día

        const ingresosPorDia = await Reserva.aggregate([
            {
                $match: {
                    // Aseguramos que la fecha de la reserva esté en el rango inclusivo
                    fecha: { $gte: hace7Dias, $lte: hoy }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$fecha" } // Agrupa por fecha (formato YYYY-MM-DD)
                    },
                    totalIngresosDiarios: { $sum: "$precioFinal" } // Suma el precioFinal por día
                }
            },
            {
                $sort: { _id: 1 } // Ordena por fecha ascendente
            }
        ]);

        // Preparar los datos para Chart.js
        const labels = [];
        const data = [];
        // Puedes definir un array de colores fijos como hiciste, o generarlos dinámicamente
        const backgroundColors = ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)', 'rgba(153, 102, 255, 0.6)', 'rgba(255, 159, 64, 0.6)', 'rgba(255, 99, 132, 0.6)', 'rgba(75, 192, 192, 0.6)'];

        // Mapear los ingresos obtenidos para facilitar la búsqueda
        const ingresosMap = new Map(ingresosPorDia.map(item => [item._id, item.totalIngresosDiarios]));

        // Llenar los datos para los últimos 7 días
        for (let i = 0; i < 7; i++) {
            const fechaIteracion = new Date(hace7Dias);
            fechaIteracion.setDate(hace7Dias.getDate() + i);
            const fechaFormateada = fechaIteracion.toISOString().split('T')[0]; // Formato YYYY-MM-DD

            const ingresosDelDia = ingresosMap.get(fechaFormateada) || 0; // Obtiene el total o 0 si no hay ingresos

            labels.push(fechaFormateada);
            data.push(ingresosDelDia);
            // Si quieres colores dinámicos aquí, usarías: backgroundColors.push(generarColorAleatorio());
        }

        res.status(200).json({
            labels: labels,
            data: data,
            backgroundColor: backgroundColors
        });

    } catch (error) {
        console.error("Error al obtener los ingresos de los últimos 7 días:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

reservaCtrl.getIngresosAnuales = async (req, res) => {
    try {
        // Get current date and first day of the year
        const fechaActual = new Date();
        const primerDiaAno = new Date(fechaActual.getFullYear(), 0, 1);

        // Get income by month for the current year
        const ingresos = await Reserva.aggregate([
            {
                $match: {
                    fecha: {
                        $gte: primerDiaAno,
                        $lte: fechaActual
                    }
                }
            },
            {
                $group: {
                    _id: {
                        mes: { $month: "$fecha" },
                        anio: { $year: "$fecha" }
                    },
                    totalIngreso: {
                        $sum: "$precioFinal"
                    }
                }
            },
            {
                $sort: {
                    '_id.mes': 1
                }
            }
        ]);

        console.log('Ingresos anuales:', ingresos);

        // Generate labels for all months of the year
        const labels = [];
        const data = [];
        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril',
            'Mayo', 'Junio', 'Julio', 'Agosto',
            'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        for (let mes = 1; mes <= 12; mes++) {
            labels.push(meses[mes - 1]);
            const ingresoMes = ingresos.find(d => d._id.mes === mes);
            data.push(ingresoMes ? ingresoMes.totalIngreso : 0);
        }

        // Format response with colors for the chart
        const backgroundColors = [
            'rgba(255, 99, 132, 0.6)'
        ];


        res.status(200).json({
            labels: labels,
            data: data,
            backgroundColor: backgroundColors
        });

    } catch (error) {
        console.error("Error al obtener ingresos mensuales:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener ingresos mensuales." });
    }
};

reservaCtrl.getTotalVentasUltimoMes = async (req, res) => {
    try {
        // Get current date and date from one month ago
        const fechaActual = new Date();
        const fechaUnMesAtras = new Date();
        fechaUnMesAtras.setMonth(fechaActual.getMonth() - 1);

        // Get total sales and tickets for the last month
        const resultado = await Reserva.aggregate([
            {
                $match: {
                    fecha: {
                        $gte: fechaUnMesAtras,
                        $lte: fechaActual
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalVentas: {
                        $sum: "$precioFinal"
                    },
                    totalBoletos: {
                        $sum: "$cantidadReservas"
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalVentas: {
                        $round: ["$totalVentas", 2]
                    },
                    totalBoletos: 1
                }
            }
        ]);

        console.log('Resultado:', resultado);

        // Format response
        const data = resultado.length > 0 ? resultado[0] : {
            totalVentas: 0,
            totalBoletos: 0
        };

        res.status(200).json({
            totalVentas: data.totalVentas,
            totalBoletos: data.totalBoletos
        });

    } catch (error) {
        console.error("Error al obtener las ventas del último mes:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener las ventas del último mes." });
    }
};

reservaCtrl.getVentasPorPelicula = async (req, res) => {
    try {
        // Obtener todas las reservas con sus funciones
        const reservas = await Reserva.find({}, { funcion: 1, cantidadReservas: 1 })
            .lean();

        // Obtener todos los IDs únicos de funciones
        const funcionIds = [...new Set(reservas.map(r => r.funcion).filter(id => id))];

        // Obtener las funciones y sus películas en una sola consulta
        const funciones = await Funcion.find({ _id: { $in: funcionIds } })
            .populate('pelicula', 'originalTitle')
            .select('pelicula');

        // Crear un Map de películas para fácil acceso
        const peliculasMap = new Map(funciones.map(f => [f._id.toString(), {
            nombre: f.pelicula ? f.pelicula.originalTitle : 'Desconocido'
        }]));

        // Agrupar reservas por película y obtener detalles
        const ventasPorPelicula = reservas.reduce((acc, reserva) => {
            const funcionId = reserva.funcion;
            if (funcionId) {
                const peliculaInfo = peliculasMap.get(funcionId.toString());
                const peliculaId = funcionId;
                
                if (!acc[peliculaId]) {
                    acc[peliculaId] = { 
                        peliculaId: peliculaId,
                        pelicula: peliculaInfo.nombre,
                        totalVentas: 0
                    };
                }
                acc[peliculaId].totalVentas += reserva.cantidadReservas;
            }
            return acc;
        }, {});

        // Convertir a array y ordenar por ventas totales
        const result = Object.values(ventasPorPelicula)
            .sort((a, b) => b.totalVentas - a.totalVentas);

        // Formatear respuesta
        const labels = result.map(item => item.pelicula);
        const data = result.map(item => item.totalVentas);
        const backgroundColors = [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
        ];
        const repeatedBackgroundColors = Array(data.length).fill(backgroundColors).flat().slice(0, data.length);

        res.status(200).json({
            labels: labels,
            data: data,
            backgroundColor: repeatedBackgroundColors
        });

    } catch (error) {
        console.error("Error al obtener las ventas por película:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener las ventas por película." });
    }
};

reservaCtrl.getAsistenciaPorFuncion = async (req, res) => {
    try {
        // Get attendance data by function
        // Obtener todas las reservas con sus detalles
        const reservas = await Reserva.find({}, { funcion: 1, cantidadReservas: 1 })
            .populate('funcion', 'pelicula sala hora fecha')
            .populate('funcion.pelicula', 'originalTitle')
            .lean();
        console.log('Reservas encontradas:', reservas);

        // Agrupar reservas por función y obtener detalles
        const asistenciaPorFuncion = reservas.reduce((acc, reserva) => {
            const funcionId = reserva.funcion._id.toString();
            const cantidad = reserva.cantidadReservas;
            const funcion = reserva.funcion;

            if (!acc[funcionId]) {
                acc[funcionId] = {
                    funcion: funcionId,
                    totalAsistencia: 0,
                    detalles: {
                        pelicula: funcion.pelicula.originalTitle,
                        sala: funcion.sala,
                        hora: funcion.hora,
                        fecha: funcion.fecha
                    }
                };
            }
            acc[funcionId].totalAsistencia += cantidad;

            return acc;
        }, {});

        // Convertir a array y ordenar
        const result = Object.values(asistenciaPorFuncion)
            .sort((a, b) => new Date(b.detalles.fecha) - new Date(a.detalles.fecha));

        console.log('Resultado final:', result);

        // Format response similar to getResumenSemanal and getIngresosSemanales
        const labels = result.map(item => {
            const { detalles } = item;
            const fechaFormateada = new Date(detalles.fecha).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
            return `${detalles.pelicula} - Sala ${detalles.sala} - ${detalles.hora} - ${fechaFormateada}`;
        });
        const data = result.map(item => item.totalAsistencia);
        const backgroundColors = [
            'rgba(54, 162, 235, 0.6)',
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 159, 64, 0.6)',
            'rgba(255, 99, 132, 0.6)'
        ];
        const repeatedBackgroundColors = Array(data.length).fill(backgroundColors).flat().slice(0, data.length);

        res.status(200).json({
            labels: labels,
            data: data,
            backgroundColor: repeatedBackgroundColors
        });

    } catch (error) {
        console.error("Error al obtener la asistencia por función:", error);
        res.status(500).json({ message: "Error interno del servidor al obtener la asistencia por función." });
    }
};

reservaCtrl.getReservasByUser = async (req, res) => {
    try {
        // 1. Obtener el ID de usuario de los parámetros de la solicitud
        const { id } = req.params;

        // 2. Validar que el ID de usuario exista
        if (!id) {
            return res.status(400).json({
                message: 'Se requiere el ID de usuario en los parámetros de la URL.'
            });
        }

        // 3. Buscar las reservas en la base de datos
        const reservas = await Reserva.find({ usuario: id })
            .populate('funcion')
            .sort({ fecha: -1 }); // Ordenar las reservas por fecha, las más recientes primero

        // 4. Verificar si se encontraron reservas
        if (reservas.length === 0) {
            return res.status(404).json({
                message: 'No se encontraron reservas para el usuario con ID: ${id}'
            });
        }

        // 5. Enviar las reservas encontradas como respuesta
        res.status(200).json(reservas);

    } catch (error) {
        // Manejo de errores en caso de problemas con la base de datos o cualquier otra excepción
        console.error('Error al obtener reservas por usuario:', error);
        res.status(500).json({
            message: 'Error interno del servidor al obtener las reservas.',
            error: error.message
        });
    }
};

reservaCtrl.getReporteVentas = async (req, res) => {
    try {
        // Get the date 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Get all reservations from the last 7 days
        const reservas = await Reserva.find({
            fecha: { $gte: sevenDaysAgo }
        }).populate('funcion');

        // Initialize arrays and counters
        const days = [];
        const data = new Array(7).fill(0);
        const colors = [];
        let totalVentas = 0;
        let totalReservas = 0;
        let totalButacasOcupadas = 0;
        let totalButacasTotales = 0;

        // Calculate daily sales and totals
        reservas.forEach(reserva => {
            const dayIndex = Math.floor((new Date(reserva.fecha) - sevenDaysAgo) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < 7) {
                data[dayIndex] += reserva.precioFinal;
                totalVentas += reserva.precioFinal;
                totalReservas += reserva.cantidadReservas;
            }
        });

        // Get all active functions from the last 7 days
        const funciones = await Funcion.find({
            estado: 'activa',
            fecha: { $gte: sevenDaysAgo }
        });

        // Calculate occupancy
        funciones.forEach(funcion => {
            totalButacasOcupadas += funcion.butacasOcupadas.length;
            totalButacasTotales += funcion.numeroButacas;
        });

        // Generate labels (day names) and colors
        for (let i = 0; i < 7; i++) {
            const date = new Date(sevenDaysAgo);
            date.setDate(sevenDaysAgo.getDate() + i);
            days.push(date.toLocaleDateString('es-ES', { weekday: 'long' }));
            colors.push(COLORS.VENTAS);
        }

        // Calculate averages
        const promedioDiario = totalReservas / 7;
        const ocupacion = totalButacasTotales > 0 ? (totalButacasOcupadas / totalButacasTotales) * 100 : 0;

        return res.status(200).json({
            data: data,
            labels: days,
            backgroundColor: colors,
            totalVentas: totalVentas,
            promedioDiario: promedioDiario,
            ocupacion: ocupacion
        });

    } catch (error) {
        console.error("Error al obtener el reporte de ventas:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de reporte de ventas.',
            'error': error.message
        });
    }
}

reservaCtrl.getReportePelículas = async (req, res) => {
    try {
        // Get all reservations with their associated functions
        const reservas = await Reserva.find()
            .populate('funcion');

        // Get all unique movie IDs from functions
        const movieIds = [...new Set(reservas.map(r => r.funcion.pelicula).filter(id => id))];

        // Get movie titles
        const peliculas = await Pelicula.find({ _id: { $in: movieIds } });
        const peliculasMap = new Map(peliculas.map(p => [p._id.toString(), p.originalTitle]));

        // Initialize arrays
        const movieData = {};

        // Calculate total reservations per movie
        reservas.forEach(reserva => {
            const movieId = reserva.funcion.pelicula;
            if (movieId) {
                if (!movieData[movieId]) {
                    movieData[movieId] = {
                        nombre: peliculasMap.get(movieId.toString()) || 'Desconocido',
                        totalReservas: 0
                    };
                }
                movieData[movieId].totalReservas += reserva.cantidadReservas;
            }
        });

        // Convert to array and sort by totalReservas (descending)
        const sortedMovies = Object.values(movieData).sort((a, b) => b.totalReservas - a.totalReservas);

        // Generate data arrays
        const data = sortedMovies.map(movie => movie.totalReservas);
        const labels = sortedMovies.map(movie => movie.nombre);
        const backgroundColor = [];

        // Generate colors based on number of movies
        const colorCount = sortedMovies.length;
        for (let i = 0; i < colorCount; i++) {
            backgroundColor.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
        }

        return res.status(200).json({
            data: data,
            labels: labels,
            backgroundColor: backgroundColor,
            topPeliculas: sortedMovies
        });

    } catch (error) {
        console.error("Error al obtener el reporte de películas:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de reporte de películas.',
            'error': error.message
        });
    }
}

reservaCtrl.getReporteFunciones = async (req, res) => {
    try {
        // Obtener todas las reservas con sus funciones
        const reservas = await Reserva.find()
            .populate('funcion');

        // Obtener todos los IDs únicos de funciones
        const funcionIds = [...new Set(reservas.map(r => r.funcion._id).filter(id => id))];

        // Obtener las funciones y sus películas
        const funciones = await Funcion.find({ _id: { $in: funcionIds } })
            .populate('pelicula', 'originalTitle');

        // Crear un Map de funciones para fácil acceso
        const funcionesMap = new Map(funciones.map(f => [f._id.toString(), {
            nombre: f.pelicula ? f.pelicula.originalTitle : 'Desconocido',
            hora: f.hora
        }]));

        // Inicializar arrays
        const funcionData = {};

        // Calcular total de reservas por función
        reservas.forEach(reserva => {
            const funcionId = reserva.funcion._id;
            if (funcionId) {
                if (!funcionData[funcionId]) {
                    const funcionInfo = funcionesMap.get(funcionId.toString());
                    funcionData[funcionId] = {
                        nombre: '${funcionInfo.nombre} - ${funcionInfo.hora}',
                        totalReservas: 0
                    };
                }
                funcionData[funcionId].totalReservas += reserva.cantidadReservas;
            }
        });

        // Convertir a array y ordenar por total de reservas
        const sortedFunciones = Object.values(funcionData).sort((a, b) => b.totalReservas - a.totalReservas);

        // Generar arrays de respuesta
        const data = sortedFunciones.map(f => f.totalReservas);
        const labels = sortedFunciones.map(f => f.nombre);

        return res.status(200).json({
            data: data,
            labels: labels,
            backgroundColor: COLORS.FUNCIONES,
            funciones: sortedFunciones
        });

    } catch (error) {
        console.error("Error al obtener el reporte de funciones:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de reporte de funciones.',
            'error': error.message
        });
    }
}

reservaCtrl.getReporteReservas = async (req, res) => {
    try {
        // Obtener todas las reservas
        const reservas = await Reserva.find();

        // Inicializar arrays
        const dailyReservas = {};

        // Calcular total de reservas por día
        reservas.forEach(reserva => {
            const date = new Date(reserva.fecha);
            const day = date.toLocaleDateString('es-ES');
            if (!dailyReservas[day]) {
                dailyReservas[day] = 0;
            }
            dailyReservas[day] += reserva.cantidadReservas;
        });

        // Convertir a arrays ordenados
        const sortedDays = Object.entries(dailyReservas)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const data = sortedDays.map(([day, count]) => count);
        const labels = sortedDays.map(([day]) => day);

        return res.status(200).json({
            data: data,
            labels: labels,
            backgroundColor: COLORS.RESERVAS
        });

    } catch (error) {
        console.error("Error al obtener el reporte de reservas:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de reporte de reservas.',
            'error': error.message
        });
    }
};

//Metodo para generar tickets con Placid: Genera una imagen de ticket visual utilizando la API de Placid.app y guarda la URL de la imagen generada en la reserva.
reservaCtrl.generatePlacidTicket = async (req, res) => {
    try {
        const { reservaId } = req.body; // Obtiene el ID de la reserva del cuerpo de la solicitud.

        if (!reservaId) {
            return res.status(400).json({
                'status': '0',
                'msg': 'El ID de la reserva es requerido para generar el ticket.'
            });
        }

        // Busca la reserva completa, incluyendo la función y la película, para obtener todos los datos del ticket.
        const reservaCompleta = await Reserva.findById(reservaId)
            .populate({
                path: 'funcion',
                populate: {
                    path: 'pelicula',
                    model: 'Pelicula'
                }
            });

        // Validaciones para asegurar que la reserva y sus relaciones existan.
        if (!reservaCompleta) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Reserva no encontrada en la base de datos.'
            });
        }
        if (!reservaCompleta.funcion) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Función asociada a la reserva no encontrada.'
            });
        }
        if (!reservaCompleta.funcion.pelicula) {
            return res.status(404).json({
                'status': '0',
                'msg': 'Película asociada a la función de la reserva no encontrada.'
            });
        }

        // Obtiene la API Key de Placid.app desde las variables de entorno.
        const placidApiKey = process.env.PLACID_API_KEY;

        // Prepara los datos para los "layers" (capas) de la plantilla de Placid.app.
        const seatText = reservaCompleta.butacasReservadas.join(', '); // Butacas separadas por coma.
        const functionDate = new Date(reservaCompleta.funcion.fecha);
        // Formatea la fecha a AAAA/MM/DD.
        const formattedDate = `${functionDate.getFullYear()}/${(functionDate.getMonth() + 1).toString().padStart(2, '0')}/${functionDate.getDate().toString().padStart(2, '0')}`;

        const locationText = reservaCompleta.funcion.sala + ' - ' + reservaCompleta.funcion.hora; // Sala y hora.
        const titleText = reservaCompleta.funcion.pelicula.originalTitle; // Título de la película.
        const placidBody = {
            "template_uuid": "8bizxeobyuu8b", // ID de la plantilla de Placid.app.
            "layers": {
                "seat": { "text": seatText },       // Texto para las butacas.
                "date": { "text": formattedDate },  // Texto para la fecha.
                "location": { "text": locationText }, // Texto para la ubicación (sala y hora).
                "title": { "text": titleText }      // Texto para el título de la película.
            }
        };

        console.log("Enviando solicitud inicial a Placid.app...");
        // Realiza la solicitud POST inicial a Placid.app para iniciar la generación de la imagen.
        const initialPlacidResponse = await axios.post(
            'https://api.placid.app/api/rest/images',
            placidBody,
            {
                headers: {
                    'Authorization': `Bearer ${placidApiKey}`, // Autenticación con la API Key de Placid.app.
                    'Content-Type': 'application/json'
                }
            }
        );

        // Extrae el estado inicial, la URL de la imagen (puede estar vacía si aún no está lista)
        // y la URL de polling para verificar el estado de la generación.
        let currentStatus = initialPlacidResponse.data.status;
        let imageUrl = initialPlacidResponse.data.image_url;
        let pollingUrl = initialPlacidResponse.data.polling_url;
        const maxAttempts = 10; // Número máximo de intentos para hacer polling.
        const delayBetweenAttempts = 2000; // Retraso en milisegundos entre cada intento de polling.

        console.log(`Estado inicial de Placid: ${currentStatus}. Polling URL: ${pollingUrl}`);

        // **Mecanismo de Polling:**
        // Bucle para verificar el estado de la generación de la imagen hasta que esté 'finished' o se excedan los intentos.
        for (let i = 0; i < maxAttempts && currentStatus !== 'finished'; i++) {
            await delay(delayBetweenAttempts); // Espera antes del siguiente intento.
            console.log(`Intento de polling ${i + 1}/${maxAttempts} para ${pollingUrl}`);

            // Realiza una solicitud GET a la URL de polling para obtener el estado actual de la imagen.
            const pollingResponse = await axios.get(
                pollingUrl,
                {
                    headers: {
                        'Authorization': `Bearer ${placidApiKey}`
                    }
                }
            );

            // Actualiza el estado actual y la URL de la imagen con la respuesta del polling.
            currentStatus = pollingResponse.data.status;
            imageUrl = pollingResponse.data.image_url;

            console.log(`Estado actual: ${currentStatus}, Image URL: ${imageUrl}`);

            // Si el estado es 'failed', significa que la generación de la imagen falló.
            if (currentStatus === 'failed') {
                console.error("Placid.app falló al generar la imagen:", pollingResponse.data.errors);
                return res.status(500).json({
                    'status': '0',
                    'msg': 'Placid.app falló al generar la imagen.',
                    'errors': pollingResponse.data.errors
                });
            }
        }

        // Después del bucle de polling, si se obtuvo una URL de imagen.
        if (imageUrl) {
            console.log("Imagen Placid generada con éxito:", imageUrl);

            // Actualiza el campo 'imagen' de la reserva en la base de datos con la URL de la imagen generada.
            await Reserva.findByIdAndUpdate(
                reservaId,
                { imagen: imageUrl },
                { new: true } // Devuelve el documento actualizado.
            );

            // Devuelve una respuesta de éxito con la URL de la imagen.
            return res.status(200).json({
                'status': '1',
                'msg': 'Ticket Placid generado y URL obtenida.',
                'image_url': imageUrl,
                'reserva_id': reservaId
            });
        } else {
            // Si después de todos los intentos no se obtuvo una URL de imagen.
            console.error("No se pudo obtener la URL de la imagen después de múltiples intentos.");
            return res.status(500).json({
                'status': '0',
                'msg': 'No se pudo generar la imagen del ticket en el tiempo esperado.'
            });
        }

    } catch (error) {
        console.error("Error en backend al generar ticket Placid (general):", error.response ? error.response.data : error.message);
        return res.status(error.response && error.response.status ? error.response.status : 500).json({
            'status': '0',
            'msg': 'Error al procesar la solicitud para generar el ticket Placid.',
            'error': error.response ? error.response.data : error.message
        });
    }
};

module.exports = reservaCtrl;