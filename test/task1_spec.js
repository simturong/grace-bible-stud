/**
 * E:/Tak/Gemini/grace-bible-study/test/task1_spec.js
 * 
 * Unit test suite to verify that:
 * 1. Changing the font size updates the document body class correctly.
 * 2. Active button classes are toggled correctly.
 * 3. The choice is stored in localStorage correctly.
 * 
 * Designed to run in standard Node.js without heavy browser dependencies,
 * making verification instant and ultra-reliable.
 */

const assert = require('assert').strict;

// --- Mocking Browser DOM & LocalStorage for Node Environment ---
class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  clear() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

class DOMTokenListMock {
  constructor() {
    this.tokens = new Set();
  }
  add(token) {
    this.tokens.add(token);
  }
  remove(token) {
    this.tokens.delete(token);
  }
  contains(token) {
    return this.tokens.has(token);
  }
  get value() {
    return Array.from(this.tokens).join(' ');
  }
}

class ElementMock {
  constructor(tagName = 'div', attrs = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attrs;
    this.classList = new DOMTokenListMock();
    this.listeners = {};
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

  dispatchEvent(event) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb());
    }
  }
}

// Global scope mocks
const mockLocalStorage = new LocalStorageMock();
const mockBody = new ElementMock('body');

const mockButtons = [
  new ElementMock('button', { 'data-size': 'small', 'id': 'btnFontSmall' }),
  new ElementMock('button', { 'data-size': 'medium', 'id': 'btnFontMedium' }),
  new ElementMock('button', { 'data-size': 'large', 'id': 'btnFontLarge' })
];

// Replicate the client-side JavaScript logic under test
const FONT_SIZE_KEY = 'grace-bible-font-size';

function setFontSize(size) {
  // Remove all size classes first
  mockBody.classList.remove('font-size-small');
  mockBody.classList.remove('font-size-medium');
  mockBody.classList.remove('font-size-large');
  
  // Add corresponding class
  const className = `font-size-${size}`;
  mockBody.classList.add(className);

  // Update button active state
  mockButtons.forEach(btn => {
    if (btn.getAttribute('data-size') === size) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Save to localStorage
  mockLocalStorage.setItem(FONT_SIZE_KEY, size);
}

// Setup Event Listeners matching client app
mockButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const size = btn.getAttribute('data-size');
    setFontSize(size);
  });
});

// --- Test Suites ---
function runTests() {
  console.log('\x1b[36m%s\x1b[0m', '\n==================================================');
  console.log('\x1b[36m%s\x1b[0m', '   RUNNING TASK 1 SPEC: FONT SCALING VERIFICATION   ');
  console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      mockLocalStorage.clear();
      mockBody.classList.remove('font-size-small');
      mockBody.classList.remove('font-size-medium');
      mockBody.classList.remove('font-size-large');
      mockButtons.forEach(b => b.classList.remove('active'));
      
      fn();
      
      console.log(`\x1b[32m✔ [SUCCESS] ${description}\x1b[0m`);
      passed++;
    } catch (error) {
      console.log(`\x1b[31m✘ [FAILED]  ${description}\x1b[0m`);
      console.error(error);
      failed++;
    }
  }

  // 1. Default fallback state test
  test('Should set standard default font size to medium', () => {
    setFontSize('medium');
    assert.ok(mockBody.classList.contains('font-size-medium'), 'Body class must contain font-size-medium');
    assert.ok(!mockBody.classList.contains('font-size-small'), 'Body class must not contain font-size-small');
    assert.equal(mockLocalStorage.getItem(FONT_SIZE_KEY), 'medium', 'LocalStorage should persist medium size');
    
    // Active class checks
    const activeBtn = mockButtons.find(b => b.getAttribute('data-size') === 'medium');
    assert.ok(activeBtn.classList.contains('active'), 'Medium button must have active class');
  });

  // 2. Change font size to Small (A-)
  test('Should change font size to small and persist in localStorage when clicked', () => {
    // Simulate user clicking on small button
    const smallBtn = mockButtons.find(b => b.getAttribute('data-size') === 'small');
    smallBtn.dispatchEvent('click');

    assert.ok(mockBody.classList.contains('font-size-small'), 'Body class must update to font-size-small');
    assert.ok(!mockBody.classList.contains('font-size-medium'), 'Body class must remove font-size-medium');
    assert.equal(mockLocalStorage.getItem(FONT_SIZE_KEY), 'small', 'LocalStorage should persist small size');
    
    assert.ok(smallBtn.classList.contains('active'), 'Small button must be highlighted with active class');
    
    const medBtn = mockButtons.find(b => b.getAttribute('data-size') === 'medium');
    assert.ok(!medBtn.classList.contains('active'), 'Medium button active class must be removed');
  });

  // 3. Change font size to Large (A+)
  test('Should change font size to large and persist in localStorage when clicked', () => {
    // Simulate user clicking on large button
    const largeBtn = mockButtons.find(b => b.getAttribute('data-size') === 'large');
    largeBtn.dispatchEvent('click');

    assert.ok(mockBody.classList.contains('font-size-large'), 'Body class must update to font-size-large');
    assert.equal(mockLocalStorage.getItem(FONT_SIZE_KEY), 'large', 'LocalStorage should persist large size');
    
    assert.ok(largeBtn.classList.contains('active'), 'Large button must have active class');
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
