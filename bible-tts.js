(function () {
  let currentAudio = null;
  let isActuallySpeaking = false;
  let activeVerseIndex = -1;
  let versesQueue = [];

  function stopPlayback() {
    isActuallySpeaking = false;
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
    clearHighlight();
    activeVerseIndex = -1;
  }

  function clearHighlight() {
    document.querySelectorAll(".verse.active-highlight").forEach(el => el.classList.remove("active-highlight"));
  }

  async function playQueueIndex(index) {
    if (index >= versesQueue.length) {
      // Reached the end of the chapter
      stopPlayback();
      return;
    }

    activeVerseIndex = index;
    const verseObj = versesQueue[index];
    const textToPlay = verseObj.text || verseObj.rev || verseObj.text_hangul;

    if (!textToPlay) {
      playQueueIndex(index + 1);
      return;
    }

    clearHighlight();
    const verseEl = document.querySelector(`.verse[data-verse="${verseObj.num}"]`);
    if (verseEl) {
      verseEl.classList.add("active-highlight");
      verseEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    isActuallySpeaking = true;

    try {
      const CLOUD_FUNCTION_URL = "https://bible-tts-d3qayefmsq-an.a.run.app";
      const response = await fetch(CLOUD_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToPlay }),
      });

      if (!response.ok) throw new Error("Cloud TTS Error");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      currentAudio = new Audio(audioUrl);

      currentAudio.addEventListener("ended", () => {
        playQueueIndex(activeVerseIndex + 1);
      });

      currentAudio.play().catch(err => {
        console.warn("[TTS] Audio play failed", err);
        stopPlayback();
      });

    } catch (err) {
      console.error("[TTS] Cloud Fetch failed", err);
      stopPlayback();
    }
  }

  function playVerse(verseElement) {
    if (!verseElement) return;
    const targetVerseNum = parseInt(verseElement.getAttribute("data-verse"), 10);
    if (isNaN(targetVerseNum)) return;

    if (!window.graceBibleApp || typeof window.graceBibleApp.getCurrentPassageVerses !== "function") return;
    versesQueue = window.graceBibleApp.getCurrentPassageVerses();
    if (!versesQueue || versesQueue.length === 0) return;

    const index = versesQueue.findIndex(v => parseInt(v.num, 10) === targetVerseNum);
    if (index >= 0) {
      // Toggle logic: If clicking the currently playing verse, stop it.
      if (isActuallySpeaking && activeVerseIndex === index) {
        stopPlayback();
      } else {
        stopPlayback();
        playQueueIndex(index);
      }
    }
  }

  // Stubs for backward compatibility and other features
  function playCloudChapter() {}
  function seekToVerse() {}
  function getVoiceParams() { return { pitch: 1, rate: 1, type: "ko-KR" }; }
  function wireUpPlayButtons() {}
  function wireUpMeditationAudioButton() {}
  function updateVoiceParams() {}
  function handleVoiceTypeChange() {}
  function playMeditationAudio() {}
  function init() {}

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
    getCurrentUtterance: () => null,
    getActiveHighlightedVerse: () => null,
    getIsActuallySpeaking: () => isActuallySpeaking,
  };
})();
