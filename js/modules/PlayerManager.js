export class PlayerManager {
  constructor() {
    this.playlist = [];
    this.currentIndex = 0;
  }

  init() {
    this.bindEvents();
    console.log("[PlayerManager] Initialized minimal inline version");
  }

  bindEvents() {
    this.btnPlayerList = document.querySelector(".btn-list");
    this.playerListPanel = document.getElementById("playerListPanel");
    
    if (this.btnPlayerList) {
      this.btnPlayerList.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.playerListPanel) {
          const isOpen = this.playerListPanel.classList.toggle("active");
          if (isOpen) {
            this.renderPlayerListPanel();
          }
        }
      });
    }

    this.btnVoiceSetting = document.querySelector(".btn-voice");
    this.voiceDropdown = document.getElementById("voiceDropdown");
    
    if (this.btnVoiceSetting) {
      this.btnVoiceSetting.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.voiceDropdown) {
          this.voiceDropdown.classList.toggle("active");
        }
      });
    }
    
    if (this.voiceDropdown) {
      this.voiceDropdown.addEventListener("click", (e) => e.stopPropagation());
    }

    // Close dropdowns on outside click
    document.addEventListener("click", (e) => {
      if (this.playerListPanel && this.playerListPanel.classList.contains("active")) {
        if (!this.playerListPanel.contains(e.target) && e.target !== this.btnPlayerList) {
          this.playerListPanel.classList.remove("active");
        }
      }
      if (this.voiceDropdown && this.voiceDropdown.classList.contains("active")) {
        if (!this.voiceDropdown.contains(e.target) && e.target !== this.btnVoiceSetting) {
          this.voiceDropdown.classList.remove("active");
        }
      }
    });
  }

  renderPlayerListPanel() {
    if (!this.playerListPanel) return;
    this.playerListPanel.innerHTML = "";
    
    const header = document.createElement("div");
    header.className = "plist-header";
    header.innerHTML = `<h4 style="margin:0; font-family:var(--font-sans); font-size:1.1rem; color:white;">성경 이동</h4>
                         <button type="button" class="btn-plist-close" aria-label="닫기">×</button>`;
                         
    header.querySelector(".btn-plist-close").addEventListener("click", () => {
      this.playerListPanel.classList.remove("active");
    });
    this.playerListPanel.appendChild(header);

    const listContainer = document.createElement("div");
    listContainer.style.cssText = "padding: 1rem; overflow-y: auto; flex: 1;";

    const currentBookId = window.graceBibleApp ? window.graceBibleApp.getCurrentBookId() : null;

    const categoryOrder = [
      { id: 'law', title: '모세오경', color: '#E8F5E9', border: '#81C784' },
      { id: 'history', title: '역사서', color: '#FFF3E0', border: '#FFB74D' },
      { id: 'poetry', title: '시가서', color: '#E3F2FD', border: '#64B5F6' },
      { id: 'prophecy_major', title: '대선지서', color: '#FCE4EC', border: '#F06292' },
      { id: 'prophecy_minor', title: '소선지서', color: '#F3E5F5', border: '#BA68C8' },
      { id: 'gospel', title: '복음서', color: '#E0F7FA', border: '#4DD0E1' },
      { id: 'history_nt', title: '역사서 (신약)', color: '#FFF8E1', border: '#FFD54F' },
      { id: 'epistle_paul', title: '바울서신', color: '#FBE9E7', border: '#FF8A65' },
      { id: 'epistle_general', title: '일반서신', color: '#EFEBE9', border: '#A1887F' },
      { id: 'prophecy_nt', title: '예언서 (신약)', color: '#ECEFF1', border: '#90A4AE' }
    ];

    const grouped = {};
    window.bibleBooks.forEach((b) => {
      if (!grouped[b.category]) grouped[b.category] = [];
      grouped[b.category].push(b);
    });

    categoryOrder.forEach((cat) => {
      if (!grouped[cat.id]) return;
      const catTitle = document.createElement("div");
      catTitle.textContent = cat.title;
      catTitle.style.cssText = `font-family: var(--font-sans); font-size: 0.85rem; font-weight: 800; color: ${cat.border}; margin: 1rem 0 0.5rem 0.2rem;`;
      listContainer.appendChild(catTitle);

      const bookGrid = document.createElement("div");
      bookGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(65px, 1fr)); gap: 0.5rem;";

      grouped[cat.id].forEach((b) => {
        const bookBtn = document.createElement("button");
        bookBtn.type = "button";
        bookBtn.textContent = b.abbr;
        
        const isCurrentBook = currentBookId === b.id;
        
        bookBtn.style.cssText = `
          padding: 0.5rem 0;
          border-radius: 8px;
          border: 1px solid ${isCurrentBook ? cat.border : 'var(--border-color)'};
          background: ${isCurrentBook ? cat.border : 'var(--card-bg)'};
          color: ${isCurrentBook ? 'white' : 'var(--text-main)'};
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: ${isCurrentBook ? '800' : '600'};
          cursor: pointer;
          transition: all 0.2s ease;
        `;

        bookBtn.addEventListener("click", () => {
          const existingChPanel = this.playerListPanel.querySelector(".plist-chapter-panel");
          if (existingChPanel) existingChPanel.remove();

          const chPanel = document.createElement("div");
          chPanel.className = "plist-chapter-panel";
          chPanel.style.cssText = "margin-top: 1rem; padding-top: 1rem; border-top: 1px dashed var(--border-color); animation: fadeIn 0.3s ease;";

          const chTitle = document.createElement("div");
          chTitle.textContent = `${b.name} (총 ${b.chapters}장)`;
          chTitle.style.cssText = "font-family: var(--font-sans); font-size: 0.95rem; font-weight: 800; color: var(--primary-color); margin-bottom: 0.8rem; text-align: center;";
          chPanel.appendChild(chTitle);

          const chGrid = document.createElement("div");
          chGrid.style.cssText = "display: grid; grid-template-columns: repeat(auto-fill, minmax(45px, 1fr)); gap: 0.4rem;";

          for (let i = 1; i <= b.chapters; i++) {
            const chBtn = document.createElement("button");
            chBtn.type = "button";
            chBtn.textContent = `${i}장`;
            
            chBtn.style.cssText = `
              padding: 0.4rem 0;
              border-radius: 6px;
              border: 1px solid var(--border-color);
              background: var(--card-bg);
              color: var(--text-main);
              font-family: var(--font-sans);
              font-size: 0.8rem;
              font-weight: 700;
              cursor: pointer;
            `;

            chBtn.addEventListener("click", () => {
              if (window.bibleManager) {
                window.bibleManager.loadBiblePassage(b.id, i);
                if (window.graceBibleApp && typeof window.graceBibleApp.switchTab === "function") {
                  window.graceBibleApp.switchTab("reading");
                }
              }
              this.playerListPanel.classList.remove("active");
            });

            chGrid.appendChild(chBtn);
          }

          chPanel.appendChild(chGrid);
          bookGrid.parentNode.insertBefore(chPanel, bookGrid.nextSibling);
        });

        bookGrid.appendChild(bookBtn);
      });
      listContainer.appendChild(bookGrid);
    });

    this.playerListPanel.appendChild(listContainer);
  }
}
