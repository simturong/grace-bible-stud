# 은혜 성경공부 웹앱 상세 구현 계획서 (2026-05-31-bible-study-plan.md)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 부모님을 위한 개역개정/개역한글 2대 번역본 전환, 아코디언식 66권 장번호 바둑판 네비게이션, 그리고 기계음 없는 남성/여성 2종 사람 음색 고품질 TTS가 이식된 웹앱을 견고한 TDD 방식으로 완성합니다.

---

### Task 4-1: 개역개정/개역한글 2대 번역본 데이터 구축 및 뷰어 실시간 전환 (TDD)

**Files:**
- Modify: `index.html` (번역본 토글 스위치 돔 마크업 추가)
- Modify: `app.js` (성경 데이터베이스 스키마 확장 및 실시간 전환 리스너 연동)
- Create: `test/task4_1_spec.js` (번역 스위치 클릭 시 텍스트 즉각 전환 여부 검증)

- [ ] **Step 1: 번역 전환 토글 스위치 UI 추가**
  `index.html` 성경 읽기 카드 상단에 큼직한 번역본 스위치를 추가합니다.
  ```html
  <div class="translation-toggle-group">
    <button type="button" class="btn-translation active" data-ver="rev">개역개정 4판</button>
    <button type="button" class="btn-translation" data-ver="hangul">개역한글 최신</button>
  </div>
  ```

- [ ] **Step 2: 2대 번역본 데이터셋 탑재 및 스위칭 로직 코딩**
  `app.js` 내부에 성경 구절 데이터를 2중 구조로 셋팅하고, 버튼 클릭 시 실시간으로 바인딩을 교체하는 함수를 작성합니다.
  ```javascript
  let currentTranslation = 'rev'; // 'rev' (개역개정) or 'hangul' (개역한글)

  function renderBibleVerses(book, translation) {
    const container = document.getElementById('passageContent');
    container.innerHTML = '';
    
    // book.verses 배열을 돌며 선택된 번역본 텍스트를 출력
    book.verses.forEach(v => {
      const text = translation === 'rev' ? v.text : (v.text_hangul || v.text);
      const div = document.createElement('div');
      div.className = 'verse';
      div.setAttribute('data-verse', v.num);
      div.setAttribute('data-text', text);
      div.innerHTML = `<span class="verse-num">${v.num}</span><span class="verse-text">${text}</span>`;
      container.appendChild(div);
    });
  }
  ```

- [ ] **Step 3: 번역 전환 단위 테스트 검증**
  Run: `test/task4_1_spec.js` 파일을 실행하여 번역본 스위치 변경 시 동일 절의 텍스트 내용이 개역개정에서 개역한글 고유의 전통 문체로 정밀 전환되는지 검증합니다.
  Expected: PASS.

---

### Task 4-2: 66권 구약/신약 대분류 및 아코디언식 "장번호 바둑판 버튼판" 구현 (TDD)

**Files:**
- Modify: `index.html`
- Modify: `style.css` (장번호 바둑판 레이아웃)
- Modify: `app.js` (책 클릭 시 하위 장번호 버튼 그리드 동적 생성 및 토글 애니메이션)
- Create: `test/task4_2_spec.js` (장번호 클릭 시 해당 성경 정독 탭으로 이동 및 1절 로드 확인 테스트)

- [ ] **Step 1: 책 카드 하단에 숨겨진 장번호 패널 마크업 추가**
  `index.html`에 동적으로 장번호가 그려질 아코디언 래퍼 영역을 구성합니다.
  ```html
  <div class="book-card-item" data-book="genesis">
    <span class="book-abbr">창</span>
    <span class="book-full-name">창세기</span>
    <!-- 클릭 시 열릴 장번호 그리드 영역 -->
    <div class="chapters-accordion" id="chapters-genesis" style="display: none;"></div>
  </div>
  ```

