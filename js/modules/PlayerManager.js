
export class PlayerManager {
  constructor() {
    this.audioPlayer = document.getElementById("audioPlayer");
    this.btnPlay = document.getElementById("btnPlay");
    this.btnPrev = document.getElementById("btnPrev");
    this.btnNext = document.getElementById("btnNext");
    this.progressBar = document.getElementById("progressBar");
    this.progressContainer = document.getElementById("progressContainer");
    this.currentTimeEl = document.getElementById("currentTime");
    this.durationEl = document.getElementById("duration");
    this.currentTrackLabel = document.getElementById("currentTrackLabel");
    
    this.playlist = [];
    this.currentIndex = 0;
  }

  init() {
    this.bindEvents();
    console.log("[PlayerManager] Initialized");
  }

  bindEvents() {
    if (this.btnPlay) {
      this.btnPlay.addEventListener("click", () => this.togglePlay());
    }
    if (this.btnPrev) {
      this.btnPrev.addEventListener("click", () => this.playPrev());
    }
    if (this.btnNext) {
      this.btnNext.addEventListener("click", () => this.playNext());
    }
    if (this.audioPlayer) {
      this.audioPlayer.addEventListener("timeupdate", () => this.updateProgress());
      this.audioPlayer.addEventListener("ended", () => this.playNext());
      this.audioPlayer.addEventListener("loadedmetadata", () => this.updateDuration());
    }
    if (this.progressContainer) {
      this.progressContainer.addEventListener("click", (e) => this.seek(e));
    }
  }

  loadPlaylist(items) {
    this.playlist = items;
    this.currentIndex = 0;
    this.loadTrack(this.currentIndex);
  }

  loadTrack(index) {
    if (this.playlist.length === 0 || index < 0 || index >= this.playlist.length) return;
    const track = this.playlist[index];
    if (this.audioPlayer) {
      this.audioPlayer.src = track.url;
      this.audioPlayer.load();
    }
    if (this.currentTrackLabel) {
      this.currentTrackLabel.textContent = track.title;
    }
  }

  togglePlay() {
    if (!window.bibleTTS) return;
    
    const audio = window.bibleTTS.getCurrentAudio();
    if (audio) {
      if (audio.paused) {
        audio.play().then(() => this.updatePlayState(true)).catch(console.error);
      } else {
        audio.pause();
        this.updatePlayState(false);
      }
    } else {
      // If no audio exists, start playing current chapter
      if (typeof window.bibleTTS.playCloudChapter === 'function') {
        window.bibleTTS.playCloudChapter();
        this.updatePlayState(true);
      }
    }
  }

  playNext() {
    if (window.graceBibleApp && typeof window.graceBibleApp.playNextChapter === 'function') {
      window.graceBibleApp.playNextChapter();
    }
  }

  playPrev() {
    if (window.graceBibleApp && typeof window.graceBibleApp.playPrevChapter === 'function') {
      window.graceBibleApp.playPrevChapter();
    }
  }

  updatePlayState(isPlaying) {
    if (!this.btnPlay) return;
    this.btnPlay.innerHTML = isPlaying ? "⏸️" : "▶️";
  }

  updateProgress() {
    if (!this.audioPlayer || !this.progressBar || !this.currentTimeEl) return;
    const current = (window.bibleTTS ? window.bibleTTS.getCurrentAudio() : null)?.currentTime;
    const duration = (window.bibleTTS ? window.bibleTTS.getCurrentAudio() : null)?.duration || 1;
    const percent = (current / duration) * 100;
    this.progressBar.style.width = `${percent}%`;
    this.currentTimeEl.textContent = this.formatTime(current);
  }

  updateDuration() {
    if (!this.audioPlayer || !this.durationEl) return;
    this.durationEl.textContent = this.formatTime((window.bibleTTS ? window.bibleTTS.getCurrentAudio() : null)?.duration);
  }

  seek(e) {
    if (!this.audioPlayer || !this.progressContainer) return;
    const rect = this.progressContainer.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    (window.bibleTTS ? window.bibleTTS.getCurrentAudio() : null)?.currentTime = pos * (window.bibleTTS ? window.bibleTTS.getCurrentAudio() : null)?.duration;
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.playerManager = new PlayerManager();
  window.playerManager.init();
});
