// Importa la librería 'axios' para realizar solicitudes HTTP a APIs externas.
const axios = require("axios");
const Reserva = require('../models/reserva');
const urlRender=   "https://proyfrontendgrupo02.onrender.com";


const mpCtrl = {};

//Metodo para obtener un link de pago Crea una preferencia de pago en Mercado Pago y devuelve el link para redirigir al usuario.

mpCtrl.getPaymentLink = async (req, res) => {
    try {
        // URL de la API de Mercado Pago para crear preferencias de checkout.
        const url = "https://api.mercadopago.com/checkout/preferences";
        // Se incluye 'reservationId' que es fundamental para vincular el pago a una reserva específica.
        const { payer_email, title, description, picture_url, category_id, quantity, unit_price, reservationId } = req.body;

        // Verifica que todos los campos requeridos para crear una preferencia de pago estén presentes.
        // 'reservationId' es crítico para la lógica de negocio.
        if (!payer_email || !title || !unit_price || !quantity || !reservationId) {
            return res.status(400).json({ error: true, msg: "Faltan detalles de pago requeridos: email del pagador, título, precio unitario, cantidad o ID de reserva." });
        }

        // Construye el cuerpo de la solicitud para la API de Mercado Pago.
        const body = {
            payer_email: payer_email, // Email del comprador.
            items: [ // Array de ítems que se van a pagar. En este caso, una sola entrada/reserva.
                {
                    title: title || "Entradas para cine",  // Título del ítem (ej. "Entradas para cine")
                    description: description || "Reserva de butacas para función de cine.", // Descripción del ítem. Si no se provee, usa un valor por defecto relevante.
                    picture_url: picture_url || "https://example.com/movie_ticket_icon.png", // URL de una imagen del ítem. Si no se provee, usa una por defecto.
                    category_id: category_id || "Entradas", // Categoría del ítem (útil para reportes de MP). "tickets" es una buena opción para este caso.
                    quantity: quantity, // Cantidad de ítems (ej. número de butacas).
                    unit_price: unit_price // Precio unitario del ítem.
                }
            ],
            back_urls: { // URLs a las que Mercado Pago redirigirá al usuario después del proceso de pago. 
                        //(Cambiarlo los links cuando se suba el sitio a producción )
                failure: `${urlRender}/pago/fallido`,   // URL para pago fallido.
                pending: `${urlRender}/pago/pendiente`, // URL para pago pendiente.
                success: `${urlRender}/pago/exitoso`   // URL para pago exitoso.
            },
            external_reference: reservationId, // **Referencia externa crucial:** Aquí se envía el ID de reserva.
                                              // Esto permite vincular la notificación de pago de MP con tu reserva interna.
           auto_return: "all" // Redirige automáticamente al usuario a una de las back_urls después de la interacción.
        };

        // Realiza una solicitud POST a la API de Mercado Pago para crear la preferencia.
        const payment = await axios.post(url, body, {
            headers: {
                "Content-Type": "application/json", // Indica que el cuerpo de la solicitud es JSON.
                Authorization: `Bearer ${process.env.ACCESS_TOKEN}` // Token de acceso de Mercado Pago para autenticación.
            }
        });

        // Si la solicitud es exitosa, devuelve los datos de la respuesta de Mercado Pago (que incluyen el link de pago).
        return res.status(200).json(payment.data);
    } catch (error) {
        // Captura y maneja cualquier error que ocurra durante la solicitud a Mercado Pago.
        // Muestra en consola el error detallado si está disponible en error.response.data.
        console.error("Error al crear el link de pago:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: true, msg: "Fallo al crear el link de pago." });
    }
};

// Metodo para manejar webhooks de Mercado Pago: Recibe y procesa las notificaciones (webhooks) de Mercado Pago sobre el estado de los pagos.

mpCtrl.handleWebhook = async (req, res) => {
    try {
        const { type, data } = req.body; // Desestructura el tipo de evento y los datos de la notificación.

        // Mercado Pago envía diferentes tipos de notificaciones (payment, merchant_order, etc.).
        // Solo nos interesa procesar las notificaciones de tipo 'payment' que tienen un 'id' de datos.
        if (type === 'payment' && data && data.id) {
            const paymentId = data.id; // Obtiene el ID del pago de la notificación.

            // Obtiene los detalles completos del pago directamente desde la API de Mercado Pago usando el paymentId.
            // Esto asegura que la información del estado del pago es auténtica y no ha sido manipulada.
            const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
            const paymentDetails = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${process.env.ACCESS_TOKEN}` // Autorización con el token de acceso.
                                                                        // Cambiarlo por uno de una cuenta real de Mercado Pago cuando estemos en producción.
                }
            });

            // Obtiene el estado del pago (approved, pending, rejected) y la referencia externa (tu reservationId).
            const paymentStatus = paymentDetails.data.status;
            const externalReference = paymentDetails.data.external_reference; // Este es el reservationId que enviaste.

            // Procede solo si existe una referencia externa.
            if (externalReference) {
                // Busca la reserva en tu base de datos usando el externalReference (reservationId).
                const reservation = await Reserva.findById(externalReference);

                // Si la reserva existe en tu base de datos.
                if (reservation) {
                    // Actualiza el estado de pago de la reserva según el estado recibido de Mercado Pago.
                    if (paymentStatus === 'approved') {
                        reservation.pagado = 'pagado';
                        // NOTA: Si las butacas ocupadas en la función no se marcaron al crear la reserva
                        // (es decir, se marcan solo cuando el pago es aprobado), este es el lugar para hacerlo.
                        // Podrías necesitar un servicio o lógica adicional para actualizar el documento de la Función.
                    } else if (paymentStatus === 'pending') {
                        reservation.pagado = 'pendiente';
                    } else if (paymentStatus === 'rejected') {
                        reservation.pagado = 'rechazado';
                    }
                    // Guarda los cambios en el documento de la reserva en la base de datos.
                    await reservation.save();
                    console.log(`Reserva ${externalReference} actualizada a estado: ${paymentStatus}`);
                } else {
                    // Si la reserva no se encuentra en tu base de datos, imprime una advertencia.
                    console.warn(`Webhook: Reserva con ID ${externalReference} no encontrada.`);
                }
            } else {
                // Si no hay external_reference en la notificación de MP (lo cual sería inusual si lo enviaste correctamente).
                console.warn("Webhook: No se encontró external_reference en los datos de pago.");
            }
        }
        // Siempre devuelve una respuesta HTTP 200 (OK) al webhook de Mercado Pago,
        // incluso si no se procesó la notificación (ej. no era de tipo 'payment').
        // Esto le indica a Mercado Pago que la notificación fue recibida correctamente.
        res.status(200).send('Webhook recibido');
    } catch (error) {
        console.error("Error en el webhook de Mercado Pago:", error.response ? error.response.data : error.message);
        res.status(500).send('Error procesando webhook');
    }
};

module.exports = mpCtrl;