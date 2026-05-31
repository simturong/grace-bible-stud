/**
 * E:/Tak/Gemini/grace-bible-study/test/task3_spec.js
 * 
 * Unit test suite to verify Task 3: Web Speech API TTS integration,
 * Korean voice support, active-highlight toggles, and play buttons.
 * 
 * Designed to run in standard Node.js to provide immediate and reliable feedback.
 */

const assert = require('assert').strict;

// --- Mocking Browser DOM & Speech Synthesis context for Node Environment ---
class ElementMock {
  constructor(id, tagName = 'div', attributes = {}) {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.listeners = {};
    this.classList = {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    };
  }
  getAttribute(name) {
    return this.attributes[name] || null;
  }
  setAttribute(name, value) {
    this.attributes[name] = value;
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
}

// Mock SpeechSynthesisUtterance
class SpeechSynthesisUtteranceMock {
  constructor(text) {
    this.text = text;
    this.lang = '';
    this.voice = null;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
  }
}

// Mock SpeechSynthesis
class SpeechSynthesisMock {
  constructor() {
    this.speaking = false;
    this.spokenUtterances = [];
    this.canceled = false;
  }
  speak(utterance) {
    this.speaking = true;
    this.spokenUtterances.push(utterance);
    // Simulate triggering start event asynchronously
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

// Create elements for Mock DOM
const versesData = [
  { id: '1', text: '여호와는 나의 목자시니 내게 부족함이 없으리로다' },
  { id: '2', text: '그가 나를 푸른 풀밭에 누이시며 쉴 만한 물 가로 인도하시는도다' }
];

const mockVerses = versesData.map(v => new ElementMock(`verse-${v.id}`, 'div', {
  'data-verse': v.id,
  'data-text': v.text
}));

const mockPlayButtons = versesData.map(v => new ElementMock(`btn-play-${v.id}`, 'button', {
  'data-verse': v.id
}));

// Setup Global Environment
global.alert = () => {};
global.SpeechSynthesisUtterance = SpeechSynthesisUtteranceMock;
global.window = {
  speechSynthesis: new SpeechSynthesisMock()
};

global.document = {
  readyState: 'complete',
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  },
  querySelectorAll: (selector) => {
    if (selector === '.btn-play-verse') {
      return mockPlayButtons;
    }
    return [];
  },
  querySelector: (selector) => {
    // Match selector like `.verse[data-verse="1"]`
    const match = selector.match(/\.verse\[data-verse="(\d+)"\]/);
    if (match) {
      const verseId = match[1];
      return mockVerses.find(v => v.getAttribute('data-verse') === verseId);
    }
    return null;
  }
};

// Require bible-tts.js to load the implementation into the mocked environment
require('../bible-tts.js');

// --- Test Suites ---
function runTests() {
  console.log('\x1b[36m%s\x1b[0m', '\n==================================================');
  console.log('\x1b[36m%s\x1b[0m', '   RUNNING TASK 3 SPEC: BIBLE TTS & HIGHLIGHTING   ');
  console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      // Reset mocks before each test
      global.window.speechSynthesis.speaking = false;
      global.window.speechSynthesis.spokenUtterances = [];
      global.window.speechSynthesis.canceled = false;
      mockVerses.forEach(v => {
        v.classList.classes.clear();
      });
      window.bibleTTS.stopPlayback();

      fn();
      
      console.log(`\x1b[32m✔ [SUCCESS] ${description}\x1b[0m`);
      passed++;
    } catch (error) {
      console.log(`\x1b[31m✘ [FAILED]  ${description}\x1b[0m`);
      console.error(error);
      failed++;
    }
  }

  // 1. playVerse adds the highlight and invokes speak
  test('playVerse should call speechSynthesis.speak with Korean text and apply high-contrast highlight class', () => {
    const verseElement = mockVerses[0];
    assert.equal(verseElement.classList.contains('active-highlight'), false, 'Should not highlight initially');

    window.bibleTTS.playVerse(verseElement);

    // Assert speaking status
    assert.ok(global.window.speechSynthesis.speaking, 'speechSynthesis should be speaking');
    assert.equal(global.window.speechSynthesis.spokenUtterances.length, 1, 'One utterance should be sent to speak');
    
    const utterance = global.window.speechSynthesis.spokenUtterances[0];
    assert.equal(utterance.text, '여호와는 나의 목자시니 내게 부족함이 없으리로다', 'Utterance text must match the verse content');
    assert.equal(utterance.lang, 'ko-KR', 'Utterance language must be Korean ko-KR');
    
    // Assert active-highlight class addition on start (triggered synchronously by our mock)
    assert.ok(verseElement.classList.contains('active-highlight'), 'verseElement must contain active-highlight class on utterance start');
    assert.equal(window.bibleTTS.getActiveHighlightedVerse(), verseElement, 'activeHighlightedVerse state must track the playing verse');
  });

  // 2. stopPlayback clears the highlight and cancels speech
  test('stopPlayback should stop speech synthesis and clear all highlights cleanly', () => {
    const verseElement = mockVerses[0];
    window.bibleTTS.playVerse(verseElement);
    assert.ok(verseElement.classList.contains('active-highlight'));

    window.bibleTTS.stopPlayback();

    assert.equal(global.window.speechSynthesis.speaking, false, 'speechSynthesis must not be speaking after stop');
    assert.ok(global.window.speechSynthesis.canceled, 'speechSynthesis must be canceled');
    assert.equal(verseElement.classList.contains('active-highlight'), false, 'active-highlight class must be removed');
    assert.equal(window.bibleTTS.getActiveHighlightedVerse(), null, 'activeHighlightedVerse state must be null');
  });

  // 3. Triggering play button click starts speech or stops it if already playing
  test('Simulating play button click should toggle TTS speech playback and active highlighting', () => {
    const btn = mockPlayButtons[0];
    const verseElement = mockVerses[0];

    // 1. Initial click - should start playing
    btn.dispatchEvent('click', { stopPropagation: () => {} });
    assert.ok(global.window.speechSynthesis.speaking, 'Clicking button should initiate speech synthesis');
    assert.ok(verseElement.classList.contains('active-highlight'), 'Highlighted class should be applied');

    // 2. Click again - should stop playback
    btn.dispatchEvent('click', { stopPropagation: () => {} });
    assert.equal(global.window.speechSynthesis.speaking, false, 'Clicking button again should stop playback');
    assert.equal(verseElement.classList.contains('active-highlight'), false, 'Highlighted class should be removed');
  });

  // 4. Utterance end event clears highlights cleanly
  test('When the TTS utterance naturally ends, onend event must remove the active highlight', () => {
    const verseElement = mockVerses[1];
    window.bibleTTS.playVerse(verseElement);
    
    assert.ok(verseElement.classList.contains('active-highlight'), 'Should be highlighted during playback');
    
    // Simulate natural end of speech
    const utterance = window.bibleTTS.getCurrentUtterance();
    assert.ok(utterance, 'Current utterance must exist');
    utterance.onend();

    assert.equal(verseElement.classList.contains('active-highlight'), false, 'Highlighted class must be removed on end');
    assert.equal(window.bibleTTS.getActiveHighlightedVerse(), null, 'activeHighlightedVerse must be reset to null');
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

runTests();
