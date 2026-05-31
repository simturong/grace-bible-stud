/**
 * ?섏젙遺以묒븰援먰쉶 二쇰낫 ?먮룞???섏쭛 & 履쇨컻湲?& 留ㅼ쭅 ?ъ젙??諛고룷 ?붿쭊 (scrape-and-split.js)
 * 
 * [?숈옉 ?먮쫫]
 * 1. Playwright濡??섏젙遺以묒븰援먰쉶 二쇰낫 寃뚯떆???묒냽 (pageCode=50)
 * 2. 理쒖떊湲 2媛쒕? 異붿텧 (泥?踰덉㎏ = ?대쾲 二?二쇰낫, ??踰덉㎏ = 吏?쒖＜ 二쇰낫)
 * 3. [1李⑥쟾: ?대쾲 二?二쇰낫] ?곸꽭湲濡??대룞?섏뿬 ?ㅽ듃?뚰겕 ?ㅻ땲?묒쑝濡??대?吏 4???띾뱷 ??履쇨컻??processed_1.jpg~8.jpg ??? * 4. [2李⑥쟾: 吏?쒖＜ 二쇰낫] ?곸꽭湲濡??대룞?섏뿬 ?ㅽ듃?뚰겕 ?ㅻ땲?묒쑝濡??대?吏 4???띾뱷 ??履쇨컻??prev_processed_1.jpg~8.jpg ??? */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const axios = require('axios');
const sharp = require('sharp');

// ?ㅼ젙媛?const BOARD_URL = 'https://www.god4u.or.kr/main/sub.html?pageCode=50';
const BASE_URL = 'https://www.god4u.or.kr';
const OUTPUT_DIR = path.join(__dirname, '..', 'images', 'jubbo');

