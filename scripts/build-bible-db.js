/**
 * build-bible-db.js
 * 
 * 대한성서공회 (bskorea.or.kr) 개역개정(GAE) 전체 66권 스크래퍼
 * → bible_db.json 생성
 * 
 * 실행: node build-bible-db.js
 * 중단 후 재실행 시 체크포인트에서 자동 재개됩니다.
 * 
 * ⚠️  서버 부하 방지: 요청 간 1.5초 딜레이 적용
 *     전체 완료: 약 2-3시간 (1,189장 기준)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── 66권 메타데이터 ────────────────────────────────────────────────────────
const BIBLE_BOOKS = [
  { id: 1,  name: '창세기',       eng: 'Genesis',          abbr: '창',   testament: 'OT', code: 'gen', totalChapters: 50 },
  { id: 2,  name: '출애굽기',     eng: 'Exodus',           abbr: '출',   testament: 'OT', code: 'exo', totalChapters: 40 },
  { id: 3,  name: '레위기',       eng: 'Leviticus',        abbr: '레',   testament: 'OT', code: 'lev', totalChapters: 27 },
  { id: 4,  name: '민수기',       eng: 'Numbers',          abbr: '민',   testament: 'OT', code: 'num', totalChapters: 36 },
  { id: 5,  name: '신명기',       eng: 'Deuteronomy',      abbr: '신',   testament: 'OT', code: 'deu', totalChapters: 34 },
  { id: 6,  name: '여호수아',     eng: 'Joshua',           abbr: '수',   testament: 'OT', code: 'jos', totalChapters: 24 },
  { id: 7,  name: '사사기',       eng: 'Judges',           abbr: '삿',   testament: 'OT', code: 'jdg', totalChapters: 21 },
  { id: 8,  name: '룻기',         eng: 'Ruth',             abbr: '룻',   testament: 'OT', code: 'rut', totalChapters: 4  },
  { id: 9,  name: '사무엘상',     eng: '1 Samuel',         abbr: '삼상', testament: 'OT', code: '1sa', totalChapters: 31 },
  { id: 10, name: '사무엘하',     eng: '2 Samuel',         abbr: '삼하', testament: 'OT', code: '2sa', totalChapters: 24 },
  { id: 11, name: '열왕기상',     eng: '1 Kings',          abbr: '왕상', testament: 'OT', code: '1ki', totalChapters: 22 },
  { id: 12, name: '열왕기하',     eng: '2 Kings',          abbr: '왕하', testament: 'OT', code: '2ki', totalChapters: 25 },
  { id: 13, name: '역대상',       eng: '1 Chronicles',     abbr: '대상', testament: 'OT', code: '1ch', totalChapters: 29 },
  { id: 14, name: '역대하',       eng: '2 Chronicles',     abbr: '대하', testament: 'OT', code: '2ch', totalChapters: 36 },
  { id: 15, name: '에스라',       eng: 'Ezra',             abbr: '스',   testament: 'OT', code: 'ezr', totalChapters: 10 },
  { id: 16, name: '느헤미야',     eng: 'Nehemiah',         abbr: '느',   testament: 'OT', code: 'neh', totalChapters: 13 },
  { id: 17, name: '에스더',       eng: 'Esther',           abbr: '에',   testament: 'OT', code: 'est', totalChapters: 10 },
  { id: 18, name: '욥기',         eng: 'Job',              abbr: '욥',   testament: 'OT', code: 'job', totalChapters: 42 },
  { id: 19, name: '시편',         eng: 'Psalms',           abbr: '시',   testament: 'OT', code: 'psa', totalChapters: 150 },
  { id: 20, name: '잠언',         eng: 'Proverbs',         abbr: '잠',   testament: 'OT', code: 'pro', totalChapters: 31 },
  { id: 21, name: '전도서',       eng: 'Ecclesiastes',     abbr: '전',   testament: 'OT', code: 'ecc', totalChapters: 12 },
  { id: 22, name: '아가',         eng: 'Song of Solomon',  abbr: '아',   testament: 'OT', code: 'sng', totalChapters: 8  },
  { id: 23, name: '이사야',       eng: 'Isaiah',           abbr: '사',   testament: 'OT', code: 'isa', totalChapters: 66 },
  { id: 24, name: '예레미야',     eng: 'Jeremiah',         abbr: '렘',   testament: 'OT', code: 'jer', totalChapters: 52 },
  { id: 25, name: '예레미야애가', eng: 'Lamentations',     abbr: '애',   testament: 'OT', code: 'lam', totalChapters: 5  },
  { id: 26, name: '에스겔',       eng: 'Ezekiel',          abbr: '겔',   testament: 'OT', code: 'ezk', totalChapters: 48 },
  { id: 27, name: '다니엘',       eng: 'Daniel',           abbr: '단',   testament: 'OT', code: 'dan', totalChapters: 12 },
  { id: 28, name: '호세아',       eng: 'Hosea',            abbr: '호',   testament: 'OT', code: 'hos', totalChapters: 14 },
  { id: 29, name: '요엘',         eng: 'Joel',             abbr: '욜',   testament: 'OT', code: 'jol', totalChapters: 3  },
  { id: 30, name: '아모스',       eng: 'Amos',             abbr: '암',   testament: 'OT', code: 'amo', totalChapters: 9  },
  { id: 31, name: '오바댜',       eng: 'Obadiah',          abbr: '옵',   testament: 'OT', code: 'oba', totalChapters: 1  },
  { id: 32, name: '요나',         eng: 'Jonah',            abbr: '욘',   testament: 'OT', code: 'jon', totalChapters: 4  },
  { id: 33, name: '미가',         eng: 'Micah',            abbr: '미',   testament: 'OT', code: 'mic', totalChapters: 7  },
  { id: 34, name: '나훔',         eng: 'Nahum',            abbr: '나',   testament: 'OT', code: 'nam', totalChapters: 3  },
  { id: 35, name: '하박국',       eng: 'Habakkuk',         abbr: '합',   testament: 'OT', code: 'hab', totalChapters: 3  },
  { id: 36, name: '스바냐',       eng: 'Zephaniah',        abbr: '습',   testament: 'OT', code: 'zep', totalChapters: 3  },
  { id: 37, name: '학개',         eng: 'Haggai',           abbr: '학',   testament: 'OT', code: 'hag', totalChapters: 2  },
  { id: 38, name: '스가랴',       eng: 'Zechariah',        abbr: '슥',   testament: 'OT', code: 'zec', totalChapters: 14 },
  { id: 39, name: '말라기',       eng: 'Malachi',          abbr: '말',   testament: 'OT', code: 'mal', totalChapters: 4  },
  { id: 40, name: '마태복음',     eng: 'Matthew',          abbr: '마',   testament: 'NT', code: 'mat', totalChapters: 28 },
  { id: 41, name: '마가복음',     eng: 'Mark',             abbr: '막',   testament: 'NT', code: 'mrk', totalChapters: 16 },
  { id: 42, name: '누가복음',     eng: 'Luke',             abbr: '눅',   testament: 'NT', code: 'luk', totalChapters: 24 },
  { id: 43, name: '요한복음',     eng: 'John',             abbr: '요',   testament: 'NT', code: 'jhn', totalChapters: 21 },
  { id: 44, name: '사도행전',     eng: 'Acts',             abbr: '행',   testament: 'NT', code: 'act', totalChapters: 28 },
  { id: 45, name: '로마서',       eng: 'Romans',           abbr: '롬',   testament: 'NT', code: 'rom', totalChapters: 16 },
  { id: 46, name: '고린도전서',   eng: '1 Corinthians',    abbr: '고전', testament: 'NT', code: '1co', totalChapters: 16 },
  { id: 47, name: '고린도후서',   eng: '2 Corinthians',    abbr: '고후', testament: 'NT', code: '2co', totalChapters: 13 },
  { id: 48, name: '갈라디아서',   eng: 'Galatians',        abbr: '갈',   testament: 'NT', code: 'gal', totalChapters: 6  },
  { id: 49, name: '에베소서',     eng: 'Ephesians',        abbr: '엡',   testament: 'NT', code: 'eph', totalChapters: 6  },
  { id: 50, name: '빌립보서',     eng: 'Philippians',      abbr: '빌',   testament: 'NT', code: 'php', totalChapters: 4  },
  { id: 51, name: '골로새서',     eng: 'Colossians',       abbr: '골',   testament: 'NT', code: 'col', totalChapters: 4  },
  { id: 52, name: '데살로니가전서', eng: '1 Thessalonians', abbr: '살전', testament: 'NT', code: '1th', totalChapters: 5  },
  { id: 53, name: '데살로니가후서', eng: '2 Thessalonians', abbr: '살후', testament: 'NT', code: '2th', totalChapters: 3  },
  { id: 54, name: '디모데전서',   eng: '1 Timothy',        abbr: '딤전', testament: 'NT', code: '1ti', totalChapters: 6  },
  { id: 55, name: '디모데후서',   eng: '2 Timothy',        abbr: '딤후', testament: 'NT', code: '2ti', totalChapters: 4  },
  { id: 56, name: '디도서',       eng: 'Titus',            abbr: '딛',   testament: 'NT', code: 'tit', totalChapters: 3  },
  { id: 57, name: '빌레몬서',     eng: 'Philemon',         abbr: '몬',   testament: 'NT', code: 'phm', totalChapters: 1  },
  { id: 58, name: '히브리서',     eng: 'Hebrews',          abbr: '히',   testament: 'NT', code: 'heb', totalChapters: 13 },
  { id: 59, name: '야고보서',     eng: 'James',            abbr: '약',   testament: 'NT', code: 'jas', totalChapters: 5  },
  { id: 60, name: '베드로전서',   eng: '1 Peter',          abbr: '벧전', testament: 'NT', code: '1pe', totalChapters: 5  },
  { id: 61, name: '베드로후서',   eng: '2 Peter',          abbr: '벧후', testament: 'NT', code: '2pe', totalChapters: 3  },
  { id: 62, name: '요한일서',     eng: '1 John',           abbr: '요일', testament: 'NT', code: '1jn', totalChapters: 5  },
  { id: 63, name: '요한이서',     eng: '2 John',           abbr: '요이', testament: 'NT', code: '2jn', totalChapters: 1  },
  { id: 64, name: '요한삼서',     eng: '3 John',           abbr: '요삼', testament: 'NT', code: '3jn', totalChapters: 1  },
  { id: 65, name: '유다서',       eng: 'Jude',             abbr: '유',   testament: 'NT', code: 'jud', totalChapters: 1  },
  { id: 66, name: '요한계시록',   eng: 'Revelation',       abbr: '계',   testament: 'NT', code: 'rev', totalChapters: 22 },
];

const BASE_URL = 'https://www.bskorea.or.kr/bible/korbibReadpage.php';
const REQUEST_DELAY_MS = 1500;
const OUTPUT_PATH = path.join(__dirname, 'bible_db.json');
const CHECKPOINT_DIR = path.join(__dirname, 'raw', 'checkpoint');

// ── HTTP fetch ─────────────────────────────────────────────────────────────
function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9'
      },
      timeout: 30000
    }, (res) => {
      // 리다이렉트 처리
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        resolve(fetchUrl(res.headers.location));
        return;
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject).on('timeout', () => reject(new Error('Request timeout')));
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// ── HTML 파서 ──────────────────────────────────────────────────────────────
/**
 * bskorea.or.kr HTML 구조:
 * <span [style=...]><span class="number">N&nbsp;&nbsp;&nbsp;</span>절텍스트 </font></span>
 */
