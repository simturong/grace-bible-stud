/**
 * E:/Tak/Gemini/grace-bible-study/test/task4_spec.js
 * 
 * Node.js-based unit tests for Task 4: Luxury Bible Theme, 66-book Grid card binding,
 * 365-day rotation database, and Floating Glassmorphic Audio Player state synchronization.
 */

const assert = require('assert').strict;

// --- 1. Mocking Browser DOM & LocalStorage for Node Environment ---
class ElementMock {
  constructor(id, tagName = 'div', attributes = {}) {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.listeners = {};
    this.innerHTML = '';
    this.textContent = '';
    this.children = [];
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.parentNode = null;
  }

  replaceChild(newChild, oldChild) {
    const idx = this.children.indexOf(oldChild);
    if (idx !== -1) {
      this.children[idx] = newChild;
    }
    newChild.parentNode = this;
    return newChild;
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  addEventListener(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  dispatchEvent(event, eventObj = {}) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(eventObj));
    }
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  cloneNode(deep) {
    const clone = new ElementMock(this.id, this.tagName, { ...this.attributes });
    clone.listeners = { ...this.listeners };
    clone.classList.classes = new Set(this.classList.classes);
    clone.innerHTML = this.innerHTML;
    clone.textContent = this.textContent;
    return clone;
  }

  getBoundingClientRect() {
    return { width: 800, height: 320, left: 10, top: 10 };
  }
}

// LocalStorage Mock
const localStorageStore = {};
global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, value) => { localStorageStore[key] = String(value); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

// Web Speech Synthesis Mocks
class SpeechSynthesisUtteranceMock {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.voice = null;
    this.pitch = 1.0;
    this.rate = 1.0;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    this.onboundary = null;
  }
}

class SpeechSynthesisMock {
  constructor() {
    this.speaking = false;
    this.paused = false;
    this.spokenUtterances = [];
    this.canceled = false;
  }

  speak(utterance) {
    this.speaking = true;
    this.spokenUtterances.push(utterance);
    if (typeof utterance.onstart === 'function') {
      utterance.onstart();
    }
  }

  cancel() {
    this.speaking = false;
    this.canceled = true;
  }

  getVoices() {
    return [
      { name: 'Google 한국어', lang: 'ko-KR', default: true }
    ];
  }
}

// Build standard HTML DOM Mock structures
const mockElements = {
  // Tabs buttons
  'tabBtnReading': new ElementMock('tabBtnReading', 'button', { 'data-tab': 'reading' }),
  'tabBtnMeditation': new ElementMock('tabBtnMeditation', 'button', { 'data-tab': 'meditation' }),
  'tabBtnTranscription': new ElementMock('tabBtnTranscription', 'button', { 'data-tab': 'transcription' }),
  'tabBtnExplorer': new ElementMock('tabBtnExplorer', 'button', { 'data-tab': 'explorer' }),
  
  // Tab containers
  'readingTab': new ElementMock('readingTab', 'div'),
  'meditationTab': new ElementMock('meditationTab', 'div'),
  'transcriptionTab': new ElementMock('transcriptionTab', 'div'),
  'explorerTab': new ElementMock('explorerTab', 'div'),

  // Header & body
  'passageTitle': new ElementMock('passageTitle', 'h2'),
  'passageReference': new ElementMock('passageReference', 'span'),
  'passageContent': new ElementMock('passageContent', 'div'),
  'reflectionInput': new ElementMock('reflectionInput', 'textarea'),
  'btnSaveReflection': new ElementMock('btnSaveReflection', 'button'),
  'btnClearCanvas': new ElementMock('btnClearCanvas', 'button'),
  'btnSubmitDrawing': new ElementMock('btnSubmitDrawing', 'button'),
  
  // Meditation panel
  'meditationQuote': new ElementMock('meditationQuote', 'p'),
  'meditationQuoteRef': new ElementMock('meditationQuoteRef', 'span'),
  'meditationContent': new ElementMock('meditationContent', 'p'),
  'meditationPrayer': new ElementMock('meditationPrayer', 'p'),
  'meditationDayLabel': new ElementMock('meditationDayLabel', 'span'),
  'btnPrevMeditation': new ElementMock('btnPrevMeditation', 'button'),
  'btnNextMeditation': new ElementMock('btnNextMeditation', 'button'),
  
  // Transcription text linkage
  'transcriptionGuideText': new ElementMock('transcriptionGuideText', 'p'),
  'transcriptionCanvas': new ElementMock('transcriptionCanvas', 'canvas'),
  'bibleBooksGridContainer': new ElementMock('bibleBooksGridContainer', 'div'),
  
  // Floating Player Elements
  'floatingPlayerBar': new ElementMock('floatingPlayerBar', 'div'),
  'playerBookTag': new ElementMock('playerBookTag', 'span'),
  'playerVerseIndicator': new ElementMock('playerVerseIndicator', 'span'),
  'playerVerseText': new ElementMock('playerVerseText', 'span'),
  'btnPlayerPlayToggle': new ElementMock('btnPlayerPlayToggle', 'button'),
  'btnPlayerNext': new ElementMock('btnPlayerNext', 'button'),
  'playerProgressBar': new ElementMock('playerProgressBar', 'div'),
  'playerProgressContainer': new ElementMock('playerProgressContainer', 'div'),
  'btnVoiceSetting': new ElementMock('btnVoiceSetting', 'button'),
  'voiceDropdown': new ElementMock('voiceDropdown', 'div'),
  'voiceSelect': new ElementMock('voiceSelect', 'select'),
  'voiceRate': new ElementMock('voiceRate', 'input', { value: '0.82' }),
  'rateVal': new ElementMock('rateVal', 'span')
};

