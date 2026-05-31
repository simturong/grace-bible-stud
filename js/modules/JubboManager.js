
export class JubboManager {
  constructor() {
    this.container = document.getElementById('jubboVerticalList');
    this.loader = document.getElementById('jubboLoader');
    this.error = document.getElementById('jubboError');
  }

  init() {
    if(!this.container) return;
    this.loadLatestJubbo();
  }

  async loadLatestJubbo() {
    this.showLoader();
    
    // Attempt to load processed images
    const processedPages = Array.from({length: 8}, (_, i) => `images/jubbo/processed_${i+1}.jpg`);
    
    const imgTest = new Image();
    imgTest.src = processedPages[0];
    
    imgTest.onload = () => {
      console.log("[JubboManager] Successfully loaded local processed images.");
      this.renderPages(processedPages);
    };

    imgTest.onerror = () => {
      console.error("[JubboManager] Local processed images not found. Falling back to error state.");
      this.showError("이번 주 주보 데이터가 아직 업로드되지 않았습니다.");
    };
  }

  renderPages(pages) {
    this.container.innerHTML = '';
    
    const magicSortIndices = [0, 1, 2, 4, 3, 5, 6, 7];
    const sortedPageLabels = ["1면", "2면", "3면", "4면", "5면", "6면", "7면", "8면"];

    magicSortIndices.forEach((targetIndex, sortedIdx) => {
      const pageUrl = pages[targetIndex];
      const pageLabel = sortedPageLabels[sortedIdx];

      const card = document.createElement("div");
      card.className = "jubbo-vertical-card";
      card.style.width = "100%";
      card.style.marginBottom = "1rem";
      
      card.innerHTML = `
        <img src="${pageUrl}" class="jubbo-full-img" alt="교회 주보 - ${pageLabel}" loading="eager" style="width:100%; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); cursor: pointer;" />
        <div class="jubbo-badge" style="text-align: center; margin-top: 0.5rem; font-weight: bold; color: var(--primary-color);">${pageLabel}</div>
      `;
      
      card.querySelector('img').addEventListener('click', () => {
        window.open(pageUrl, '_blank');
      });

      this.container.appendChild(card);
    });

    this.showContent();
  }

  showLoader() {
    if(this.loader) this.loader.style.display = "block";
    if(this.error) this.error.style.display = "none";
    if(this.container) this.container.style.display = "none";
  }

  showError(msg) {
    if(this.loader) this.loader.style.display = "none";
    if(this.error) {
      this.error.style.display = "block";
      const p = this.error.querySelector('.error-msg');
      if(p) p.textContent = msg;
    }
    if(this.container) this.container.style.display = "none";
  }

  showContent() {
    if(this.loader) this.loader.style.display = "none";
    if(this.error) this.error.style.display = "none";
    if(this.container) this.container.style.display = "flex";
  }
}

// Bootstrap
document.addEventListener("DOMContentLoaded", () => {
  window.jubboManager = new JubboManager();
  window.jubboManager.init();
});
