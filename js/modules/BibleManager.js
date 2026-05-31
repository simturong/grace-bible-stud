
export class BibleManager {
  constructor() {
    this.currentBookId = 19;
    this.currentChapterNum = 23;
    this.activeVerseNum = null;
    this.currentPassageData = null;
    this.bibleDbData = [];
    
    // DOM Elements
    this.bibleBooksGridContainer = document.getElementById("bibleBooksGridContainer");
    this.passageTitle = document.getElementById("passageTitle");
    this.passageReference = document.getElementById("passageReference");
    this.passageContent = document.getElementById("passageContent");
    this.explorerFilters = document.querySelectorAll(".explorer-filter-btn");
  }

  async init() {
    this.bindEvents();
    await this.loadBibleDatabase();
    this.render66BooksGrid("all");
    this.loadBiblePassage(this.currentBookId, this.currentChapterNum);
  }

  bindEvents() {
    if (this.explorerFilters) {
      this.explorerFilters.forEach((btn) => {
        btn.addEventListener("click", () => {
          this.explorerFilters.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.render66BooksGrid(btn.getAttribute("data-filter"));
        });
      });
    }
  }

  async loadBibleDatabase() {
    try {
      const response = await fetch("bible_db.json");
      if (response.ok) {
        this.bibleDbData = await response.json();
        this.cacheIndexMetadata();
      }
    } catch (err) {
      console.warn("Failed to load bible_db.json, falling back to mock data", err);
    }
  }

  cacheIndexMetadata() {
    if (!window.bibleBooks) return;
    this.bibleDbData.forEach((dbBook) => {
      const bookObj = window.bibleBooks.find((b) => b.id === dbBook.id);
      if (bookObj && dbBook.totalChapters) {
        bookObj.chaptersCount = dbBook.totalChapters;
      }
    });
  }