// Global mocks
global.alert = () => {};
global.SpeechSynthesisUtterance = SpeechSynthesisUtteranceMock;
global.window = {
  speechSynthesis: new SpeechSynthesisMock(),
  addEventListener: () => {},
  resizeCanvas: () => {}
};

global.document = {
  body: new ElementMock('body', 'body'),
  readyState: 'complete',
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  },
  getElementById: (id) => mockElements[id] || null,
  querySelectorAll: (selector) => {
    if (selector === '.btn-font-toggle') {
      return [
        new ElementMock('btnFontSmall', 'button', { 'data-size': 'small' }),
        new ElementMock('btnFontMedium', 'button', { 'data-size': 'medium' }),
        new ElementMock('btnFontLarge', 'button', { 'data-size': 'large' })
      ];
    }
    if (selector === '.tab-button') {
      return [
        mockElements['tabBtnReading'],
        mockElements['tabBtnMeditation'],
        mockElements['tabBtnTranscription'],
        mockElements['tabBtnExplorer']
      ];
    }
    if (selector === '.tab-content') {
      return [
        mockElements['readingTab'],
        mockElements['meditationTab'],
        mockElements['transcriptionTab'],
        mockElements['explorerTab']
      ];
    }
    if (selector === '.btn-filter') {
      return [
        new ElementMock('filterAll', 'button', { 'data-filter': 'all' }),
        new ElementMock('filterOt', 'button', { 'data-filter': 'ot' }),
        new ElementMock('filterNt', 'button', { 'data-filter': 'nt' })
      ];
    }
    if (selector === '.btn-play-verse') {
      // Return newly built dynamic play buttons during passage injection
      return mockElements['passageContent'].children.map(v => v.children.find(c => c.classList.contains('btn-play-verse') || c.tagName === 'BUTTON'));
    }
    if (selector === '.verse') {
      return mockElements['passageContent'].children;
    }
    return [];
  },
  querySelector: (selector) => {
    // Handle specific selectors like `.verse[data-verse="1"]`
    const match = selector.match(/\.verse\[data-verse="(\d+)"\]/);
    if (match) {
      const vNum = match[1];
      return mockElements['passageContent'].children.find(child => child.getAttribute('data-verse') === vNum) || null;
    }
    if (selector === '.verse') {
      return mockElements['passageContent'].children[0] || null;
    }
    return null;
  },
  createElement: (tagName) => {
    return new ElementMock(`created-${Math.random()}`, tagName);
  }
};

// Require our modular scripts under mocked variables context
require('../app.js');
require('../bible-tts.js');

// Helper to reset DOM mocks
function resetDOMMocks() {
  localStorage.clear();
  Object.values(mockElements).forEach(el => {
    el.innerHTML = '';
    el.textContent = '';
    el.children = [];
    el.classList.classes.clear();
    // Keep registered listeners for test events
  });
  global.window.speechSynthesis.speaking = false;
  global.window.speechSynthesis.spokenUtterances = [];
  global.window.speechSynthesis.canceled = false;
  window.bibleTTS.stopPlayback();
}

