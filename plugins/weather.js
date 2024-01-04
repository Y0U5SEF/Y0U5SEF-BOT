import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn }) => {
    const url = 'https://www.meteoblue.com/en/weather/week/agdz_morocco_2561539';  // Example URL
    console.log('Fetching URL:', url);

    try {
        const response = await axios.get(url);
        console.log('URL Response Received');
        const $ = cheerio.load(response.data);
        console.log('Cheerio Loaded');

        const location = $('.main-heading').text().trim();  
        console.log('Location:', location);

        const temperature = $('.current-temp').text().trim();  
        console.log('Temperature:', temperature);

        const weatherMessage = `Current Weather in ${location}: ${temperature}`;
        console.log('Weather Message:', weatherMessage);

        await conn.sendMessage(m.chat, { text: weatherMessage }, { quoted: m });
        console.log('Message sent to user');
    } catch (error) {
        console.error('Error fetching weather data:', error);
        await conn.sendMessage(m.chat, { text: 'Error fetching weather data.' }, { quoted: m });
        console.log('Error message sent to user');
    }
};

handler.command = /^weather$/i;

export default handler;