- [ ] **Step 2: 성경의 최대 장수만큼 장번호 버튼(`1`, `2` ... `50`) 생성 및 클릭 핸들러 코딩**
  `app.js`에서 각 책 카드를 누르면, 해당 성경의 전체 장수를 읽어와 예쁜 둥근 장번호 카드 그리드를 동적으로 렌더링하고 토글 슬라이드 방식으로 펼치는 함수를 작성합니다.
  ```javascript
  function toggleChaptersPanel(bookId, cardElement) {
    const book = bibleBooks.find(b => b.id === bookId);
    let accordion = cardElement.querySelector('.chapters-accordion');
    
    // 이미 열려있다면 닫고 종료
    if (accordion.style.display === 'block') {
      accordion.style.display = 'none';
      return;
    }

    // 장번호 버튼들을 바둑판 그리드로 생성
    accordion.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'chapters-button-grid';
    
    for (let i = 1; i <= book.totalChapters; i++) {
      const btn = document.createElement('button');
      btn.className = 'btn-chapter-num';
      btn.textContent = i;
      btn.onclick = (e) => {
        e.stopPropagation(); // 책 카드 클릭 버블링 방지
        loadBiblePassage(bookId, i); // 해당 성경의 i장 정독 로딩
        switchTab('reading'); // 읽기 탭으로 전환
      };
      grid.appendChild(btn);
    }
    accordion.appendChild(grid);
    accordion.style.display = 'block';
  }
  ```

- [ ] **Step 3: 장번호 네비게이션 단위 테스트 실행**
  Run: `test/task4_2_spec.js`를 가동하여 창세기 클릭 ➡️ 15장 버튼 클릭 ➡️ 정독 탭으로 이동하여 창세기 15장의 텍스트가 정상 브로드캐스팅되는지 검증합니다.
  Expected: PASS.

---

### Task 4-3: 기계음 없는 남성/여성 2종 사람 음색 TTS 고정 및 진행바 동화 (TDD)

**Files:**
- Modify: `index.html` (오디오 설정에서 복잡한 5개 드롭다운을 남성/여성 2종 토글로 변경)
- Modify: `bible-tts.js` (낭독 음색을 가장 사람 목소리에 근접한 피치 및 남성/여성 2개 Neural 매칭 스펙으로 압축)

- [ ] **Step 1: 남성/여성 2종 낭독 선택 UI 교체**
  `index.html` 하단 낭독 바의 목소리 유형을 깔끔하게 정리합니다.
  ```html
  <div class="dropdown-item">
    <label>낭독 목소리 선택</label>
    <div class="voice-gender-selector">
      <button type="button" class="btn-voice-gender active" data-gender="female">👩‍🍼 자상한 자매님 목소리</button>
      <button type="button" class="btn-voice-gender" data-gender="male">👨‍🦳 인자한 형제님 목소리</button>
    </div>
  </div>
  ```

- [ ] **Step 2: Web Speech Neural Voice 및 gTTS 기계음 배제 피치 스펙 코딩**
  `bible-tts.js`에서 복잡한 연산을 걷어내고, 기계음(쇳소리)을 유발하는 높은 음역대를 눌러 중저음의 부드러운 성구 낭독 2종으로 고정합니다.
  ```javascript
  let selectedGender = 'female'; // 'female' or 'male'

  function getRefinedVoiceParams(gender) {
    if (gender === 'female') {
      return { pitch: 1.05, rate: 0.82, lang: 'ko-KR' }; // 온화하고 차분함
    } else {
      return { pitch: 0.82, rate: 0.80, lang: 'ko-KR' }; // 신뢰도 높은 묵직한 중저음
    }
  }
  ```

- [ ] **Step 3: 남/여 2종 오디오 싱크 및 구절 하이라이트 정상 작동 검증**
  Run: 남성/여성 목소리를 바꾸어가며 낭독을 재생했을 때 피치와 말의 속도가 기계 티 없이 사람 구어체 낭독에 맞추어 부드럽게 흘러나오는지 검증합니다.
  Expected: PASS.
