
export class UIManager {
  constructor() {
    this.tabs = document.querySelectorAll(".tab-button");
    this.sections = document.querySelectorAll("main > section");
    this.fontButtons = document.querySelectorAll(".font-size-btn");
    this.themeToggle = document.getElementById("themeToggle");
  }

  init() {
    this.bindEvents();
    this.loadPersistedUIStates();
  }

  bindEvents() {
    this.tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.switchTab(btn.dataset.tab);
      });
    });

    this.fontButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.setFontSize(btn.getAttribute("data-size"));
      });
    });

    if (this.themeToggle) {
      this.themeToggle.addEventListener("click", () => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        this.setTheme(isDark ? "light" : "dark");
      });
    }
  }

  switchTab(tabName) {
    this.tabs.forEach((btn) => {
      if (btn.dataset.tab === tabName) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    this.sections.forEach((sec) => {
      if (sec.id === tabName + "Section" || sec.id === tabName) {
        sec.style.display = "block";
      } else {
        sec.style.display = "none";
      }
    });

    localStorage.setItem("grace-bible-active-tab", tabName);
    
    // Dispatch event for other managers
    document.dispatchEvent(new CustomEvent('tabChanged', { detail: { tabName } }));
  }

  setFontSize(size) {
    document.documentElement.classList.remove("font-size-small", "font-size-medium", "font-size-large");
    document.documentElement.classList.add(`font-size-${size}`);

    this.fontButtons.forEach((btn) => {
      if (btn.getAttribute("data-size") === size) btn.classList.add("active");
      else btn.classList.remove("active");
    });

    localStorage.setItem("grace-bible-font-size", size);
  }

  setTheme(themeName) {
    document.documentElement.setAttribute("data-theme", themeName);
    if (this.themeToggle) {
      this.themeToggle.textContent = themeName === "dark" ? "☀️" : "🌙";
    }
    localStorage.setItem("grace-bible-theme", themeName);
  }

  loadPersistedUIStates() {
    const savedTab = localStorage.getItem("grace-bible-active-tab") || "home";
    this.switchTab(savedTab);

    const savedFontSize = localStorage.getItem("grace-bible-font-size") || "medium";
    this.setFontSize(savedFontSize);

    const savedTheme = localStorage.getItem("grace-bible-theme");
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? "dark" : "light");
    }
  }
}

