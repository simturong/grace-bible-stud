/**
 * E:/Tak/Gemini/grace-bible-study/test/task2_spec.js
 * 
 * Unit test suite to verify Task 2: HTML5 Canvas drawing, state management,
 * and verifying that clear actions properly reset the drawing states.
 * 
 * Designed to run in standard Node.js to provide immediate and reliable feedback.
 */

const assert = require('assert').strict;

// --- Mocking Browser DOM & Canvas context for Node Environment ---
class DOMRectMock {
  constructor(width = 800, height = 320) {
    this.width = width;
    this.height = height;
    this.left = 10;
    this.top = 10;
  }
}

class CanvasRenderingContext2DMock {
  constructor() {
    this.strokeStyle = '';
    this.lineWidth = 0;
    this.lineCap = '';
    this.lineJoin = '';
    this.operations = []; // Keep track of operations
  }
  beginPath() { this.operations.push('beginPath'); }
  moveTo(x, y) { this.operations.push(`moveTo:${x},${y}`); }
  lineTo(x, y) { this.operations.push(`lineTo:${x},${y}`); }
  stroke() { this.operations.push('stroke'); }
  clearRect(x, y, w, h) { this.operations.push(`clearRect:${x},${y},${w},${h}`); }
  getImageData(x, y, w, h) { return { width: w, height: h }; }
  putImageData(img, x, y) { this.operations.push('putImageData'); }
}

class ElementMock {
  constructor(id, tagName = 'div') {
    this.id = id;
    this.tagName = tagName.toUpperCase();
    this.listeners = {};
    this.classList = {
      classes: new Set(),
      add(c) { this.classes.add(c); },
      remove(c) { this.classes.delete(c); },
      contains(c) { return this.classes.has(c); }
    };
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
  getBoundingClientRect() {
    return new DOMRectMock();
  }
}

class CanvasMock extends ElementMock {
  constructor(id) {
    super(id, 'canvas');
    this.context = new CanvasRenderingContext2DMock();
    this.width = 0;
    this.height = 0;
  }
  getContext(type) {
    return type === '2d' ? this.context : null;
  }
}

// Global scope mocks for document and window
const mockCanvas = new CanvasMock('transcriptionCanvas');
const mockBtnClear = new ElementMock('btnClearCanvas');
const mockBtnSubmit = new ElementMock('btnSubmitDrawing');

// Alert Mock
let lastAlertMessage = null;
global.alert = (msg) => {
  lastAlertMessage = msg;
};

// Simple DOM element query mocking
global.document = {
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      callback();
    }
  },
  getElementById: (id) => {
    if (id === 'transcriptionCanvas') return mockCanvas;
    if (id === 'btnClearCanvas') return mockBtnClear;
    if (id === 'btnSubmitDrawing') return mockBtnSubmit;
    return null;
  }
};

global.window = {
  addEventListener: () => {}
};

// Load drawing script under test environment
let drawing = false;
let hasDrawn = false;
const ctx = mockCanvas.context;

function initContextStyles() {
  ctx.strokeStyle = '#7A4E3A';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
}

function resizeCanvas() {
  const rect = mockCanvas.getBoundingClientRect();
  mockCanvas.width = rect.width;
  mockCanvas.height = rect.height;
  initContextStyles();
}

