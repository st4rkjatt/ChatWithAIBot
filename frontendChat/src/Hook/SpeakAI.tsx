// // tts.js or tts.ts if you're using TypeScript
// import fs from 'fs';
// import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

// // Replace with your actual API key from https://elevenlabs.io
// const elevenlabs = new ElevenLabsClient({
//   apiKey: 'sk_e09a6541e32173cd72ca8e08fc7e887b0771dda2a21b987e', // 🔐 Replace this
// });

// // Function to convert text to speech
// async function generateSpeech() {
//   try {
//     // Choose a voice ID from ElevenLabs (you can find in the dashboard or listVoices API)
//     const voiceId = 'EXAVITQu4vr4xnSDxMaL'; // Default: Rachel

//     const response = await elevenlabs.generate({
//       voiceId,
//       text: 'Hello Ajeet! This is a test message using ElevenLabs Text to Speech.',
//       modelId: 'eleven_monolingual_v1', // or 'eleven_multilingual_v1'
//       voiceSettings: {
//         stability: 0.75,
//         similarityBoost: 0.75
//       }
//     });

//     // Write the response audio buffer to an MP3 file
//     fs.writeFileSync('output.mp3', Buffer.from(await response.arrayBuffer()));
//     console.log('✅ Speech generated and saved as output.mp3');
//   } catch (error) {
//     console.error('❌ Error generating speech:', error);
//   }
// }

// generateSpeech();


