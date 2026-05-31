(function () {
  let currentAudio = null;
  let currentUtterance = null;
  let isActuallySpeaking = false;

  function stopPlayback() {
    isActuallySpeaking = false;

    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;

    if (
      window.graceBibleApp &&
      typeof window.graceBibleApp.syncPlayStatus === "function"
    ) {
      window.graceBibleApp.syncPlayStatus(false);
    }
  }

  async function playCloudChapter() {
    stopPlayback();

    if (
      !window.graceBibleApp ||
      typeof window.graceBibleApp.getCurrentPassageVerses !== "function"
    )
      return;
    const verses = window.graceBibleApp.getCurrentPassageVerses();
    if (!verses || verses.length === 0) return;

    const fullText = verses.map((v) => v.text || v.rev).join(" ");
    console.log("[TTS] fullText:", fullText);

    const bookId = window.graceBibleApp.getCurrentBookId();
    const chapterNum = window.graceBibleApp.getCurrentChapterNum();
    const bookName = window.graceBibleApp.bibleBooks
      ? window.graceBibleApp.bibleBooks.find((b) => b.id === bookId)?.name ||
        "성경"
      : "성경";

    if (
      window.graceBibleApp &&
      typeof window.graceBibleApp.updatePlayerUI === "function"
    ) {
      window.graceBibleApp.updatePlayerUI(
        bookName + " " + chapterNum + "장",
        1,
        "전체 장 재생 중...",
      );
    }

    isActuallySpeaking = true;

    try {
      const CLOUD_FUNCTION_URL = "https://bible-tts-d3qayefmsq-an.a.run.app";
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: fullText }),
      });

      if (!response.ok) throw new Error("Cloud TTS Error");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      currentAudio = new Audio(audioUrl);

      currentAudio.addEventListener("play", () => {
        if (
          window.graceBibleApp &&
          typeof window.graceBibleApp.syncPlayStatus === "function"
        ) {
          window.graceBibleApp.syncPlayStatus(true);
        }
      });

      currentAudio.addEventListener("timeupdate", () => {
        const pct =
          (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
        if (
          window.graceBibleApp &&
          typeof window.graceBibleApp.updateProgressBar === "function"
        ) {
          window.graceBibleApp.updateProgressBar(pct);
        }
      });

      currentAudio.addEventListener("ended", () => {
        stopPlayback();
        if (
          window.graceBibleApp &&
          typeof window.graceBibleApp.playNextChapter === "function"
        ) {
          window.graceBibleApp.playNextChapter();
        }
      });

      currentAudio.play().catch((err) => {
        console.warn("[TTS] Audio play failed", err);
        stopPlayback();
      });
    } catch (err) {
      console.error("[TTS] Cloud Fetch failed, trying native fallback...", err);
      // Fallback
    }
  }

  function getVoiceParams() {
    return { pitch: 1, rate: 1, type: "ko-KR" };
  }

  function wireUpPlayButtons() {}
  function wireUpMeditationAudioButton() {}
  function updateVoiceParams() {}
  function handleVoiceTypeChange() {}
  function init() {}
  function playMeditationAudio() {}
  function clearHighlight() {}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  
  function playVerse(verseElement) {
    if (!verseElement) return;
    const targetVerseNum = parseInt(verseElement.getAttribute("data-verse"), 10);
    if (isNaN(targetVerseNum)) return;

    if (!currentAudio) {
      playCloudChapter().then(() => {
        // Wait a bit for metadata to load so duration is available
        setTimeout(() => seekToVerse(targetVerseNum), 500);
      });
    } else {
      seekToVerse(targetVerseNum);
    }
  }

  function seekToVerse(targetVerseNum) {
    if (!currentAudio || isNaN(currentAudio.duration)) return;
    
    const verses = window.graceBibleApp && window.graceBibleApp.getCurrentPassageVerses 
      ? window.graceBibleApp.getCurrentPassageVerses() 
      : [];
    const totalVerses = verses.length;
    
    if (totalVerses === 0) return;
    
    const verseIndex = verses.findIndex(v => parseInt(v.num, 10) === targetVerseNum);
    if (verseIndex >= 0) {
      // Option A: Proportional seek
      const targetTime = (verseIndex / totalVerses) * currentAudio.duration;
      currentAudio.currentTime = targetTime;
      if (currentAudio.paused) {
        currentAudio.play();
      }
    }
  }

  window.bibleTTS = {
    playVerse,
    seekToVerse,
    getCurrentAudio: () => currentAudio,
    playCloudChapter,
    stopPlayback,
    playMeditationAudio,
    clearHighlight,
    wireUpPlayButtons,
    wireUpMeditationAudioButton,
    updateVoiceParams,
    handleVoiceTypeChange,
    getCurrentUtterance: () => currentUtterance,
    getActiveHighlightedVerse: () => null,
    getIsActuallySpeaking: () => isActuallySpeaking,
  };
})();
