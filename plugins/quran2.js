// Assume 'conn' is your Baileys connection and 'm' is the incoming message
const options = ['Option 1', 'Option 2', 'Option 3']; // Example options
let userStates = {};

const handler = async (m, conn) => {
    const chatId = m.key.remoteJid;
    const text = m.message.conversation || m.message.extendedTextMessage?.text;
    const userState = userStates[chatId];

    let message = 'Please select an option:\n';
    options.forEach((option, index) => {
        message += `${index + 1}. ${option}\n`;
    });

    if (userState !== 'awaiting_selection') {
        await conn.sendMessage(chatId, { text: message });
        userStates[chatId] = 'awaiting_selection';
    } else {
        const selectedIndex = parseInt(text) - 1;
        if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < options.length) {
            const selectedOption = options[selectedIndex];
            await conn.sendMessage(chatId, { text: `You selected: ${selectedOption}` });
            delete userStates[chatId];
        } else {
            await conn.sendMessage(chatId, { text: 'Invalid selection. Please try again.' });
        }
    }
};

// Use the handler in your Baileys connection event listener

handler.command = /^tests$/i;

export default handler;