function parseVerses(html) {
  const verses = [];
  const seen = new Set();

  // <span class="number">N</span>다음에 오는 텍스트를 </span> 직전까지 추출
  const pattern = /<span\s+class=["']number["'][^>]*>(\d+)(?:&nbsp;|\s)*<\/span>([\s\S]*?)(?=<\/span>)/gi;
  
  let m;
  while ((m = pattern.exec(html)) !== null) {
    const num = parseInt(m[1]);
    let rawText = m[2];
    
    // div 팝업 블록 제거 (각주 설명)
    rawText = rawText.replace(/<div[^>]*>[\s\S]*?<\/div>/gi, '');
    // 모든 HTML 태그 제거
    rawText = rawText.replace(/<[^>]+>/g, '');
    // HTML 엔티티 디코드
    rawText = rawText
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#\d+;/g, '');
    // 각주 번호 제거 (1), 2) 등)
    rawText = rawText.replace(/\d+\)/g, '');
    // 줄바꿈 → 공백
    rawText = rawText.replace(/[\n\r]/g, ' ');
    // 연속 공백 단일화
    rawText = rawText.replace(/\s+/g, ' ').trim();

    if (num >= 1 && num <= 300 && rawText.length > 1 && !seen.has(num)) {
      seen.add(num);
      verses.push({ num, rev: rawText });
    }
  }

  verses.sort((a, b) => a.num - b.num);
  return verses;
}

