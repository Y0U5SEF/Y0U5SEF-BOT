const axios = require('axios');

module.exports = (client) => {
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


  client.registerCommand('start', async (message, args) => {
    // Initialize custom session data if it doesn't exist
    message.session = message.session || {};
    message.session.customData = message.session.customData || {};
  
    const reciterList = reciters.map((reciter, index) => `╡🔅 *_${index + 1}_* - *${reciter.name}*`).join('\n');
  
    // Check if the welcome message has already been sent
    if (!message.session.customData.welcomeMessageSent) {
      const welcomeMessage =`╕══════ *_بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ_* ══════╒\n‏╡════════════════════════\n│ _قم باختيار المقرئ عن طرق ارسال الرقم 👇_ \n‏╡════════════════════════\n` + reciterList + `\n‏╛════════════════════════╘`;
      // Use client.sendMessage to send the welcome message directly
      await client.sendMessage(message.from, welcomeMessage);
      // Set the flag to indicate that the welcome message has been sent
      message.session.customData.welcomeMessageSent = true;
    }
  
    client.once('message', async (userChoice) => {
      const choiceIndex = parseInt(userChoice.body) - 1;
  
      if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= reciters.length) {
        await client.sendMessage(message.from, '*_❗ اختيار خاطئ، الرجاء المحاولة من جديد_*');
        return;
      }
  
      const selectedReciter = reciters[choiceIndex];
      await client.sendMessage(message.from, `*تم اختيار القارئ ${selectedReciter.name}*`);
      // Store the selected reciter ID in custom session data for later use
      message.session.customData.selectedReciterId = selectedReciter.id;
  
      // Send the list of surahs to choose from
      const surahList = surahs.map((surah, index) => `╡🔅 *_${index + 1}_* - *${surah.name}*`).join('\n');
      await client.sendMessage(message.from, `‏╕════════════════════════\n│ _الـرجـاء اخـتيـار ســورة_\n‏╡════════════════════════\n` + surahList + `\n‏╛════════════════════════╘`
      );
  
      client.once('message', async (surahChoice) => {
        const surahIndex = parseInt(surahChoice.body) - 1;
  
        if (isNaN(surahIndex) || surahIndex < 0 || surahIndex >= surahs.length) {
          await client.sendMessage(message.from, '*_❗ اختيار خاطئ، الرجاء المحاولة من جديد_*');
          return;
        }
  
        const selectedSurah = surahs[surahIndex];
        await client.sendMessage(message.from, `*تم تحديد سورة ${selectedSurah.name}*`);
        // Store the selected surah number in custom session data for later use
        message.session.customData.selectedSurahNumber = selectedSurah.number;
  
        // Proceed with asking for the ayah or a range of ayahs
        await askForAyahChoice(message);
      });
    });
  
    // Inside the 'askForAyahChoice' function
    const askForAyahChoice = async (message) => {
      const selectedReciterId = message.session.customData.selectedReciterId;
      const selectedSurahNumber = message.session.customData.selectedSurahNumber;
      const maxAyah = maxAyahsPerSurah[selectedSurahNumber];
      const selectedSurah = surahs.find((surah) => surah.number === selectedSurahNumber);


      await client.sendMessage(
        message.from,
        `_قـم بتحديد رقم الآية المطلوبة، أو مجال محدد من الآيات._\n╕═══════ مــثــال 👇═══════\n│ *_(5)_* سيتم إرسال الآية 5 فقط.\n│ *_(1-5)_* سيتم إرسال التلاوة من الآية 1 إلى الآية 5.\n‏╛════════════════════\n💡 عدد آيات سورة ${selectedSurah.name} هو ${maxAyah}`);
    
      client.once('message', async (ayahChoice) => {
        // Send a "Please wait" message to indicate that the selection is being processed
        await client.sendMessage(message.from, '*_⏳ الـرجاء الانتظار قـليـلا..._*');
    
        const ayahRange = ayahChoice.body.trim();
    
        // Validate the ayah or ayah range format (e.g., "5" or "1-3")
        const ayahRegex = /^(\d+|(\d+)-(\d+))$/;
        if (!ayahRegex.test(ayahRange)) {
          await client.sendMessage(
            message.from,
            `_❗ اختيار خاطئ، الرجاء تحديد رقم الآية، أو مجال محدد من الآيات._\n╕═══════ مــثــال 👇═══════\n│ *_(5)_* سيتم إرسال الآية 5 فقط.\n│ *_(1-5)_* سيتم إرسال التلاوة من الآية 1 إلى الآية 5.\n‏╛════════════════════`
            );
          return;
        }
    
        // Parse the ayah or ayah range
        let [startAyah, endAyah] = ayahRange.split('-').map(Number);
    
        // If there's no range specified, set startAyah and endAyah to the same value (single ayah)
        if (isNaN(endAyah)) {
          endAyah = startAyah;
        }
    
        if (startAyah < 1 || endAyah > maxAyah || startAyah > endAyah) {
          await client.sendMessage(message.from, 'Invalid ayah or ayah range. Please choose a valid range.');
          return;
        }
    
        // Store the selected ayah or ayah range in custom session data for later use
        message.session.customData.selectedStartAyah = startAyah;
        message.session.customData.selectedEndAyah = endAyah;
    
        // Proceed with constructing the URL and downloading audio
        await constructAndSendAudio(
          message,
          selectedReciterId,
          selectedSurahNumber,
          startAyah,
          endAyah,
          selectedSurah.name
        );
      });
    };
  
    // ... (previous code)
  });
  
  const axios = require('axios');
  const fs = require('fs'); // Import the standard fs module
  const path = require('path');
  const { exec } = require('child_process'); // Import the exec function
  const { MessageMedia } = require('whatsapp-web.js');
  const fsPromises = require('fs').promises; // Import fs.promises at the top
