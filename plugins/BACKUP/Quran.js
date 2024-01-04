import axios from 'axios';

// Reciters and Surahs data
const reciters = [
    { name: 'عبد الباسط عبد الصمد', id: 'AbdulSamad_64kbps_QuranExplorer.Com' },
    { name: 'ناصر القطامي', id: 'Nasser_Alqatami_128kbps' },
    { name: 'راشد العفاسي', id: 'Alafasy_128kbps' },
    { name: 'ماهر المعيقلي', id: 'MaherAlMuaiqly128kbps' },
    // Add more reciters as needed
  ];

    // Define surahs with their names and corresponding numbers
    const surahs = [
      { name: 'الفاتحة', number: 1 },
      { name: 'البقرة', number: 2 },
      { name: 'آل عمران', number: 3 },
      { name: 'النساء', number: 4 },
      { name: 'المائدة', number: 5 },
      // Add more surahs as needed
    ];
  

  // Define the maximum number of ayahs in each surah (adjust these values accordingly)
  const maxAyahsPerSurah = {
    1: 7, // Al-Fatiha
    2: 286, // Al-Baqara
    3: 200, // Aal-E-Imran
    4: 176, // An-Nisa
    5: 120, // Al-Ma'idah
    // Add max ayahs for other surahs as needed
  };

const userStates = {};
const handler = async (m, { conn }) => {
    const chatId = m.chat;
    const userText = m.text.trim();
    let userState = userStates[chatId] || { step: 'init' };

    console.log(`Received message: ${userText}, Current State: ${userState.step}`);

    if (userState.step === 'init') {
        const reciterList = reciters.map((r, i) => `${i + 1}. ${r.name}`).join('\n');
        await conn.sendMessage(chatId, { text: `Select a reciter:\n${reciterList}` }, { quoted: m });
        userStates[chatId] = { step: 'select_reciter' };
    } else if (userState.step === 'select_reciter') {
        const choiceIndex = parseInt(userText) - 1;
        console.log(`Reciter choice index: ${choiceIndex}`);
        
        if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < reciters.length) {
            const selectedReciter = reciters[choiceIndex];
            await conn.sendMessage(chatId, { text: `You selected: ${selectedReciter.name}` }, { quoted: m });
            userStates[chatId] = { step: 'select_surah', reciter: selectedReciter.id };
            console.log(`Reciter selected: ${selectedReciter.name}`);
        } else {
            await conn.sendMessage(chatId, { text: 'Invalid selection. Please try again.' }, { quoted: m });
            console.log('Invalid reciter selection');
        }
    }
    userStates[chatId] = { ...userState };
};

handler.command = /^(quran|qrn|ayah)$/i;

export default handler;