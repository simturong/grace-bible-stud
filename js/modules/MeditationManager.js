
export class MeditationManager {
  constructor() {
    this.currentMeditationDay = 1;
    this.meditationQuote = document.getElementById("meditationQuote");
    this.meditationQuoteRef = document.getElementById("meditationQuoteRef");
    this.meditationContent = document.getElementById("meditationContent");
    this.meditationPrayer = document.getElementById("meditationPrayer");
    this.meditationDayLabel = document.getElementById("meditationDayLabel");
    this.btnPrevMeditation = document.getElementById("btnPrevMeditation");
    this.btnNextMeditation = document.getElementById("btnNextMeditation");
  }

  init() {
    this.bindEvents();
    this.loadMeditationData(this.currentMeditationDay);
  }

  bindEvents() {
    if (this.btnPrevMeditation) {
      this.btnPrevMeditation.addEventListener("click", () => {
        if (this.currentMeditationDay > 1) {
          this.loadMeditationData(this.currentMeditationDay - 1);
        }
      });
    }
    if (this.btnNextMeditation) {
      this.btnNextMeditation.addEventListener("click", () => {
        if (window.meditationData && this.currentMeditationDay < window.meditationData.length) {
          this.loadMeditationData(this.currentMeditationDay + 1);
        }
      });
    }
  }

  loadMeditationData(dayNum) {
    if (!window.meditationData) return;
    const data = window.meditationData.find((d) => d.day === dayNum);
    if (!data) return;

    this.currentMeditationDay = dayNum;
    
    if (this.meditationDayLabel) {
      this.meditationDayLabel.textContent = `Day ${dayNum} (${data.title})`;
    }
    if (this.meditationQuote) {
      this.meditationQuote.textContent = data.quote_hangul || data.quote;
    }
    if (this.meditationQuoteRef) {
      this.meditationQuoteRef.textContent = data.passage;
    }
    if (this.meditationContent) {
      this.meditationContent.textContent = data.content;
    }
    if (this.meditationPrayer) {
      this.meditationPrayer.textContent = data.prayer;
    }
  }
}