// Function to construct and send audio
const constructAndSendAudio = async (message, reciterId, surahNumber, startAyah, endAyah) => {
  const audioURLs = [];
  const formattedSurahNumber = String(surahNumber).padStart(3, '0');
  for (let ayah = startAyah; ayah <= endAyah; ayah++) {
    const formattedAyah = String(ayah).padStart(3, '0');
    const audioURL = `https://everyayah.com/data/${reciterId}/${formattedSurahNumber}${formattedAyah}.mp3`;
    audioURLs.push(audioURL);
    console.log(`Constructed URL: ${audioURL}`);
  }

  // Create a temporary directory to store downloaded files
  const tempDir = path.join(__dirname, 'temp');
  try {
    fs.mkdir(tempDir, { recursive: true }, (err) => {
      if (err) {
        console.error('Failed to create temporary directory:', err);
        // Handle the error
      } else {
        // Directory creation was successful
        // Proceed with other operations that depend on this directory
      }
    });
  } catch (error) {
    console.error('Failed to create temporary directory:', error);
    // Handle the error
  }
  
  
  
  
  const downloadPromises = audioURLs.map(async (audioURL, index) => {
    try {
      const response = await axios.get(audioURL, { responseType: 'stream' });
      const filePath = path.join(tempDir, `audio_${index}.mp3`);
      const writer = fs.createWriteStream(filePath);
  
      return new Promise((resolve, reject) => {
        response.data.pipe(writer);
  
        writer.on('finish', async () => {
          console.log(`Downloaded: ${filePath}`);
          resolve();
        });
  
        writer.on('error', async (error) => {
          console.error('Failed to write audio file:', error);
          reject(error);
        });
      });
    } catch (error) {
      console.error('Failed to download audio file:', error.message);
      throw error;
    }
  });

  try {
    // Wait for all downloads to complete
    await Promise.all(downloadPromises);

    // Merge the downloaded audio files with ffmpeg
    const outputFilePath = path.join(tempDir, 'output.mp3');
    const inputFilePaths = audioURLs.map((_, index) => path.join(tempDir, `audio_${index}.mp3`));
    const ffmpegCommand = `ffmpeg -i "concat:${inputFilePaths.join('|')}" -c copy ${outputFilePath}`;

    exec(ffmpegCommand, async (error, stdout, stderr) => {
      if (error) {
        console.error('Failed to merge audio files:', error);
        await message.reply('Failed to merge audio files. Please try again later.');
      } else {
        try {
          // Send the merged audio file to the user
          const media = MessageMedia.fromFilePath(outputFilePath);
          await message.reply(media);
        
          // Delete the temporary audio files
          await Promise.all(inputFilePaths.map(filePath => fsPromises.unlink(filePath)));
        
          // Delete the output file
          await fsPromises.unlink(outputFilePath);
        
          // Remove the temporary directory

        } catch (error) {
          console.error('Failed to send or delete files:', error.message);
          await message.reply('Failed to send audio or clean up temporary files. Please try again later.');
        }
      }
    });

  } catch (error) {
    console.error('Failed to download or merge audio files:', error.message);
    await message.reply('Failed to download or merge audio files. Please try again later.');
  }
};
};




const handler = async (m, { conn }) => {
    const chatId = m.chat;
    const textCommand = m.text.trim().split(' ')[0].toLowerCase();

    if (['quran', 'qrn', 'ayah'].includes(textCommand)) {
        // Initial command logic here
        // ...
    } else {
        // Assuming user's next message is the choice
        const userChoice = m.text.trim();
        const choiceIndex = parseInt(userChoice) - 1;

        if (isNaN(choiceIndex) || choiceIndex < 0 || choiceIndex >= reciters.length) {
            await conn.sendMessage(chatId, { text: '*_❗ اختيار خاطئ، الرجاء المحاولة من جديد_*' }, { quoted: m });
            return;
        }

        const selectedReciter = reciters[choiceIndex];
        await conn.sendMessage(chatId, { text: `*تم اختيار القارئ ${selectedReciter.name}*` }, { quoted: m });
        
        // Handle surah selection here
        // ...
    }
};

handler.command = /^(quran|qrn|ayah)$/i;

export default handler;
