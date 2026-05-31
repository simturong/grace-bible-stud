/**
 * E:/Tak/Gemini/grace-bible-study/canvas-drawing.js
 * 
 * HTML5 Canvas drawing functionality for Bible Study Web App.
 * Supports fluid mouse & touch-based calligraphy drawing with 
 * custom forest/sepia primary styling matching the theme.
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('transcriptionCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const btnClear = document.getElementById('btnClearCanvas');
  const btnSubmit = document.getElementById('btnSubmitDrawing');

  let drawing = false;
  let hasDrawn = false;

  // 1. Context styling setup
  function initContextStyles() {
    // Dynamic calligraphy brush color according to active theme primary color
    const activeColor = getComputedStyle(document.body).getPropertyValue('--primary-color').trim() || '#7A4E3A';
    ctx.strokeStyle = activeColor;
    ctx.lineWidth = 4.5;         // Premium medium brush for smooth calligraphy
    ctx.lineCap = 'round';       // Elegant round brush caps
    ctx.lineJoin = 'round';      // Round line join for smooth curves
  }

  // 2. Responsive Canvas Resizing with State Retention
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    
    // Only trigger resize when dimensions actually change
    if (canvas.width !== rect.width || canvas.height !== rect.height) {
      let tempImage = null;
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch (e) {
          // Ignored in node mock tests or secure cross-origin context
        }
      }

      canvas.width = rect.width || 800;
      canvas.height = rect.height || 320;
      
      initContextStyles();

      if (tempImage) {
        try {
          ctx.putImageData(tempImage, 0, 0);
        } catch (e) {
          // Ignored
        }
      }
    }
  }

  // Expose resizeCanvas on window so index.html's tab toggle can trigger it
  window.resizeCanvas = resizeCanvas;

  // Initialize canvas dimensions on load
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // 3. Mouse Pos calculation
  function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // 4. Event Listeners for Mouse drawing
  canvas.addEventListener('mousedown', (e) => {
    const pos = getMousePos(e);
    drawing = true;
    hasDrawn = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });

  canvas.addEventListener('mouseup', () => {
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener('mouseleave', () => {
    drawing = false;
    ctx.beginPath();
  });

  // 5. Event Listeners for Touch drawing (Mobile / Tablet support)
  canvas.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent screen dragging/scrolling while drawing
    const pos = getMousePos(e);
    drawing = true;
    hasDrawn = true;
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  });

  canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // Prevent screen dragging/scrolling while drawing
    if (!drawing) return;
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  });

  canvas.addEventListener('touchend', (e) => {
    e.preventDefault();
    drawing = false;
    ctx.beginPath();
  });

  canvas.addEventListener('touchcancel', (e) => {
    e.preventDefault();
    drawing = false;
    ctx.beginPath();
  });

  // 6. Action: Clear Canvas
  if (btnClear) {
    btnClear.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasDrawn = false;
    });
  }

  // 7. Action: Submit drawing with Warm Praise Greeting Alert
  if (btnSubmit) {
    btnSubmit.addEventListener('click', () => {
      if (!hasDrawn) {
        alert('필사한 내용이 없습니다. 먼저 말씀을 직접 캔버스에 적어보세요! 😊');
        return;
      }
      alert('💖 필사를 완료하셨습니다!\n오늘 하루도 주님의 귀한 말씀을 마음에 새기며 은혜와 평강이 넘쳐나시기를 소망합니다. 참 잘하셨습니다! 🕊️');
    });
  }

  // Expose state getters for automated tests
  window.getDrawingState = () => {
    return {
      drawing,
      hasDrawn
    };
  };

  window.setDrawingState = (state) => {
    if (state && typeof state.drawing === 'boolean') drawing = state.drawing;
    if (state && typeof state.hasDrawn === 'boolean') hasDrawn = state.hasDrawn;
  };
});
