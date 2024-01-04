import axios from 'axios';

const handler = async (m, { conn }) => {
    const command = m.text.trim().split(' ');
    const baseCommand = command[0].toLowerCase();
    const query = command.slice(1).join(' ');

    if (baseCommand === '$hadith' && query) {
        try {
            const apiKey = global.lolkeysapi[0];
            const url = `https://api.lolhuman.xyz/api/hadits/search?apikey=${apiKey}&query=${encodeURIComponent(query)}`;
            
            const response = await axios.get(url);
            if (response.data.status === 200 && response.data.result) {
                let message = 'Please select a book by sending its number:\n';
                response.data.result.forEach((item, index) => {
                    message += `${index + 1}. ${item.kitab}\n`;
                });

                await conn.sendMessage(m.chat, { text: message }, { quoted: m });
            } else {
                await conn.sendMessage(m.chat, { text: "No results found." }, { quoted: m });
            }
        } catch (error) {
            console.error(error);
            await conn.sendMessage(m.chat, { text: "An error occurred." }, { quoted: m });
        }
    }
};

handler.command = /^hadith$/i;

export default handler;