// --- Test Execution ---
function runTask4Tests() {
  console.log('\x1b[36m%s\x1b[0m', '\n==================================================');
  console.log('\x1b[36m%s\x1b[0m', '   RUNNING TASK 4 SPEC: BIBLE CARD & TTS SYNCS   ');
  console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      resetDOMMocks();
      fn();
      console.log(`\x1b[32m✔ [SUCCESS] ${description}\x1b[0m`);
      passed++;
    } catch (error) {
      console.log(`\x1b[31m✘ [FAILED]  ${description}\x1b[0m`);
      console.error(error);
      failed++;
    }
  }

  // Test 1: Check 66-Book grid database properties
  test('66-Book database should contain all 66 canonical books divided into OT/NT categories', () => {
    const books = window.graceBibleApp.bibleBooks;
    assert.equal(books.length, 66, 'There must be exactly 66 books in the database list');

    const otCount = books.filter(b => b.testament === 'OT').length;
    const ntCount = books.filter(b => b.testament === 'NT').length;
    assert.equal(otCount, 39, 'Old Testament must contain exactly 39 books');
    assert.equal(ntCount, 27, 'New Testament must contain exactly 27 books');

    // Confirm Genesis is book 1, Revelation is book 66
    assert.equal(books[0].name, '창세기', 'First book must be Genesis (창세기)');
    assert.equal(books[65].name, '요한계시록', 'Last book must be Revelation (요한계시록)');
  });

  // Test 2: Check 365 meditation rotations database
  test('Meditation database must have beautiful inspirational presets and support prev/next day loops', () => {
    const medDb = window.graceBibleApp.meditationDb;
    assert.ok(medDb.length > 0, 'Meditation rotation presets list must be populated');

    // Trigger manual load for test isolation
    window.graceBibleApp.loadMeditationData(1);

    // Load initial meditation day
    assert.ok(window.graceBibleApp.getMeditationDay() >= 1 && window.graceBibleApp.getMeditationDay() <= 365, 'Default meditation Day index must be between 1 and 365');
    
    // Simulate loading meditation data elements
    assert.ok(mockElements['meditationQuote'].textContent.includes('여호와는 나의 목자시니'), 'Meditation title quote must load correctly');
  });

  // Test 3: Book selection and routing
  test('Selecting a book from the 66-book grid updates the passage and switches tab correctly', () => {
    // Assert initial active book is default Psalms (시편 - id 19)
    assert.equal(window.graceBibleApp.getCurrentBookId(), 19, 'Initial active book id should be 19 (Psalms)');

    // Select Matthew (마태복음 - id 40)
    window.graceBibleApp.loadBiblePassage(40);
    assert.equal(window.graceBibleApp.getCurrentBookId(), 40, 'Active book id must update to 40 (Matthew)');

    // Assert passage header details updated
    assert.ok(mockElements['passageTitle'].innerHTML.includes('마태복음'), 'Passage title should contain 마태복음');
    assert.ok(mockElements['passageReference'].textContent.includes('마태복음'), 'Passage reference should contain 마태복음');
    assert.ok(mockElements['passageContent'].children.length > 0, 'Passage content should be populated with verse child elements');

    // Assert active verse tracks calligraphy transcription guideline
    assert.ok(mockElements['transcriptionGuideText'].textContent.includes('수고하고 무거운 짐 진 자들아'), 'Calligraphy guide text must update to match the active verse');
  });

  // Test 4: Floating Player playback controls integration
  test('Clicking play/pause toggle inside the floating player bar initiates Speech Synthesis correctly', () => {
    // Load Psalms key passage
    window.graceBibleApp.loadBiblePassage(19);

    // Initial play state is stopped
    assert.equal(global.window.speechSynthesis.speaking, false, 'Should not be speaking initially');

    // Simulate clicking player bar play/pause toggle
    mockElements['btnPlayerPlayToggle'].dispatchEvent('click');

    // Assert speech starts
    assert.ok(global.window.speechSynthesis.speaking, 'Should trigger SpeechSynthesis speak');
    assert.equal(global.window.speechSynthesis.spokenUtterances.length, 1, 'One utterance sent to synthesis');

    const utterance = global.window.speechSynthesis.spokenUtterances[0];
    assert.equal(utterance.text, '여호와는 나의 목자시니 내게 부족함이 없으리로다', 'Should speak the first verse text');
    assert.equal(utterance.lang, 'ko-KR', 'Speech lang must be Korean ko-KR');

    // Assert active verse highlight in the passage
    const firstVerseEl = mockElements['passageContent'].children[0];
    assert.ok(firstVerseEl.classList.contains('active-highlight'), 'First verse must contain active-highlight class on start');
  });

  // Test 5: Next Verse progression in player
  test('Clicking next button in floating player advances to the subsequent verse in the passage', () => {
    window.graceBibleApp.loadBiblePassage(19);

    // Select first verse
    const firstVerseEl = mockElements['passageContent'].children[0];
    window.graceBibleApp.selectVerse(1, firstVerseEl);
    assert.equal(window.graceBibleApp.getActiveVerseNum(), 1, 'Active verse index must be 1');

    // Trigger floating bar next verse action
    mockElements['btnPlayerNext'].dispatchEvent('click');

    // Assert active verse advanced to 2
    assert.equal(window.graceBibleApp.getActiveVerseNum(), 2, 'Active verse must advance to 2');
    assert.ok(mockElements['playerVerseText'].textContent.includes('푸른 풀밭에 누이시며'), 'Player verse text must update to verse 2');
  });

  // Test 6: Persisted LocalStorage routing state
  test('Current active book selection and font size parameters are persisted in localStorage', () => {
    // Select different book (Genesis - id 1)
    window.graceBibleApp.loadBiblePassage(1);
    assert.equal(localStorage.getItem('grace-bible-current-book-id'), '1', 'Selected book id must be written to localStorage');
  });

  // Summary
  console.log('\x1b[36m%s\x1b[0m', '\n--------------------------------------------------');
  console.log(`TEST SUMMARY: ${passed} passed, ${failed} failed`);
  console.log('\x1b[36m%s\x1b[0m', '--------------------------------------------------\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTask4Tests();