  render66BooksGrid(filterType) {
    if (!this.bibleBooksGridContainer || !window.bibleBooks) return;

    this.bibleBooksGridContainer.innerHTML = "";

    // Subcategories definitions to structure the grid layout beautifully
    const categoriesMap = {
      OT: ["모세오경", "역사서", "시가서", "대예언서", "소예언서"],
      NT: ["복음서", "역사서", "바울서신", "일반서신", "예언서"],
    };

    const renderTestament = (testamentCode, titleText) => {
      const testamentDiv = document.createElement("div");
      testamentDiv.className = "testament-group";

      const h3 = document.createElement("h3");
      h3.className = "testament-group-title";
      h3.textContent = titleText;
      testamentDiv.appendChild(h3);

      const subCats = categoriesMap[testamentCode];
      let hasBooksInGroup = false;

      subCats.forEach((catName) => {
        const booksInCat = window.bibleBooks.filter(
          (b) => b.testament === testamentCode && b.category === catName,
        );
        if (booksInCat.length === 0) return;

        hasBooksInGroup = true;

        const catSection = document.createElement("div");
        catSection.className = "bible-category-section";

        const catTitle = document.createElement("div");
        catTitle.className = "bible-category-title";
        catTitle.textContent = catName;
        catSection.appendChild(catTitle);

        const grid = document.createElement("div");
        grid.className = "bible-books-grid";

        booksInCat.forEach((book) => {
          const container = document.createElement("div");
          container.className = `book-item-container ${book.id === this.currentBookId ? "active-container" : ""}`;
          container.setAttribute("data-book-id", book.id);

          const card = document.createElement("button");
          card.type = "button";
          card.className = `btn-book-card ${book.id === this.currentBookId ? "active-book" : ""}`;
          card.setAttribute("aria-label", `${book.name} 선택`);

          const abbr = document.createElement("span");
          abbr.className = "book-abbr";
          abbr.textContent = book.name; // 정식 명칭 사용 (예: 마태복음)

          const fullName = document.createElement("span");
          fullName.className = "book-full-name";
          fullName.textContent = ""; // 영어는 표시하지 않음
          fullName.style.display = "none";

          card.appendChild(abbr);
          card.appendChild(fullName);

          // Accordion panel creation (initially empty for dynamic building on demand!)
          const accordion = document.createElement("div");
          accordion.className = "chapters-accordion";
          accordion.style.maxHeight = "0px";

          // Toggle accordion open/close on book card click
          card.addEventListener("click", (e) => {
            e.stopPropagation();

            const isOpen = container.classList.contains("open");

            // Close all other accordions first
            const allContainers = this.bibleBooksGridContainer.querySelectorAll(
              ".book-item-container",
            );
            allContainers.forEach((c) => {
              c.classList.remove("open");
              const acc = c.querySelector(".chapters-accordion");
              if (acc) {
                acc.style.maxHeight = "0px";
                acc.style.padding = "0";
                acc.style.borderWidth = "0";
                acc.style.marginTop = "0";
                acc.innerHTML = ""; // Re-empty to minimize DOM nodes
              }
            });

            if (!isOpen) {
              container.classList.add("open");

              // Dynamically build the chapter buttons accordion
              accordion.innerHTML = "";

              // Accordion title showing total chapters
              const title = document.createElement("div");
              title.className = "accordion-title-text";
              const totalCh = book.chaptersCount || book.totalChapters || 1;
              title.textContent = `🍀 ${book.name} — 총 ${totalCh}장`;
              accordion.appendChild(title);

              // Grid for chapter buttons
              const chaptersGrid = document.createElement("div");
              chaptersGrid.className = "chapters-grid";

              // Create chapter buttons
              for (let ch = 1; ch <= totalCh; ch++) {
                const chBtn = document.createElement("button");
                chBtn.type = "button";
                chBtn.className = "btn-chapter";
                chBtn.textContent = `${ch}장`;

                // Highlight active chapter
                if (book.id === this.currentBookId && ch === this.currentChapterNum) {
                  chBtn.style.borderColor = "var(--primary-color)";
                  chBtn.style.color = "#FFFFFF";
                  chBtn.style.background = "var(--primary-color)";
                } else if (book.keyChapter && ch === book.keyChapter) {
                  chBtn.innerHTML = `⭐ ${ch}장`;
                  chBtn.title = "주요 말씀 장";
                  chBtn.style.borderColor = "var(--primary-color)";
                  chBtn.style.color = "var(--primary-color)";
                }

                chBtn.addEventListener("click", (ev) => {
                  ev.stopPropagation(); // Avoid triggering container clicks

                  // Load the selected chapter passage
                  this.loadBiblePassage(book.id, ch);
                  if (window.uiManager) window.uiManager.switchTab("reading");

                  // Highlight animation pulse
                  const headerEl = document.querySelector(".passage-header");
                  if (headerEl) {
                    headerEl.style.animation = "none";
                    setTimeout(() => {
                      headerEl.style.animation =
                        "highlightPulse 1.5s ease-in-out";
                    }, 50);
                  }

                  // Update active container and card borders across the grid
                  const allContainers2 =
                    this.bibleBooksGridContainer.querySelectorAll(
                      ".book-item-container",
                    );
                  allContainers2.forEach((c2) => {
                    c2.classList.remove("active-container");
                    const btn = c2.querySelector(".btn-book-card");
                    if (btn) btn.classList.remove("active-book");
                  });
                  container.classList.add("active-container");
                  card.classList.add("active-book");

                  // Trigger resizeCanvas to adjust canvas calligraphy size dynamically
                  if (typeof window.resizeCanvas === "function") {
                    window.resizeCanvas();
                  }
                });

                chaptersGrid.appendChild(chBtn);
              }

              accordion.appendChild(chaptersGrid);

              // Open this accordion visually
              accordion.style.maxHeight = "300px";
              accordion.style.padding = "1rem";
              accordion.style.borderWidth = "1px";
              accordion.style.marginTop = "0.5rem";
              accordion.style.borderColor = "var(--border-color)";

              // Scroll element smoothly into view
              setTimeout(() => {
                container.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                });
              }, 100);
            }
          });

          container.appendChild(card);
          container.appendChild(accordion);
          grid.appendChild(container);
        });

        catSection.appendChild(grid);
        testamentDiv.appendChild(catSection);
      });