// ── 챕터 fetch (재시도 포함) ───────────────────────────────────────────────
async function fetchChapter(bookCode, chapterNum, retries = 3) {
  const url = `${BASE_URL}?version=GAE&book=${bookCode}&chap=${chapterNum}`;
  
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      if (attempt > 0) {
        process.stdout.write(` [재시도 ${attempt}]`);
        await sleep(3000 * attempt);
      }
      const html = await fetchUrl(url);
      const verses = parseVerses(html);
      return verses;
    } catch (err) {
      if (attempt === retries - 1) {
        process.stdout.write(` [실패: ${err.message}]`);
        return [];
      }
    }
  }
  return [];
}

// ── 체크포인트 ─────────────────────────────────────────────────────────────
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadCheckpoint() {
  ensureDir(CHECKPOINT_DIR);
  const f = path.join(CHECKPOINT_DIR, 'progress.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : { completedBooks: [] };
}

function saveCheckpoint(cp) {
  fs.writeFileSync(path.join(CHECKPOINT_DIR, 'progress.json'), JSON.stringify(cp, null, 2));
}

function bookCpFile(id) {
  return path.join(CHECKPOINT_DIR, `book_${String(id).padStart(2, '0')}.json`);
}

function saveBookCp(bookData) {
  fs.writeFileSync(bookCpFile(bookData.id), JSON.stringify(bookData, null, 2));
}

function loadBookCp(id) {
  const f = bookCpFile(id);
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
}

// ── 메인 ──────────────────────────────────────────────────────────────────
async function buildBibleDatabase() {
  console.log('='.repeat(62));
  console.log('📖  개역개정 성경 DB 빌더  |  출처: 대한성서공회');
  console.log('='.repeat(62));

  const cp = loadCheckpoint();
  const result = [];

  const totalChapters = BIBLE_BOOKS.reduce((s, b) => s + b.totalChapters, 0);
  let doneChapters = 0;

  for (const meta of BIBLE_BOOKS) {
    // 이미 완료된 책은 캐시에서 로드
    if (cp.completedBooks.includes(meta.id)) {
      const saved = loadBookCp(meta.id);
      if (saved) {
        result.push(saved);
        doneChapters += meta.totalChapters;
        console.log(`✅  [${meta.id}/66] ${meta.name} — 캐시 로드`);
        continue;
      }
    }

    console.log(`\n📚  [${meta.id}/66] ${meta.name}  (${meta.totalChapters}장)`);

    const bookData = {
      id: meta.id,
      name: meta.name,
      eng: meta.eng,
      abbr: meta.abbr,
      testament: meta.testament,
      totalChapters: meta.totalChapters,
      chapters: {}
    };

    for (let chap = 1; chap <= meta.totalChapters; chap++) {
      process.stdout.write(`  ${chap}/${meta.totalChapters}장 ... `);
      
      const verses = await fetchChapter(meta.code, chap);
      bookData.chapters[String(chap)] = verses;
      
      doneChapters++;
      const pct = ((doneChapters / totalChapters) * 100).toFixed(1);
      process.stdout.write(`${verses.length}절  [전체 ${pct}%]\n`);
      
      await sleep(REQUEST_DELAY_MS);
    }

    result.push(bookData);
    saveBookCp(bookData);
    cp.completedBooks.push(meta.id);
    saveCheckpoint(cp);
    
    // 중간 저장
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8');
    console.log(`  💾  bible_db.json 중간 저장 완료`);
  }

  // 최종 저장
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2), 'utf8');

  // 검증 요약
  let totalVerses = 0;
  const emptyChapters = [];
  for (const book of result) {
    for (const [chapNum, verses] of Object.entries(book.chapters)) {
      totalVerses += verses.length;
      if (verses.length === 0) emptyChapters.push(`${book.name} ${chapNum}장`);
    }
  }

  console.log('\n' + '='.repeat(62));
  console.log('🎉  완료!  bible_db.json 생성 성공');
  console.log(`   수록: ${result.length}권  /  ${doneChapters}장  /  ${totalVerses}절`);
  if (emptyChapters.length > 0) {
    console.log(`   ⚠️   빈 장 ${emptyChapters.length}개:`);
    emptyChapters.forEach(c => console.log(`      - ${c}`));
  } else {
    console.log('   ✅  모든 장에 절 데이터 확인');
  }
  console.log('='.repeat(62));
}

buildBibleDatabase().catch(err => {
  console.error('\n❌  빌드 실패:', err.message);
  process.exit(1);
});
