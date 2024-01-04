import axios from 'axios';
import cheerio from 'cheerio';

const handler = async (m, { conn }) => {
    const url = 'https://www.muslimpro.com/ar/Prayer-times-Agdz-Morocco-2561539';
    
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const todayPrayers = $('tr.active').find('td').map((i, el) => $(el).text().trim()).get();

        // Assign each element to a variable
        const date = todayPrayers[0];
        const fajr = todayPrayers[1];
        const sunrise = todayPrayers[2];
        const dhuhr = todayPrayers[3];
        const asr = todayPrayers[4];
        const maghrib = todayPrayers[5];
        const isha = todayPrayers[6];

        // Personalize the message as needed
        const prayerTimesMessage = `*مواقيت الصلاة بأكدز ليوم ${date}*\n
🕋 الفجر: ${fajr}
🕋 الشروق: ${sunrise}
🕋 الظهر: ${dhuhr}
🕋 العصر: ${asr}
🕋 المغرب: ${maghrib}
🕋 العشاء: ${isha}`;

        await conn.sendMessage(m.chat, { text: prayerTimesMessage }, { quoted: m });
    } catch (error) {
        console.error(error);
        await conn.sendMessage(m.chat, { text: 'Error fetching prayer times.' }, { quoted: m });
    }
};

handler.command = /^salat$/i;

export default handler;