      if (hasBooksInGroup) {
        this.bibleBooksGridContainer.appendChild(testamentDiv);
      }
    };

    if (filterType === "all" || filterType === "ot") {
      renderTestament("OT", "📖 구약성경 (Old Testament)");
    }
    if (filterType === "all" || filterType === "nt") {
      renderTestament("NT", "🕊️ 신약성경 (New Testament)");
    }
  }

  loadBiblePassage(bookId, chapterNum = 1) {
    if (!window.bibleBooks) return;
    const book = window.bibleBooks.find((b) => b.id === bookId);
    if (!book) return;

    this.currentBookId = bookId;
    this.currentChapterNum = chapterNum;

    const dbBook = this.bibleDbData.find((b) => b.id === bookId);
    const dbChapterVerses = dbBook && dbBook.chapters && dbBook.chapters[String(chapterNum)];

    if (dbChapterVerses) {
      const mappedVerses = dbChapterVerses.map((v) => ({
        num: v.num || v.verse,
        text: v.rev,
        text_hangul: v.hangul || v.rev,
      }));
      this.currentPassageData = {
        bookId, chapterNum, verses: mappedVerses, isMock: false
      };
    } else {
      this.currentPassageData = {
        bookId, chapterNum, verses: book.verses, isMock: true
      };
    }

    this.renderBiblePassage();
    
    // Update global for TTS
    if (!window.graceBibleApp) window.graceBibleApp = {};
    window.graceBibleApp.getCurrentPassageVerses = () => this.currentPassageData.verses;
    window.graceBibleApp.getCurrentBookId = () => this.currentBookId;
    window.graceBibleApp.getCurrentChapterNum = () => this.currentChapterNum;
    window.graceBibleApp.bibleBooks = window.bibleBooks;

    if (window.uiManager) {
      window.graceBibleApp.updatePlayerUI(`${book.name} ${chapterNum}장`);
    }
  }

  
  updateTranscriptionCopyGuide(text, bookName, verseNum) {
    if (!this.transcriptionGuideText) {
      this.transcriptionGuideText = document.getElementById("transcriptionGuideText");
    }
    if (this.transcriptionGuideText) {
      this.transcriptionGuideText.textContent = `"${text}" (${bookName} ${verseNum}절)`;
    }
  }


  renderBiblePassage() {
    if (!this.passageTitle || !this.passageContent || !this.currentPassageData) return;
    const book = window.bibleBooks.find(b => b.id === this.currentPassageData.bookId);
    
    this.passageTitle.textContent = `${book.name} ${this.currentPassageData.chapterNum}장`;
    this.passageReference.textContent = "개역개정";
    
    this.passageContent.innerHTML = "";
    
    this.currentPassageData.verses.forEach(v => {
      const p = document.createElement("p");
      p.className = "verse";
      p.setAttribute("data-verse", v.num);
      
      const numSpan = document.createElement("span");
      numSpan.className = "verse-num";
      numSpan.textContent = v.num;
      
      const micIcon = document.createElement("span");
      micIcon.className = "material-icons verse-audio-btn";
      micIcon.textContent = "mic";
      micIcon.style.cursor = "pointer";
      micIcon.addEventListener("click", () => {
        if (window.bibleTTS && typeof window.bibleTTS.playVerse === "function") {
          window.bibleTTS.playVerse(p);
        }
      });
      
      const textSpan = document.createElement("span");
      textSpan.className = "verse-text";
      textSpan.textContent = v.text || v.text_hangul;
      
      p.appendChild(numSpan);
      p.appendChild(micIcon);
      p.appendChild(textSpan);
      
      p.addEventListener("click", () => {
        this.updateTranscriptionCopyGuide(v.text || v.text_hangul, book.name, v.num);
        document.querySelectorAll(".verse.active-highlight").forEach(el => el.classList.remove("active-highlight"));
        p.classList.add("active-highlight");
      });
      
      this.passageContent.appendChild(p);
    });

    if (this.currentPassageData.verses.length > 0) {
      const firstVerse = this.currentPassageData.verses[0];
      this.updateTranscriptionCopyGuide(firstVerse.text || firstVerse.text_hangul, book.name, firstVerse.num);
    }
  }
}
