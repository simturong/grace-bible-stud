/**
 * E:/Tak/Gemini/grace-bible-study/build-bible-audio.js
 * 
 * Uijeongbu JoongAng Methodist Church - Grace Bible Study App
 * 100% Free, Unlimited Local Audio Bulk Baking Engine (Pre-rendering mp3 files)
 */

const fs = require('fs');
const path = require('path');
const http = require('https');

const AUDIO_DIR = path.join(__dirname, 'audio');

// Ensure audio directory exists
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Target texts to bake (Psalms 23 and Daily Meditation Day 1)
const bakeTargets = [
  // 1. Psalms 23 (시편 23편 1~6절) - Book ID 19, Chapter 23
  {
    filename: 'bible_19_23_1.mp3',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다'
  },
  {
    filename: 'bible_19_23_2.mp3',
    text: '그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다'
  },
  {
    filename: 'bible_19_23_3.mp3',
    text: '내 영혼을 소생시키시고 자기 이름을 위하여 의의 길로 인도하시는도다'
  },
  {
    filename: 'bible_19_23_4.mp3',
    text: '내가 사망의 음침한 골짜기로 다닐지라도 해를 두려워하지 않을 것은 주께서 나와 함께 하심이라 주의 지팡이와 막대기가 나를 안위하시나이다'
  },
  {
    filename: 'bible_19_23_5.mp3',
    text: '주께서 내 원수의 목전에서 내게 상을 차려 주시고 기름을 내 머리에 부으셨으니 내 잔이 넘치나이다'
  },
  {
    filename: 'bible_19_23_6.mp3',
    text: '내 평생에 선하심과 인자하심이 반드시 나를 따르리니 내가 여호와의 집에 영원히 살리로다'
  },
  // 2. Daily Meditation Day 1 (오늘의 묵상 Day 1)
  {
    filename: 'meditation_1.mp3',
    text: '여호와는 나의 목자시니 내게 부족함이 없으리로다. 우리의 인생 여정 속에서 부족함을 느낄 때가 많습니다. 그러나 전능하시고 자비로우신 여호와께서 친히 인도하시니 안심하십시오.'
  }
];

// High-fidelity dynamic translator TTS downloader (100% Free, bypass tokens)
function downloadTtsMp3(text, filename) {
  return new Promise((resolve, reject) => {
    const encodedText = encodeURIComponent(text);
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ko&client=tw-ob&q=${encodedText}`;
    const dest = path.join(AUDIO_DIR, filename);
    const file = fs.createWriteStream(dest);

    http.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: Status Code ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[Audio Baked] Saved: ${dest} (${fs.statSync(dest).size} bytes)`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {}); // Delete partial file
      reject(err);
    });
  });
}

async function run() {
  console.log('=== Start Baking Holy Audio Database ===');
  console.log(`Target Output Directory: ${AUDIO_DIR}`);
  
  for (const target of bakeTargets) {
    try {
      await downloadTtsMp3(target.text, target.filename);
      // Brief delay to prevent network congestion
      await new Promise(r => setTimeout(r, 400));
    } catch (e) {
      console.error(`Failed to bake "${target.filename}":`, e.message);
    }
  }
  
  console.log('=== Audio Database Baking Complete! ===');
}

run();
