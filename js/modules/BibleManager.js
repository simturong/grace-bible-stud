
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

    const categories = [
      { id: "OT", label: "구약 (Old Testament)" },
      { id: "NT", label: "신약 (New Testament)" },
    ];

    categories.forEach((cat) => {
      if (filterType === "all" || filterType === cat.id) {
        const testamentDiv = document.createElement("div");
        testamentDiv.className = "testament-section";
        const title = document.createElement("h3");
        title.className = "testament-title";
        title.textContent = cat.label;
        testamentDiv.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "books-grid";

        const booksInCat = window.bibleBooks.filter((b) => b.testament === cat.id);
        booksInCat.forEach((book) => {
          const btn = document.createElement("button");
          btn.className = "book-btn";
          btn.innerHTML = `<span class="abbr">${book.abbr}</span><span class="full">${book.name}</span>`;
          
          const drawer = document.createElement("div");
          drawer.className = "chapters-drawer";
          const maxCh = book.chaptersCount || book.totalChapters || 1;
          for (let ch = 1; ch <= maxCh; ch++) {
            const chBtn = document.createElement("button");
            chBtn.className = "chapter-btn";
            chBtn.textContent = ch;
            chBtn.addEventListener("click", (ev) => {
              ev.stopPropagation();
              this.loadBiblePassage(book.id, ch);
              if (window.uiManager) window.uiManager.switchTab("reading");
            });
            drawer.appendChild(chBtn);
          }

          btn.addEventListener("click", () => {
            const isOpen = drawer.classList.contains("open");
            document.querySelectorAll(".chapters-drawer.open").forEach(d => d.classList.remove("open"));
            if (!isOpen) drawer.classList.add("open");
          });

          const wrapper = document.createElement("div");
          wrapper.className = "book-wrapper";
          wrapper.appendChild(btn);
          wrapper.appendChild(drawer);
          grid.appendChild(wrapper);
        });

        testamentDiv.appendChild(grid);
        this.bibleBooksGridContainer.appendChild(testamentDiv);
      }
    });
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
