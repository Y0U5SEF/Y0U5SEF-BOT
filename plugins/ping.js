const handler = async (m, { conn }) => {
    console.log("Hadith command handler called with message:", m.text);

    const startTime = Date.now(); // Capture start time

    // Perform a simple operation (e.g., a fetch request or a simple loop)
    // ...

    const endTime = Date.now(); // Capture end time
    const pingSpeed = endTime - startTime; // Calculate ping speed

    const response = `Ping speed: ${pingSpeed} ms`;
    await conn.sendMessage(m.chat, { text: response }, { quoted: m });
};

handler.command = /^ping$/i; // Command to trigger this functionality

export default handler;
