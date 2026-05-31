
import { UIManager } from './js/modules/UIManager.js';
import { PlayerManager } from './js/modules/PlayerManager.js';
import { BibleManager } from './js/modules/BibleManager.js';
import { MeditationManager } from './js/modules/MeditationManager.js';
// JubboManager is a class in js/modules/JubboManager.js (assuming we exported it)
import { JubboManager } from './js/modules/JubboManager.js';

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Initializing Grace Bible Study App...");

  // Initialize Core Managers
  window.uiManager = new UIManager();
  window.playerManager = new PlayerManager();
  window.bibleManager = new BibleManager();
  window.meditationManager = new MeditationManager();
  
  if (typeof JubboManager !== 'undefined') {
    window.jubboManager = new JubboManager();
  }

  // Bind global APIs expected by older scripts (e.g. bible-tts.js)
  window.graceBibleApp = {
    getCurrentPassageVerses: () => window.bibleManager.currentPassageData ? window.bibleManager.currentPassageData.verses : [],
    getCurrentBookId: () => window.bibleManager.currentBookId,
    getCurrentChapterNum: () => window.bibleManager.currentChapterNum,
    bibleBooks: window.bibleBooks,
    updatePlayerUI: (title) => {
       const playerBookTag = document.getElementById("playerBookTag");
       if (playerBookTag) playerBookTag.textContent = title;
    },
    syncPlayStatus: (isPlaying) => {
       if (window.playerManager) window.playerManager.updatePlayState(isPlaying);
    },
    updateProgressBar: (pct) => {
       if (window.playerManager) window.playerManager.updateProgressPct(pct);
    },
    playNextChapter: () => {
       const nextCh = window.bibleManager.currentChapterNum + 1;
       window.bibleManager.loadBiblePassage(window.bibleManager.currentBookId, nextCh);
       if (window.bibleTTS) window.bibleTTS.playCloudChapter();
    },
    playPrevChapter: () => {
       const prevCh = window.bibleManager.currentChapterNum - 1;
       if (prevCh > 0) {
         window.bibleManager.loadBiblePassage(window.bibleManager.currentBookId, prevCh);
         if (window.bibleTTS) window.bibleTTS.playCloudChapter();
       }
    }
  };

  // Start initialization sequence
  window.uiManager.init();
  window.playerManager.init();
  await window.bibleManager.init();
  window.meditationManager.init();
  if (window.jubboManager) window.jubboManager.init();
});
