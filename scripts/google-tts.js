/**
 * E:/Tak/Gemini/grace-bible-study/google-tts.js
 * 
 * Google Cloud Text-to-Speech (Neural2/Wavenet) API Integration Module
 * for Uijeongbu JoongAng Methodist Church Grace Bible Study App.
 */

(function() {
  // LocalStorage Keys
  const GOOGLE_TTS_ACTIVE_KEY = 'grace-bible-use-google-tts';
  const GOOGLE_API_KEY_KEY = 'grace-bible-google-api-key';

  let currentAudio = null;
  let onStartCallback = null;
  let onEndCallback = null;

  // 구글 TTS 활성화 상태 조회
  function isGoogleTtsActive() {
    return localStorage.getItem(GOOGLE_TTS_ACTIVE_KEY) === 'true';
  }

  // GCP API Key 조회
  function getGoogleApiKey() {
    return localStorage.getItem(GOOGLE_API_KEY_KEY) || 'REDACTED';
  }

  // 구글 Neural2 API 통신 및 합성 음성 재생 함수
  async function speak(text, voiceType, speakingRate, onStart, onEnd) {
    const apiKey = getGoogleApiKey();
    if (!apiKey) {
      console.warn('[Google TTS] API 키가 등록되어 있지 않습니다. 기본 TTS로 전환합니다.');
      return false;
    }

    onStartCallback = onStart;
    onEndCallback = onEnd;

    // 1. 구글 신경망 목소리 맵핑 (Neural2 명품 음질)
    // sister-voice ➔ ko-KR-Neural2-A (우아하고 차분한 자매님)
    // brother-voice ➔ ko-KR-Neural2-B (인자하고 중후한 형제님)
    const voiceName = (voiceType === 'brother-voice') ? 'ko-KR-Neural2-B' : 'ko-KR-Neural2-A';

    // 2. 구글 API 규격 파라미터 빌딩
    const requestBody = {
      input: { text: text },
      voice: {
        languageCode: 'ko-KR',
        name: voiceName
      },
      audioConfig: {
        audioEncoding: 'MP3',
        speakingRate: speakingRate || 1.0, // 속도 실시간 연동 (0.6 ~ 1.4)
        pitch: 0.0
      }
    };

    try {
      // 재생 중인 오디오가 있으면 즉시 중단
      stop();

      const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error ? errData.error.message : 'Speech synthesis failed');
      }

      const data = await response.json();
      if (!data.audioContent) {
        throw new Error('Audio content missing in API response');
      }

      // 3. Base64 오디오 바이너리를 브라우저 오디오 객체로 바인딩
      const audioUrl = `data:audio/mp3;base64,${data.audioContent}`;
      currentAudio = new Audio(audioUrl);

      // 이벤트 바인딩
      currentAudio.addEventListener('play', () => {
        if (typeof onStartCallback === 'function') onStartCallback();
      });

      currentAudio.addEventListener('ended', () => {
        if (typeof onEndCallback === 'function') onEndCallback();
      });

      currentAudio.addEventListener('error', (e) => {
        console.error('[Google TTS Audio Error] 오디오 재생 실패:', e);
        if (typeof onEndCallback === 'function') onEndCallback();
      });

      // 4. 즉시 재생 시작
      await currentAudio.play();
      return true;

    } catch (err) {
      console.error('[Google TTS API 호출 실패] 기본 SpeechSynthesis로 대체 구동합니다:', err);
      return false; // 연동 실패 알림 ➔ bible-tts.js에서 로컬 폴백 구동
    }
  }

  // 재생 정지 함수
  function stop() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  // 재생 일시 정지
  function pause() {
    if (currentAudio) {
      currentAudio.pause();
    }
  }

  // 일시정지 후 재개
  function resume() {
    if (currentAudio) {
      currentAudio.play();
    }
  }

  // ── 글로벌 모듈 등록 ──
  window.googleTTS = {
    isGoogleTtsActive,
    getGoogleApiKey,
    speak,
    stop,
    pause,
    resume
  };
})();
