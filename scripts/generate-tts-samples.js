/**
 * E:/Tak/Gemini/grace-bible-study/generate-tts-samples.js
 * 
 * Node.js script to test GCP Text-to-Speech API (Neural2) using the provided API Key
 * and generate evaluation audio samples for Uijeongbu JoongAng Methodist Church.
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.GCP_TTS_API_KEY || "REDACTED";
const OUTPUT_DIR = path.join(__dirname, 'images', 'tts-samples');

// Ensure directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const sampleTexts = [
  {
    filename: 'female_psalm23_1.mp3',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다.',
    voice: 'ko-KR-Neural2-A' // 자상한 자매님 목소리
  },
  {
    filename: 'male_psalm23_1.mp3',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다.',
    voice: 'ko-KR-Neural2-B' // 인자한 형제님 목소리
  },
  {
    filename: 'female_benediction.mp3',
    text: '여호와께서 그 얼굴을 네게로 향하여 드사 평강 주시기를 원하노라 할지니라 하라.',
    voice: 'ko-KR-Neural2-A'
  }
];

async function generateSample(sample) {
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  
  const requestBody = {
    input: { text: sample.text },
    voice: {
      languageCode: 'ko-KR',
      name: sample.voice
    },
    audioConfig: {
      audioEncoding: 'MP3',
      speakingRate: 0.85, // 어르신을 위한 0.85배속 최적 비율
      pitch: 0.0
    }
  };

  console.log(`[TTS Generating] Creating sample for voice "${sample.voice}" -> ${sample.filename}`);
  
  try {
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.data && response.data.audioContent) {
      const buffer = Buffer.from(response.data.audioContent, 'base64');
      const outputPath = path.join(OUTPUT_DIR, sample.filename);
      fs.writeFileSync(outputPath, buffer);
      console.log(`[TTS Success] Saved: ${outputPath} (${buffer.length} bytes)`);
    } else {
      console.error(`[TTS Error] No audio content returned for ${sample.filename}`);
    }
  } catch (error) {
    console.error(`[TTS API Error] Failed to generate ${sample.filename}:`, error.response ? error.response.data : error.message);
  }
}

async function run() {
  console.log('=== GCP Text-to-Speech Neural2 Evaluation Generator ===');
  console.log('API KEY:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'Not Found');
  
  for (const sample of sampleTexts) {
    await generateSample(sample);
  }
  
  console.log('=== Generation Complete! ===');
}

run();
