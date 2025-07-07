const Reserva = require('../models/reserva');
const Funcion = require('../models/funcion');
const Pelicula = require('../models/pelicula');

// Colores estáticos para los reportes
const COLORS = {
    PELICULAS: '#4CAF50',
    VENTAS: '#2196F3',
    FUNCIONES: '#FF9800',
    RESERVAS: '#9C27B0'
};

const reporteCtrl = {};

reporteCtrl.filtrarReporte = async (req, res) => {
    try {
        const { fechaInicio, fechaFin, tipo } = req.query;

        if (!fechaInicio || !fechaFin || !tipo) {
            return res.status(400).json({
                'status': '0',
                'msg': 'Faltan parámetros requeridos: fechaInicio, fechaFin y tipo'
            });
        }

        // Convertir fechas a objetos Date
        const startDate = new Date(fechaInicio);
        const endDate = new Date(fechaFin);
        endDate.setHours(23, 59, 59, 999); // Incluir todo el día final

        let reporteData;

        switch (tipo.toLowerCase()) {
            case 'ventas':
                reporteData = await getReporteVentas(startDate, endDate);
                break;
            case 'peliculas':
                reporteData = await getReportePelículas(startDate, endDate);
                break;
            case 'funciones':
                reporteData = await getReporteFunciones(startDate, endDate);
                break;
            case 'reservas':
                reporteData = await getReporteReservas(startDate, endDate);
                break;
            default:
                return res.status(400).json({
                    'status': '0',
                    'msg': 'Tipo de reporte no válido. Opciones: ventas, peliculas, funciones, reservas'
                });
        }

        return res.status(200).json(reporteData);

    } catch (error) {
        console.error("Error al filtrar reporte:", error);
        return res.status(500).json({
            'status': '0',
            'msg': 'Error al procesar la operación de filtrado de reporte.',
            'error': error.message
        });
    }
};

async function getReporteVentas(startDate, endDate) {
    try {
        // Get all reservations within date range
        const reservas = await Reserva.find({
            fecha: { $gte: startDate, $lte: endDate }
        }).populate('funcion');

        const days = [];
        const data = new Array(Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1).fill(0);
        const colors = [];
        let totalVentas = 0;
        let totalReservas = 0;
        let totalButacasOcupadas = 0;
        let totalButacasTotales = 0;

        // Calculate daily sales and totals
        reservas.forEach(reserva => {
            const dayIndex = Math.floor((new Date(reserva.fecha) - startDate) / (1000 * 60 * 60 * 24));
            if (dayIndex >= 0 && dayIndex < data.length) {
                data[dayIndex] += reserva.precioFinal;
                totalVentas += reserva.precioFinal;
                totalReservas += reserva.cantidadReservas;
            }
        });

        // Get all active functions within date range
        const funciones = await Funcion.find({
            estado: 'activa',
            fecha: { $gte: startDate, $lte: endDate }
        });

        // Calculate occupancy
        funciones.forEach(funcion => {
            totalButacasOcupadas += funcion.butacasOcupadas.length;
            totalButacasTotales += funcion.numeroButacas;
        });

        // Generate labels (day names) and colors
        for (let i = 0; i < data.length; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            days.push(date.toLocaleDateString('es-ES', { weekday: 'long' }));
            colors.push(COLORS.VENTAS);
        }

        // Calculate averages
        const promedioDiario = totalReservas / data.length;
        const ocupacion = totalButacasTotales > 0 ? (totalButacasOcupadas / totalButacasTotales) * 100 : 0;

        return {
            data: data,
            labels: days,
            backgroundColor: colors,
            totalVentas: totalVentas,
            promedioDiario: promedioDiario,
            ocupacion: ocupacion
        };
    } catch (error) {
        console.error("Error al obtener el reporte de ventas:", error);
        throw error;
    }
}

async function getReportePelículas(startDate, endDate) {
    try {
        // Get all reservations within date range
        const reservas = await Reserva.find({
            fecha: { $gte: startDate, $lte: endDate }
        }).populate('funcion');

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

        return {
            data: data,
            labels: labels,
            backgroundColor: COLORS.PELICULAS,
            topPeliculas: sortedMovies
        };
    } catch (error) {
        console.error("Error al obtener el reporte de películas:", error);
        throw error;
    }
}

async function getReporteFunciones(startDate, endDate) {
    try {
        // Get all reservations within date range
        const reservas = await Reserva.find({
            fecha: { $gte: startDate, $lte: endDate }
        }).populate('funcion');

        // Get all unique function IDs
        const funcionIds = [...new Set(reservas.map(r => r.funcion._id).filter(id => id))];

        // Get functions and their movies
        const funciones = await Funcion.find({ _id: { $in: funcionIds } })
            .populate('pelicula', 'originalTitle');

        // Create a Map of functions for easy access
        const funcionesMap = new Map(funciones.map(f => [f._id.toString(), {
            nombre: f.pelicula ? f.pelicula.originalTitle : 'Desconocido',
            hora: f.hora
        }]));

        // Initialize arrays
        const funcionData = {};

        // Calculate total reservations per function
        reservas.forEach(reserva => {
            const funcionId = reserva.funcion._id;
            if (funcionId) {
                if (!funcionData[funcionId]) {
                    const funcionInfo = funcionesMap.get(funcionId.toString());
                    funcionData[funcionId] = {
                        nombre: `${funcionInfo.nombre} - ${funcionInfo.hora}`,
                        totalReservas: 0
                    };
                }
                funcionData[funcionId].totalReservas += reserva.cantidadReservas;
            }
        });

        // Convert to array and sort by total reservations
        const sortedFunciones = Object.values(funcionData).sort((a, b) => b.totalReservas - a.totalReservas);

        // Generate response arrays
        const data = sortedFunciones.map(f => f.totalReservas);
        const labels = sortedFunciones.map(f => f.nombre);

        return {
            data: data,
            labels: labels,
            backgroundColor: COLORS.FUNCIONES,
            funciones: sortedFunciones
        };
    } catch (error) {
        console.error("Error al obtener el reporte de funciones:", error);
        throw error;
    }
}

async function getReporteReservas(startDate, endDate) {
    try {
        // Get all reservations within date range
        const reservas = await Reserva.find({
            fecha: { $gte: startDate, $lte: endDate }
        });

        // Initialize arrays
        const dailyReservas = {};

        // Calculate total reservations per day
        reservas.forEach(reserva => {
            const date = new Date(reserva.fecha);
            const day = date.toLocaleDateString('es-ES');
            if (!dailyReservas[day]) {
                dailyReservas[day] = 0;
            }
            dailyReservas[day] += reserva.cantidadReservas;
        });

        // Convert to sorted arrays
        const sortedDays = Object.entries(dailyReservas)
            .sort((a, b) => new Date(a[0]) - new Date(b[0]));

        const data = sortedDays.map(([day, count]) => count);
        const labels = sortedDays.map(([day]) => day);

        return {
            data: data,
            labels: labels,
            backgroundColor: COLORS.RESERVAS
        };
    } catch (error) {
        console.error("Error al obtener el reporte de reservas:", error);
        throw error;
    }
}

module.exports = reporteCtrl;