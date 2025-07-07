const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '7674008721:AAGoz8kBtXjvMet2KdGSgHttz4wI51k1S-s';
const CHAT_ID = '-4665440630';

const notificarNuevaPelicula = async (pelicula) => {
  try {
    const mensaje = `🎬 *¡Ven a disfrutar con nosotros de este gran estreno!*\n\n*${pelicula.originalTitle}*\n🗓 Estreno: ${pelicula.releaseDate}`;

    const imagenUrl = pelicula.primaryImage;

    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
      chat_id: CHAT_ID,
      photo: imagenUrl,
      caption: mensaje,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visita nuestro sitio web",
              url: "https://proyfrontendgrupo02.onrender.com"
            }
          ]
        ]
      }
    });
  } catch (error) {
    console.error('Error al enviar mensaje a Telegram:', error.response?.data || error.message);
  }
};

module.exports = { notificarNuevaPelicula };