// 二쇰낫 4??履쇨컻湲?諛??ъ젙??怨듯넻 ?붿쭊
async function processJubbo(targetUrls, prefixLabel, prefixFile, detailUrl) {
  // sharp瑜??댁슜??怨좏빐?곷룄 ?대?吏 諛??먮Ⅴ湲?(?대텇??Crop)
  console.log(`?귨툘  [?대?吏 ?щ씪?댁뒪] Sharp ?붿쭊?쇰줈 ${prefixLabel} 4??醫???50% 遺꾪븷 媛쒖떆.`);
  const imageBuffers = [];
  
  // ?ㅼ슫濡쒕뱶
  for (let i = 0; i < 4; i++) {
    const url = targetUrls[i];
    console.log(`  燧뉛툘  (${i + 1}/4) ?ㅼ슫濡쒕뱶 以? ${url}`);
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
        headers: {
          'Referer': detailUrl,
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      imageBuffers.push(Buffer.from(response.data));
    } catch (err) {
      console.warn(`  ??(${i + 1}/4) ?ㅼ슫濡쒕뱶 ?ㅽ뙣: ${err.message}. 怨듬갚 ?쒓굅 ?뚯씪紐낆쑝濡??ъ떆?꾪빀?덈떎.`);
      const fallbackUrl = url.replace('%20', '').replace(' ', '');
      try {
        const response = await axios({
          url: fallbackUrl,
          method: 'GET',
          responseType: 'arraybuffer',
          headers: {
            'Referer': detailUrl,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        imageBuffers.push(Buffer.from(response.data));
      } catch (fallbackErr) {
        throw new Error(`${prefixLabel} 二쇰낫 ?대?吏 ${i + 1}踰덉㎏ 理쒖쥌 ?ㅼ슫濡쒕뱶 ?ㅽ뙣.`);
      }
    }
  }

  const pages = []; 
  for (let i = 0; i < 4; i++) {
    const buffer = imageBuffers[i];
    const metadata = await sharp(buffer).metadata();
    const halfWidth = Math.floor(metadata.width / 2);
    const height = metadata.height;

    // A. 醫뚯륫硫??щ씪?댁뒪 (???硫?
    const leftBuffer = await sharp(buffer)
      .extract({ left: 0, top: 0, width: halfWidth, height })
      .jpeg({ quality: 95 })
      .toBuffer();
    pages.push(leftBuffer);

    // B. ?곗륫硫??щ씪?댁뒪 (吏앹닔 硫?
    const rightBuffer = await sharp(buffer)
      .extract({ left: halfWidth, top: 0, width: halfWidth, height })
      .jpeg({ quality: 95 })
      .toBuffer();
    pages.push(rightBuffer);
  }

  // 留ㅼ쭅 ?뺣젹 (2硫?-> 4硫?-> 6硫?-> 7硫?-> 8硫?-> 5硫?-> 3硫?-> 1硫?
  const magicSortIndices = [1, 3, 5, 6, 7, 4, 2, 0];
  const sortedPageLabels = ["2硫?, "4硫?, "6硫?, "7硫?, "8硫?, "5硫?, "3硫?, "1硫?];

  console.log(`?몣 [留ㅼ쭅 ?뺣젹 諛???? ${prefixLabel} 2-4-6-7-8-5-3-1 ?뺣젹 ???以?..`);
  for (let i = 0; i < magicSortIndices.length; i++) {
    const targetIdx = magicSortIndices[i];
    const label = sortedPageLabels[i];
    const pageBuffer = pages[targetIdx];
    const outputFilename = `${prefixFile}_${i + 1}.jpg`;
    const outputPath = path.join(OUTPUT_DIR, outputFilename);

    await fs.promises.writeFile(outputPath, pageBuffer);
    console.log(`   ?뷂툘  [????꾨즺] ${label} ??images/jubbo/${outputFilename}`);
  }
}

async function run() {
  console.log('?? [二쇰낫 ?먮룞?? 理쒖떊 二쇰낫(?대쾲 二? 諛?吏?쒖＜ 二쇰낫 ?듯빀 ?먮룞 ?섏쭛 ?붿쭊??媛?숉빀?덈떎.');

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let browser;
  try {
    console.log('?뙋 [釉뚮씪?곗? 媛?? Playwright Headless Chrome ?쒕룞...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();

    // ?ㅽ듃?뚰겕 ?ㅻ땲??媛??    const interceptedUrls = [];
    page.on('response', response => {
      const url = response.url();
      if (url.includes('user/saveDir/board/www50/') && 
         (url.toLowerCase().endsWith('.jpg') || url.toLowerCase().endsWith('.jpeg') || url.toLowerCase().endsWith('.png'))) {
        if (!interceptedUrls.includes(url)) {
          interceptedUrls.push(url);
        }
      }
    });

    console.log(`?뱻 [?묒냽] 二쇰낫 寃뚯떆?먯쑝濡??대룞?⑸땲?? ${BOARD_URL}`);
    await page.goto(BOARD_URL, { waitUntil: 'networkidle' });

    console.log('?뵇 [?먯깋] 理쒖떊湲 諛?吏?쒖＜ ?곸꽭湲 留곹겕 2媛쒕? ?먯깋?⑸땲??');
    const hrefs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map(a => a.href)
        .filter(href => href.includes('Mode=view') && href.includes('boardID=www50'));
    });

    const uniqueHrefs = [...new Set(hrefs)];
    if (uniqueHrefs.length < 2) {
      throw new Error(`寃뚯떆?먯뿉??理쒖냼 2媛쒖쓽 湲???먯깋?섏? 紐삵뻽?듬땲?? (諛쒓껄??湲 媛쒖닔: ${uniqueHrefs.length})`);
    }

    const thisWeekUrl = uniqueHrefs[0];
    const prevWeekUrl = uniqueHrefs[1];

    console.log(`?뵕 [?대쾲 二?二쇰낫 湲]: ${thisWeekUrl}`);
    console.log(`?뵕 [吏?쒖＜ 二쇰낫 湲]: ${prevWeekUrl}`);

    // =========================================================================
    // 1?④퀎: ?대쾲 二?二쇰낫 媛怨?    // =========================================================================
    console.log('\n?뵷 [?대쾲 二?二쇰낫 ?섏쭛 媛쒖떆]');
    interceptedUrls.length = 0; // ?ㅻ땲????由ъ뀑
    await page.goto(thisWeekUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(3000);

    let thisWeekImages = [...new Set(interceptedUrls)].sort((a,b) => a.localeCompare(b));
    if (thisWeekImages.length < 4) {
      console.log('?좑툘 ?ㅻ땲??4??誘몃떖濡?媛뺤젣 ??궛 議곕┰ ?쒕룄...');
      // ?쒕ぉ ?깆뿉???좎쭨 ?섏쭛
      const pageText = await page.innerText('body');
      const dateMatch = pageText.match(/(\d{2,4})[-.\s/??*(\d{1,2})[-.\s/??*(\d{1,2})[-.\s/???/);
      let dateStr = '20260531'; // 湲곕낯 fallback
      if (dateMatch) {
        let yyyy = dateMatch[1];
        if (yyyy.length === 2) yyyy = '20' + yyyy;
        dateStr = `${yyyy}${dateMatch[2].padStart(2, '0')}${dateMatch[3].padStart(2, '0')}`;
      }
      thisWeekImages = [
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫001.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫002.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫003.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫004.jpg`
      ];
    }
    const thisWeekTarget = thisWeekImages.slice(0, 4);
    await processJubbo(thisWeekTarget, '?대쾲 二?二쇰낫', 'processed', thisWeekUrl);

    // =========================================================================
    // 2?④퀎: 吏?쒖＜ 二쇰낫 媛怨?    // =========================================================================
    console.log('\n?윢 [吏?쒖＜ 二쇰낫 ?섏쭛 媛쒖떆]');
    interceptedUrls.length = 0; // ?ㅻ땲????由ъ뀑
    await page.goto(prevWeekUrl, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
    await page.waitForTimeout(3000);

    let prevWeekImages = [...new Set(interceptedUrls)].sort((a,b) => a.localeCompare(b));
    if (prevWeekImages.length < 4) {
      console.log('?좑툘 ?ㅻ땲??4??誘몃떖濡?吏?쒖＜ 媛뺤젣 ??궛 議곕┰ ?쒕룄...');
      const pageText = await page.innerText('body');
      const dateMatch = pageText.match(/(\d{2,4})[-.\s/??*(\d{1,2})[-.\s/??*(\d{1,2})[-.\s/???/);
      let dateStr = '20260524'; // 5??24???쇱슂??湲곕낯 fallback
      if (dateMatch) {
        let yyyy = dateMatch[1];
        if (yyyy.length === 2) yyyy = '20' + yyyy;
        dateStr = `${yyyy}${dateMatch[2].padStart(2, '0')}${dateMatch[3].padStart(2, '0')}`;
      }
      prevWeekImages = [
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫001.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫002.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫003.jpg`,
        `${BASE_URL}/user/saveDir/board/www50/${dateStr} 二쇰낫004.jpg`
      ];
    }
    const prevWeekTarget = prevWeekImages.slice(0, 4);
    await processJubbo(prevWeekTarget, '吏?쒖＜ 二쇰낫', 'prev_processed', prevWeekUrl);

    console.log('\n??[?듯빀 ?깃났] ?대쾲 二?諛?吏?쒖＜ 二쇰낫 履쇨컻湲??뺣젹 諛고룷媛 紐⑤몢 ?꾨즺?섏뿀?듬땲??');
  } catch (err) {
    console.error('\n??[?ㅻ쪟] ?먮룞???ㅽ뻾 ?먮윭:', err.message);
  } finally {
    if (browser) {
      await browser.close();
      console.log('?뵏 [釉뚮씪?곗? 醫낅즺] Playwright ?몄뀡???댁젣?덉뒿?덈떎.');
    }
  }
}

run();
