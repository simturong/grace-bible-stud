// cloud-tts.js
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('btnPlayMeditationAudio');
    if (!playBtn) return;

    let currentAudio = null;

    playBtn.addEventListener('click', async () => {
        // 이미 재생 중이면 중지
        if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
            playBtn.innerHTML = '🔊 낭독 듣기';
            return;
        }

        // 오늘의 묵상 텍스트 가져오기
        const quoteEl = document.getElementById('meditationQuote');
        const refEl = document.getElementById('meditationQuoteRef');
        const contentEl = document.getElementById('meditationContent');
        const prayerEl = document.getElementById('meditationPrayer');

        // 자연스럽게 이어지도록 문맥을 추가하여 텍스트 조합
        let fullText = "";
        if (refEl) fullText += refEl.innerText + " 말씀입니다. ";
        if (quoteEl) fullText += quoteEl.innerText + ". ";
        if (contentEl) fullText += "오늘의 묵상 해설입니다. " + contentEl.innerText + " ";
        if (prayerEl) fullText += "오늘의 다짐과 마치는 기도입니다. " + prayerEl.innerText;

        if (!fullText.trim()) {
            alert("읽을 묵상 내용이 없습니다.");
            return;
        }

        // 로딩 UI 상태 변경
        const originalBtnText = playBtn.innerHTML;
        playBtn.innerHTML = '⏳ 음성 생성 중...';
        playBtn.disabled = true;

        try {
            // 우리가 배포한 GCP Cloud Function 주소
            const CLOUD_FUNCTION_URL = 'https://bible-tts-d3qayefmsq-an.a.run.app';
            const response = await fetch(CLOUD_FUNCTION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: fullText })
            });

            if (!response.ok) {
                throw new Error('TTS 서버 응답 오류');
            }

            // 응답받은 MP3 오디오 데이터 처리
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);

            currentAudio = new Audio(audioUrl);
            
            // 재생 시작
            currentAudio.play();
            playBtn.innerHTML = '⏹️ 낭독 중지';
            playBtn.disabled = false;

            // 오디오 재생이 끝나면 버튼 상태 원상복구
            currentAudio.onended = () => {
                playBtn.innerHTML = '🔊 낭독 듣기';
                currentAudio = null;
            };

        } catch (error) {
            console.error('TTS Error:', error);
            alert("음성을 생성하는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
            playBtn.innerHTML = originalBtnText;
            playBtn.disabled = false;
        }
    });
});