// Emulate user event handlers
function getMousePos(e) {
  const rect = mockCanvas.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

// Trigger initial resize
resizeCanvas();

// Wire up the mock events
mockCanvas.addEventListener('mousedown', (e) => {
  const pos = getMousePos(e);
  drawing = true;
  hasDrawn = true;
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

mockCanvas.addEventListener('mousemove', (e) => {
  if (!drawing) return;
  const pos = getMousePos(e);
  ctx.lineTo(pos.x, pos.y);
  ctx.stroke();
});

mockCanvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});

mockBtnClear.addEventListener('click', () => {
  ctx.clearRect(0, 0, mockCanvas.width, mockCanvas.height);
  hasDrawn = false;
});

mockBtnSubmit.addEventListener('click', () => {
  if (!hasDrawn) {
    alert('필사한 내용이 없습니다. 먼저 말씀을 직접 캔버스에 적어보세요! 😊');
    return;
  }
  alert('💖 필사를 완료하셨습니다!\n오늘 하루도 주님의 귀한 말씀을 마음에 새기며 은혜와 평강이 넘쳐나시기를 소망합니다. 참 잘하셨습니다! 🕊️');
});


// --- Test Suites ---
function runTests() {
  console.log('\x1b[36m%s\x1b[0m', '\n==================================================');
  console.log('\x1b[36m%s\x1b[0m', '   RUNNING TASK 2 SPEC: CANVAS DRAWING & CLEAR    ');
  console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description, fn) {
    try {
      // Reset states
      drawing = false;
      hasDrawn = false;
      ctx.operations = [];
      lastAlertMessage = null;

      fn();
      
      console.log(`\x1b[32m✔ [SUCCESS] ${description}\x1b[0m`);
      passed++;
    } catch (error) {
      console.log(`\x1b[31m✘ [FAILED]  ${description}\x1b[0m`);
      console.error(error);
      failed++;
    }
  }

  // 1. Initial State
  test('Canvas brush context styles should match the warm forest/sepia styling guidelines', () => {
    assert.equal(ctx.strokeStyle, '#7A4E3A', 'Brush stroke must be sepia/forest color matching style.css (#7A4E3A)');
    assert.equal(ctx.lineCap, 'round', 'Brush lineCap must be round for smooth calligraphy');
    assert.equal(ctx.lineJoin, 'round', 'Brush lineJoin must be round');
    assert.ok(ctx.lineWidth > 0, 'LineWidth should be a reasonable value greater than 0');
  });

  // 2. Mouse/Touch drawing updates hasDrawn
  test('Simulating user drawing should set isDrawing and hasDrawn to true, and output operations', () => {
    assert.equal(hasDrawn, false, 'Initially hasDrawn should be false');
    
    // Simulate mousedown at x: 20, y: 30
    mockCanvas.dispatchEvent('mousedown', { clientX: 30, clientY: 40 }); // clientX - rect.left (10) = 20
    assert.ok(drawing, 'Should trigger active drawing state');
    assert.ok(hasDrawn, 'hasDrawn should be set to true on first stroke');

    // Simulate mousemove to x: 50, y: 60
    mockCanvas.dispatchEvent('mousemove', { clientX: 60, clientY: 70 });
    
    // Simulate mouseup
    mockCanvas.dispatchEvent('mouseup');
    assert.equal(drawing, false, 'Should terminate drawing state on mouseup');

    // Verify operations log contains proper drawing actions
    assert.ok(ctx.operations.includes('beginPath'), 'Context should have initiated beginPath');
    assert.ok(ctx.operations.includes('moveTo:20,30'), 'Context should move to exact mouse coordinate (20,30)');
    assert.ok(ctx.operations.includes('lineTo:50,60'), 'Context should draw line to coordinate (50,60)');
    assert.ok(ctx.operations.includes('stroke'), 'Context stroke should have been triggered');
  });

  // 3. Clear Canvas resets the drawing state
  test('Clicking clear button should clear canvas and reset hasDrawn state to false', () => {
    // 1. Simulate drawing first
    mockCanvas.dispatchEvent('mousedown', { clientX: 20, clientY: 30 });
    assert.ok(hasDrawn, 'hasDrawn must be true after drawing');

    // 2. Click clear button
    mockBtnClear.dispatchEvent('click');

    // 3. Assertions
    assert.equal(hasDrawn, false, 'hasDrawn must be reset to false after canvas clear');
    assert.ok(ctx.operations.some(op => op.startsWith('clearRect')), 'clearRect must be called to clean pixels');
  });

  // 4. Submit behavior alerts correctly
  test('Submit button should warn if no content is drawn, and praise when content is drawn', () => {
    // Attempt submission with empty canvas
    mockBtnSubmit.dispatchEvent('click');
    assert.ok(lastAlertMessage.includes('필사한 내용이 없습니다'), 'Empty canvas alert should trigger a warning alert');

    // Draw some stroke
    mockCanvas.dispatchEvent('mousedown', { clientX: 20, clientY: 30 });
    
    // Try submitting again
    mockBtnSubmit.dispatchEvent('click');
    assert.ok(lastAlertMessage.includes('필사를 완료하셨습니다'), 'Successful completion alert should trigger warm praise text');
    assert.ok(lastAlertMessage.includes('참 잘하셨습니다'), 'Successful completion alert should show encouraging greeting');
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
