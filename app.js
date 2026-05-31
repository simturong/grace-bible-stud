

/**
 * E:/Tak/Gemini/grace-bible-study/app.js
 *
 * Core state management, 66-book grid binding, 365-day meditation database,
 * font scaling persistence, and tab navigation routing for the Grace Bible Study Web App.
 */

(function () {
  // --- 1. State Keys for LocalStorage ---
  const FONT_SIZE_KEY = "grace-bible-font-size";
  const REFLECTION_KEY = "grace-bible-reflection";
  const CURRENT_BOOK_KEY = "grace-bible-current-book-id";
  const CURRENT_CHAPTER_KEY = "grace-bible-current-chapter-num";
  const ACTIVE_VERSE_KEY = "grace-bible-active-verse-num";
  const MEDITATION_DAY_KEY = "grace-bible-meditation-day";
  const THEME_KEY = "grace-bible-theme";

  // --- 2. 66-Book Metadata & Key Verses Database ---
  
  // bibleBooks has been moved to js/data/bibleBooks.js

  // --- 3. 365-Day Daily Meditation Database (Rotating Presets) ---
  const meditationDb = [
    {
      day: 1,
      title: "여호와는 나의 목자시니",
      passage: "시편 23편 1절",
      quote: "여호와는 나의 목자시니 내게 부족함이 없으리로다",
      quote_hangul: "여호와는 나의 목자시니 내가 부족함이 없으리로다",
      content:
        "우리의 인생 여정 속에서 부족함을 느낄 때가 참 많습니다. 물질, 건강, 관계 등 늘 무언가가 결핍되어 있다고 불안해하곤 합니다. 그러나 전능하시고 우주 만물을 창조하신 여호와께서 친히 우리의 목자가 되어주신다면, 우리는 결코 덜 결핍하지 않으며 가장 완전한 평강과 풍요를 누릴 수 있습니다. 그분은 우리를 돌보시고 인도하시는 가장 좋으신 분이십니다. 주님의 은혜로운 돌보심을 신뢰하며 만족과 평안이 넘쳐나는 복된 하루를 보내시기를 간절히 소망합니다.",
      prayer:
        "사랑과 자비의 주님, 고단하고 어지러운 세상살이 속에서 나의 삶을 친히 눈동자와 같이 지키시고 돌보아 주시는 진정한 목자가 되어 주심에 깊은 감사를 드립니다. 오늘도 나의 연약함과 고난을 주님께 맡겨드리오니 부족함 없는 든든한 주님의 그 사랑의 울타리 안에 거하며 주님만 굳건하게 따르는 순종의 자녀가 되게 하옵소서. 예수 그리스도의 이름으로 감사하며 기도드리옵나이다. 아멘. 🙏",
    },
    {
      day: 2,
      title: "태초에 하나님이",
      passage: "창세기 1장 1절",
      quote: "태초에 하나님이 천지를 창조하시니라",
      quote_hangul: "태초에 하나님이 천지를 창조하시니라",
      content:
        "온 우주의 시작은 하나님의 질서와 창조로부터 시작되었습니다. 우리가 발을 딛고 살아가는 하늘과 땅, 산과 바다, 그리고 거친 바람마저도 하나님의 아름답고 위대한 솜씨와 주권 안에 머물러 있습니다. 이 위대한 창조주 하나님이 오늘 나라는 귀한 존재를 빚으시고 온전히 아끼시며 영원토록 변함없이 사랑하십니다. 오늘도 그 위대하신 하나님의 거룩한 계획과 주권 속에 내 삶이 안전하게 들려 있음을 확신하며 은혜와 감사함으로 기쁨 가득한 하루를 걸어가시길 바랍니다.",
      prayer:
        "창조주 여호와 하나님 아버지, 모든 우주 만물의 주인이 되시며 이 세상 유일한 진리이신 아버지를 찬양합니다. 나의 호흡과 작은 세포 하나까지 아시고 지으신 그 손길을 찬양하오니, 창조주 하나님 아버지의 위대한 사랑 and 선하신 인도하심을 오늘도 온전히 믿고 순종하게 하소서. 어떠한 흔들림 속에서도 굳건하게 주님의 동행을 누리게 하옵소서. 예수님의 이름으로 간절히 기도합니다. 아멘.",
    },
    {
      day: 3,
      title: "항상 기뻐하며 쉬지 말고 기도하라",
      passage: "데살로니가전서 5장 16-18절",
      quote: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라",
      quote_hangul: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라",
      content:
        "성경은 우리에게 상황이 좋아질 때에만 웃거나 풍족할 때에만 감사하라고 말하지 않습니다. 도리어 어떠한 형편에 처하든지 '항상 기뻐하고', '쉬지 말고 기도하며', '모든 일에 감사하라'고 명령하십니다. 이것은 불가능해 보이지만 우리 구주 예수 그리스도의 십자가 은혜 안에 서 있을 때 성령의 능력으로 비로소 가능하게 되는 참된 신앙의 기적입니다. 환경을 뛰어넘어 우리를 안전하게 붙들고 계신 하나님의 더 깊은 사랑과 선하신 인도하심을 소망할 때, 우리는 오늘도 깊은 평강을 맛보게 될 것입니다.",
      prayer:
        "신실하신 주님, 환난이나 곤고 속에서도 항상 기뻐하며, 늘 기도의 끈을 놓지 않고, 매사에 감사할 수 있는 거룩하고 성령 충만한 마음을 주옵소서. 내 생각과 눈앞의 형편만 보면 근심과 염려가 가득하지만, 나의 모든 상처와 연약함을 아시고 만사를 협력하여 선으로 이루시는 주님만 바라보게 하소서. 오늘도 감사가 흘러 넘치기를 원하오며 예수님의 이름으로 기도합니다. 아멘.",
    },
    {
      day: 4,
      title: "강하고 담대하라 두려워 말라",
      passage: "여호수아 1장 9절",
      quote:
        "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라",
      quote_hangul:
        "내가 네게 명한 것이 아니냐 마음을 강하게 하고 담대히 하라 두려워하지 말며 놀라지 말라",
      content:
        "미지의 길을 떠나거나 감당하기 벅찬 커다란 산 앞에 설 때 우리 마음에는 두려움과 낙심이 파도처럼 밀려옵니다. 그러나 주님께서는 두려워하는 여호수아에게, 또한 오늘을 외롭고 무겁게 살아가는 우리에게 단호하게 말씀하십니다. '강하고 담대하라 두려워 말며 놀라지 말라!' 이 놀라운 약속의 근거는 우리의 능력이나 재물에 있는 것이 아닙니다. 바로 온 세상을 창조하신 전능하신 하나님께서 우리가 딛는 모든 곳마다 영원토록 친히 함께 동행해 주시겠다고 하신 그 신실하신 약속에 있습니다. 두려움을 물리치고 주님의 든든한 동행을 누리는 담대한 날이 되길 소망합니다.",
      prayer:
        "언제나 나와 함께하시는 임마누엘의 주님, 삶의 무거운 짐과 예기치 못한 시련 속에서 마음에 자꾸만 들어오는 두려움과 불신앙을 주님의 거룩한 말씀의 능력으로 물리쳐 주옵소서. '강하고 담대하라' 하셨사오니 주님의 손을 꼭 잡고 두려움을 떨쳐 일어나게 하소서. 주께서 앞서 일하시며 나를 가장 안전하게 안위해 주실 줄 믿고 감사드리오며, 예수 그리스도의 이름으로 기도합니다. 아멘.",
    },
    {
      day: 5,
      title: "하나님이 세상을 이처럼 사랑하사",
      passage: "요한복음 3장 16절",
      quote:
        "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라",
      quote_hangul:
        "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 저를 믿는 자마다 멸망치 않고 영생을 얻게 하려 하심이니라",
      content:
        "세상에는 조건부 사랑이 참 많습니다. 업적이나 외모, 무언가 쓸모가 있어야 인정을 받고 대우를 받곤 합니다. 하지만 우리 하나님 아버지는 우리를 사랑하시되 조건 없이 그분의 하나뿐인 독생자 예수 그리스도의 생명을 온전히 내어주시기까지 우리를 가치 있고 보배롭게 여기시며 뜨겁게 사랑하셨습니다. 십자가에 아낌없이 새겨진 그 영원하고 절대적인 하늘의 사랑을 통해 우리는 죽음에서 생명으로 영원의 복된 자녀가 되는 권세를 거저 선물로 받았습니다. 오늘 하루도 그 넓고 깊으신 주님의 십자가 사랑을 묵상하며 무한한 행복과 은혜를 마음껏 만끽하시길 바랍니다.",
      prayer:
        "나를 살리시려 하나뿐인 생명마저 십자가에 내어주신 귀하신 주님, 주님의 보혈의 공로와 측량할 수 없는 큰 사랑에 눈물로 감사를 드립니다. 그 어떤 것도 나를 주님의 놀라우신 사랑에서 끊을 수 없음을 믿습니다. 죽어 마땅한 죄인을 구원하여 영원한 생명을 소유한 주님의 친백성 되게 하셨사오니, 그 은혜와 기쁨을 마음에 가득 채워 찬양과 감사로 화답하는 사랑의 삶을 살게 하소서. 예수님의 이름으로 기도하옵나이다. 아멘.",
    },
  ];

  // --- 4. Client State Variables ---
  let currentBookId = 19; // Default: Psalms (시편 - index id: 19)
  let currentChapterNum = 23; // Default chapter: 23
  let activeVerseNum = null;
  let currentMeditationDay = 1;
  const currentTranslation = "revised"; // 개역개정 4판 단일 고정
  let currentPassageData = null; // Caches the current loaded passage (real or mock)
  let bibleDbData = []; // Cache loaded static JSON database

  // --- 5. DOM Element References ---
  let body, fontButtons, themeSelect;
  let tabButtons, tabContents;
  let passageTitle, passageReference, passageContent;
  let reflectionTextarea, btnSaveReflection;
  let btnClearCanvas, btnSubmitDrawing;
  let meditationQuote,
    meditationQuoteRef,
    meditationContent,
    meditationPrayer,
    meditationDayLabel;
  let btnPrevMeditation, btnNextMeditation;
  let transcriptionGuideText, transcriptionTypingInput, typingFeedback;
  let bibleBooksGridContainer, explorerFilters;

  // Translation Switch Buttons
  let btnReadingRevised,
    btnReadingHangul,
    btnMeditationRevised,
    btnMeditationHangul;

  // Floating Player Elements
  let floatingPlayerBar, playerBookTag, playerVerseIndicator, playerVerseText;
  let btnPlayerPlayToggle, btnPlayerNext, btnPlayerPrev;
  let playerProgressBar, playerProgressContainer;
  let btnVoiceSetting, voiceDropdown, voiceSelect, voiceRate, rateVal;
  let btnPlayerList, playerListPanel;

  // Asynchronous bible_db.json loader
  function loadBibleDatabase() {
    const isNode =
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node;
    if (typeof fetch === "function" && !isNode) {
      return fetch("bible_db.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          bibleDbData = data;
          cacheIndexMetadata();
        })
        .catch((err) => {
          console.error("Failed to load bible_db.json via fetch:", err);
          tryLocalLoad();
        });
    } else {
      tryLocalLoad();
      return Promise.resolve();
    }
  }

  function tryLocalLoad() {
    try {
      const fs = require("fs");
      const path = require("path");
      const dbPath = path.join(__dirname, "bible_db.json");
      if (fs.existsSync(dbPath)) {
        const data = JSON.parse(fs.readFileSync(dbPath, "utf8"));
        bibleDbData = data;
        cacheIndexMetadata();
      }
    } catch (e) {
      // Safe silent fail under node test environment
    }
  }

  function cacheIndexMetadata() {
    bibleDbData.forEach((dbBook) => {
      const bookObj = bibleBooks.find((b) => b.id === dbBook.id);
      if (bookObj) {
        if (dbBook.totalChapters) {
          bookObj.chaptersCount = dbBook.totalChapters;
        }
      }
    });
  }

  // ==========================================================================
  // ⛪ 의정부중앙교회 실시간 주간 주보 크롤링 및 줌/팬 모달 확대 뷰어 비즈니스 로직
  // ==========================================================================
  let jubboZoomLevel = 100; // %
  let isJubboDragging = false;
  let jubboStartX, jubboStartY, jubboScrollLeft, jubboScrollTop;

  // 실시간 최신 주보 로드, Canvas 동적 이분할(Crop) 및 순서 재배치 연동 함수
  function loadLatestJubbo() {
    const elDateLabel = document.getElementById("jubboDateLabel");
    const elLoader = document.getElementById("jubboLoader");
    const elError = document.getElementById("jubboError");
    const elVerticalList = document.getElementById("jubboVerticalList");
     // 지난주 가로 스크롤 리스트
    const elScrollTip = document.getElementById("jubboScrollTip");
    const fileInput = document.getElementById("jubboFileInput");
    const btnResetCache = document.getElementById("btnResetJubboCache");

    // ⛪ 주보 주차별 탭 선택 바인딩 (가로 100% 묶음 스냅 스크롤 전환 구현)
    const btnPrevWeek = document.getElementById("btnJubboPrev"); // ◀ 지난주
    const btnThisWeek = document.getElementById("btnJubboNext"); // 이번 주 ▶
    const jubboViewport = document.getElementById("jubboViewport");

    if (!elLoader || !elVerticalList || !jubboViewport)
      return;

    // 초기 뷰포트 상태 리셋 및 버튼 동기화
    jubboViewport.scrollLeft = 0;
    setTimeout(() => {
      updateNavButtons(false);
    }, 100);

    // 네비게이션 버튼 활성화 유틸리티
    function updateNavButtons(isPrevWeekActive) {
      if (!btnThisWeek || !btnPrevWeek) return;

      if (isPrevWeekActive) {
        // 지난주 활성화
        btnPrevWeek.classList.add("active");
        btnPrevWeek.style.backgroundColor = "var(--primary-color)";
        btnPrevWeek.style.color = "white";
        btnPrevWeek.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";

        btnThisWeek.classList.remove("active");
        btnThisWeek.style.backgroundColor = "transparent";
        btnThisWeek.style.color = "var(--text-muted)";
        btnThisWeek.style.boxShadow = "none";

        const prevWeekTitle =
          elDateLabel.getAttribute("data-prev-week-title") || "지난주 주보";
        elDateLabel.textContent = prevWeekTitle;
      } else {
        // 이번주 활성화
        btnThisWeek.classList.add("active");
        btnThisWeek.style.backgroundColor = "var(--primary-color)";
        btnThisWeek.style.color = "white";
        btnThisWeek.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";

        btnPrevWeek.classList.remove("active");
        btnPrevWeek.style.backgroundColor = "transparent";
        btnPrevWeek.style.color = "var(--text-muted)";
        btnPrevWeek.style.boxShadow = "none";

        const thisWeekTitle =
          elDateLabel.getAttribute("data-this-week-title") || "이번 주 주보";
        elDateLabel.textContent = thisWeekTitle;
      }
    }

    if (btnThisWeek && btnPrevWeek) {
      // ◀ 지난주 버튼 클릭: viewport를 오른쪽(지난주 슬라이드)으로 스크롤
      btnPrevWeek.onclick = () => {
        jubboViewport.scrollTo({
          left: jubboViewport.clientWidth,
          behavior: "smooth",
        });
        updateNavButtons(true);
      };

      // 이번 주 ▶ 버튼 클릭: viewport를 왼쪽(이번주 슬라이드)으로 스크롤
      btnThisWeek.onclick = () => {
        jubboViewport.scrollTo({
          left: 0,
          behavior: "smooth",
        });
        updateNavButtons(false);
      };

      // 사용자가 직접 좌우 터치 스와이프를 할 때 버튼 상태와 타이틀 실시간 연동
      let scrollTimeout;
      jubboViewport.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          const width = jubboViewport.clientWidth;
          const scrollLeft = jubboViewport.scrollLeft;
          // 스크롤의 절반 지점을 넘었는지 판단
        }, 100); // 디바운스 최적화
      });
    }

    // 1. LocalStorage 캐시 복원 우선 시도 (CORS 및 오프라인 완전 회피)
    const cachedJubbo = localStorage.getItem("grace-bible-jubbo-cache");
    const cachedDate =
      localStorage.getItem("grace-bible-jubbo-date") || "사용자 등록 주보";

    if (cachedJubbo) {
      try {
        const pages = JSON.parse(cachedJubbo);
        if (pages && pages.length === 8) {
          console.log(
            "[주보 캐시 복원] LocalStorage에서 수동 등록된 주보 데이터를 복원했습니다.",
          );
          renderJubboPages(pages, cachedDate, elVerticalList);
          setTimeout(() => {
            const btnThisWeek = document.getElementById("btnJubboNext");
            if (btnThisWeek) btnThisWeek.click();
          }, 100);
          if (elDateLabel) elDateLabel.setAttribute("data-this-week-title", cachedDate);
          if (btnResetCache) btnResetCache.style.display = "inline-block";
          // 지난주 주보도 함께 비동기 로드
          
          return;
        }
      } catch (e) {
        console.error(
          "[주보 캐시 복원 에러] 캐시 데이터가 유효하지 않아 자동 연동으로 전환합니다.",
          e,
        );
        localStorage.removeItem("grace-bible-jubbo-cache");
        localStorage.removeItem("grace-bible-jubbo-date");
      }
    }

    if (btnResetCache) {
      btnResetCache.style.display = "none";
      btnResetCache.onclick = () => {
        if (
          confirm(
            "저장된 주보 캐시를 삭제하고 실시간 홈페이지 자동 연동 모드로 복원하시겠습니까?",
          )
        ) {
          localStorage.removeItem("grace-bible-jubbo-cache");
          localStorage.removeItem("grace-bible-jubbo-date");
          // loadLatestJubbo(); // Disabled for new module architecture
        }
      };
    }

    // 2. 수동 주보 파일 업로드 리스너 (CORS 영향 없이 100% 동작 보장)
    if (fileInput) {
      fileInput.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length !== 4) {
          alert(
            "⚠️ 주보 이미지 4장(1/2면, 3/4면, 5/6면, 7/8면)을 한꺼번에 마우스로 드래그하거나 다중 선택해서 올려주세요.",
          );
          fileInput.value = "";
          return;
        }

        elLoader.style.display = "flex";
        elVerticalList.style.display = "none";
        elError.style.display = "none";
        if (elScrollTip) elScrollTip.style.display = "none";
        if (elDateLabel) elDateLabel.textContent = "수동 등록 주보 처리 중...";

        // 파일 4개를 이미지 객체로 순차적으로 변환
        const loadPromises = files.map((file) => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => resolve(img);
              img.onerror = () => reject(new Error("이미지 로드 실패"));
              img.src = event.target.result;
            };
            reader.onerror = () => reject(new Error("파일 읽기 실패"));
            reader.readAsDataURL(file);
          });
        });

        Promise.all(loadPromises)
          .then((loadedImages) => {
            const pages = [];
            // Canvas 동적 이분할 실행
            loadedImages.forEach((img) => {
              const halfWidth = img.width / 2;
              const height = img.height;

              // 좌측 면
              const canvasLeft = document.createElement("canvas");
              canvasLeft.width = halfWidth;
              canvasLeft.height = height;
              const ctxLeft = canvasLeft.getContext("2d");
              ctxLeft.drawImage(
                img,
                0,
                0,
                halfWidth,
                height,
                0,
                0,
                halfWidth,
                height,
              );
              pages.push(canvasLeft.toDataURL("image/jpeg", 0.95));

              // 우측 면
              const canvasRight = document.createElement("canvas");
              canvasRight.width = halfWidth;
              canvasRight.height = height;
              const ctxRight = canvasRight.getContext("2d");
              ctxRight.drawImage(
                img,
                halfWidth,
                0,
                halfWidth,
                height,
                0,
                0,
                halfWidth,
                height,
              );
              pages.push(canvasRight.toDataURL("image/jpeg", 0.95));
            });

            // LocalStorage에 8장 쪼개진 이미지 영구 캐시 저장
            const now = new Date();
            const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}. 수동 등록`;
            localStorage.setItem(
              "grace-bible-jubbo-cache",
              JSON.stringify(pages),
            );
            localStorage.setItem("grace-bible-jubbo-date", dateStr);

            // 렌더링
            renderJubboPages(pages, dateStr, elVerticalList);
            if (elDateLabel) elDateLabel.setAttribute("data-this-week-title", dateStr);
            if (btnResetCache) btnResetCache.style.display = "inline-block";
            fileInput.value = "";

            // 지난주 주보도 다시 가동
            
          })
          .catch((err) => {
            alert(
              "주보 이미지 파일 처리 도중 오류가 발생했습니다: " + err.message,
            );
            // loadLatestJubbo(); // Disabled for new module architecture
          });
      };
    }

    const googleImgProxy =
      "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=604800&url=";

    // 3. 날짜 역산 및 2중 자동 롤백 로드 함수 정의
    function tryLoadingJubbo(offsetWeeks) {
      const now = new Date();
      const date = new Date(now);
      const day = now.getDay();

      if (day === 0 && now.getHours() < 5) {
        date.setDate(now.getDate() - 7 - offsetWeeks * 7);
      } else {
        date.setDate(now.getDate() - day - offsetWeeks * 7);
      }

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}${mm}${dd}`;
      const jubboTitle = `${yyyy}.${mm}.${dd}. 주보`;

      console.log(
        `[주보 자동화] YYYYMMDD 조합 시도 (${offsetWeeks + 1}차):`,
        dateStr,
      );

      const urls = [
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보001.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보002.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보003.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보004.jpg`,
      ];

      const imagesLoadPromises = urls.map((url, idx) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = googleImgProxy + encodeURIComponent(url);

          img.onload = () => resolve(img);
          img.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = "anonymous";
            fallbackImg.src =
              "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () =>
              reject(new Error(`Failed to load page ${idx + 1}`));
          };
        });
      });

      Promise.all(imagesLoadPromises)
        .then(async (loadedImages) => {
          const pages = [];
          loadedImages.forEach((img) => {
            const halfWidth = img.width / 2;
            const height = img.height;

            const canvasLeft = document.createElement("canvas");
            canvasLeft.width = halfWidth;
            canvasLeft.height = height;
            const ctxLeft = canvasLeft.getContext("2d");
            ctxLeft.drawImage(
              img,
              0,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasLeft.toDataURL("image/jpeg", 0.95));

            const canvasRight = document.createElement("canvas");
            canvasRight.width = halfWidth;
            canvasRight.height = height;
            const ctxRight = canvasRight.getContext("2d");
            ctxRight.drawImage(
              img,
              halfWidth,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasRight.toDataURL("image/jpeg", 0.95));
          });

          renderJubboPages(
            pages,
            `${yyyy}.${mm}.${dd}. 주보`,
            document.getElementById("jubboVerticalList"),
          );
          console.log(
            "[주보 자동화 완수] 주보 동적 이분할 정렬 완료:",
            dateStr,
          );
        })
        .catch((err) => {
          console.warn(
            `[주보 자동화 경고] ${dateStr} 로딩 실패, 다음 롤백 탐색 시도:`,
            err,
          );
          if (offsetWeeks < 2) {
            tryLoadingJubbo(offsetWeeks + 1);
          } else {
            // 자동 탐색 실패 시 ➔ 4. 로컬 images/jubbo/ 폴더 정적 파일 감지 폴백 시도
            tryLocalFolderJubbo();
          }
        });
    }

    // 4. 로컬 서버 images/jubbo/1.jpg ~ 4.jpg 폴백 (CORS 영향 없음)
    function tryLocalFolderJubbo() {
      console.log(
        "[주보 자동화 폴백] 로컬 images/jubbo/ 경로 파일 다운로드 시도",
      );
      const localUrls = [
        "images/jubbo/1.jpg",
        "images/jubbo/2.jpg",
        "images/jubbo/3.jpg",
        "images/jubbo/4.jpg",
      ];

      const localPromises = localUrls.map((url, idx) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed local page ${idx + 1}`));
          img.src = url;
        });
      });

      Promise.all(localPromises)
        .then((loadedImages) => {
          const pages = [];
          loadedImages.forEach((img) => {
            const halfWidth = img.width / 2;
            const height = img.height;

            const canvasLeft = document.createElement("canvas");
            canvasLeft.width = halfWidth;
            canvasLeft.height = height;
            const ctxLeft = canvasLeft.getContext("2d");
            ctxLeft.drawImage(
              img,
              0,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasLeft.toDataURL("image/jpeg", 0.95));

            const canvasRight = document.createElement("canvas");
            canvasRight.width = halfWidth;
            canvasRight.height = height;
            const ctxRight = canvasRight.getContext("2d");
            ctxRight.drawImage(
              img,
              halfWidth,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasRight.toDataURL("image/jpeg", 0.95));
          });

          renderJubboPages(
            pages,
            "준비된 로컬 주보",
            document.getElementById("jubboVerticalList"),
          );
          console.log("[주보 폴백 완수] 로컬 images/jubbo/ 주보 이분할 완료");
        })
        .catch((err) => {
          console.error(
            "[주보 최종 로드 실패] 모든 네트워크 및 로컬 백업 채널 실패:",
            err,
          );
          elLoader.style.display = "none";
          elVerticalList.style.display = "none";
          if (elScrollTip) elScrollTip.style.display = "none";
          elError.style.display = "block";
          if (elDateLabel) elDateLabel.textContent = "주보 로드 실패";
        });
    }

    // 5. 공통 렌더러 함수
    function renderJubboPages(pages, title, container) {
      const magicSortIndices = [1, 3, 5, 6, 7, 4, 2, 0];
      const sortedPageLabels = [
        "2면",
        "4면",
        "6면",
        "7면",
        "8면",
        "5면",
        "3면",
        "1면",
      ];

      container.innerHTML = "";

      magicSortIndices.forEach((targetIndex, sortedIdx) => {
        const pageDataUrl = pages[targetIndex];
        const pageLabel = sortedPageLabels[sortedIdx];

        const card = document.createElement("div");
        card.className = "jubbo-vertical-card";

        card.innerHTML = `
          <img src="${pageDataUrl}" class="jubbo-full-img" alt="${title} - ${pageLabel}" loading="eager" />
          <div class="jubbo-badge">${pageLabel}</div>
        `;

        card.addEventListener("click", () => {
          openJubboModal(pageDataUrl, title + ` — ${pageLabel}`);
        });

        container.appendChild(card);
      });

      elLoader.style.display = "none";
      elError.style.display = "none";
      // 가로 100% 묶음 스냅 스크롤 전환을 위해 두 리스트 모두 display: flex로 유지
      elVerticalList.style.display = "flex";
      

      if (elScrollTip) elScrollTip.style.display = "block";

        btnPrevWeek && btnPrevWeek.classList.contains("active");
      if (elDateLabel) {
          elDateLabel.textContent = title;
      }
    }

    // ⛪ 지난주 주보 정적 가공 이미지 로딩 (processed와 마찬가지로 초고속 렌더링)
    function loadPrevWeekJubbo() {
      const prevTs = new Date().getTime();
const prevPages = [
  "images/jubbo/prev_processed_1.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_2.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_3.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_4.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_5.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_6.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_7.jpg?t=" + prevTs,
  "images/jubbo/prev_processed_8.jpg?t=" + prevTs,
];

      // 존재 여부 스캔
      const imgTest = new Image();
      imgTest.src = prevPages[0];
      imgTest.onload = () => {
        console.log(
          "[지난주 주보] 가공된 지난주 정적 주보 8장을 성공적으로 로드했습니다.",
        );
        elHorizontalList.innerHTML = "";
        const sortedPageLabels = [
          "2면",
          "4면",
          "6면",
          "7면",
          "8면",
          "5면",
          "3면",
          "1면",
        ];

        prevPages.forEach((pageUrl, idx) => {
          const label = sortedPageLabels[idx];
          const card = document.createElement("div");
          card.className = "jubbo-vertical-card";
          card.innerHTML = `
            <img src="${pageUrl}" class="jubbo-full-img" alt="지난주 주보 - ${label}" loading="eager" />
            <div class="jubbo-badge">${label}</div>
          `;
          card.addEventListener("click", () => {
            openJubboModal(pageUrl, `의정부중앙교회 지난주 주보 — ${label}`);
          });
          elHorizontalList.appendChild(card);
        });

        // 지난주 일요일 날짜 계산 명명
        const now = new Date();
        const day = now.getDay();
        const date = new Date(now);
        date.setDate(now.getDate() - day - 7); // 지난주 일요일
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}. 지난주 주보`;
        if (elDateLabel) elDateLabel.setAttribute("data-prev-week-title", dateStr);
      };

      imgTest.onerror = () => {
        console.log(
          "[지난주 주보 폴백] 가공된 지난주 정적 주보가 존재하지 않아 자동 역산 수집을 우회 동작시킵니다.",
        );
        tryLoadingPrevJubboByDate();
      };
    }

    // 지난주 주보 날짜 역산 및 크롤링 폴백 함수 (자동화 엔진 파일이 없을 때 대비)
    function tryLoadingPrevJubboByDate() {
      const now = new Date();
      const date = new Date(now);
      const day = now.getDay();

      // 지난주 일요일 계산 (이번 주 기준 일요일에서 -7일 추가)
      if (day === 0 && now.getHours() < 5) {
        date.setDate(now.getDate() - 14);
      } else {
        date.setDate(now.getDate() - day - 7);
      }

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}${mm}${dd}`;
      const prevJubboTitle = `${yyyy}.${mm}.${dd}. 지난주 주보`;

      console.log("[지난주 주보 자동화] 지난주 YYYYMMDD 조합 시도:", dateStr);
      if (elDateLabel) elDateLabel.setAttribute("data-prev-week-title", prevJubboTitle);

      const urls = [
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보001.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보002.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보003.jpg`,
        `https://www.god4u.or.kr/user/saveDir/board/www50/${dateStr} 주보004.jpg`,
      ];

      const imagesLoadPromises = urls.map((url, idx) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = googleImgProxy + encodeURIComponent(url);
          img.onload = () => resolve(img);
          img.onerror = () => {
            const fallbackImg = new Image();
            fallbackImg.crossOrigin = "anonymous";
            fallbackImg.src =
              "https://api.allorigins.win/raw?url=" + encodeURIComponent(url);
            fallbackImg.onload = () => resolve(fallbackImg);
            fallbackImg.onerror = () =>
              reject(new Error(`Failed to load page ${idx + 1}`));
          };
        });
      });

      Promise.all(imagesLoadPromises)
        .then((loadedImages) => {
          const pages = [];
          loadedImages.forEach((img) => {
            const halfWidth = img.width / 2;
            const height = img.height;

            const canvasLeft = document.createElement("canvas");
            canvasLeft.width = halfWidth;
            canvasLeft.height = height;
            const ctxLeft = canvasLeft.getContext("2d");
            ctxLeft.drawImage(
              img,
              0,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasLeft.toDataURL("image/jpeg", 0.95));

            const canvasRight = document.createElement("canvas");
            canvasRight.width = halfWidth;
            canvasRight.height = height;
            const ctxRight = canvasRight.getContext("2d");
            ctxRight.drawImage(
              img,
              halfWidth,
              0,
              halfWidth,
              height,
              0,
              0,
              halfWidth,
              height,
            );
            pages.push(canvasRight.toDataURL("image/jpeg", 0.95));
          });

          // 지난주 가로 리스트에 그리기
          renderJubboPages(pages, prevJubboTitle, elHorizontalList);
          console.log("[지난주 주보 완수] 주보 동적 이분할 완료:", dateStr);
        })
        .catch((err) => {
          console.error("[지난주 주보 로드 실패] 원격 파일 획득 실패:", err);
          elHorizontalList.innerHTML = `
            <div style="width: 100%; text-align: center; padding: 2rem; color: var(--text-muted); font-family: var(--font-sans); font-weight: 700; font-size: 0.9rem;">
              ⚠️ 지난주 주보 이미지 획득 실패. 자동화 스크립트 빌드본이 배포되지 않았습니다.
            </div>
          `;
        });
    }

    // 6. 자동화 엔진 가공 정적 주보(processed_x.jpg) 로드 시도 (CORS 0%, 0.1초 초고속 렌더링)
    function tryProcessedJubbo() {
      console.log(
        "[주보 로딩] 자동화 빌드 파일(processed_x.jpg) 탐색을 시작합니다.",
      );
      const ts = new Date().getTime();
const processedPages = [
  "images/jubbo/processed_1.jpg?t=" + ts,
  "images/jubbo/processed_2.jpg?t=" + ts,
  "images/jubbo/processed_3.jpg?t=" + ts,
  "images/jubbo/processed_4.jpg?t=" + ts,
  "images/jubbo/processed_5.jpg?t=" + ts,
  "images/jubbo/processed_6.jpg?t=" + ts,
  "images/jubbo/processed_7.jpg?t=" + ts,
  "images/jubbo/processed_8.jpg?t=" + ts,
];

      const imgTest = new Image();
      imgTest.src = processedPages[0];
      imgTest.onload = () => {
        console.log(
          "[주보 로딩 성공] 자동화 프로그램으로 가공된 정적 주보 8장을 성공적으로 로드했습니다.",
        );
        elVerticalList.innerHTML = "";
        const sortedPageLabels = [
          "2면",
          "4면",
          "6면",
          "7면",
          "8면",
          "5면",
          "3면",
          "1면",
        ];

        processedPages.forEach((pageUrl, idx) => {
          const label = sortedPageLabels[idx];
          const card = document.createElement("div");
          card.className = "jubbo-vertical-card";
          card.innerHTML = `
            <img src="${pageUrl}" class="jubbo-full-img" alt="주보 - ${label}" loading="eager" />
            <div class="jubbo-badge">${label}</div>
          `;
          card.addEventListener("click", () => {
            openJubboModal(pageUrl, `의정부중앙교회 주보 — ${label}`);
          });
          elVerticalList.appendChild(card);
        });

        elLoader.style.display = "none";
        elError.style.display = "none";

        elVerticalList.style.display = "flex";
        

        if (elScrollTip) elScrollTip.style.display = "block";

        // 이번 주 일요일 계산 명명
        const now = new Date();
        const day = now.getDay();
        const date = new Date(now);
        if (day === 0 && now.getHours() < 5) {
          date.setDate(now.getDate() - 7);
        } else {
          date.setDate(now.getDate() - day);
        }
        const dateStr = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}. 주보`;
        if (elDateLabel) elDateLabel.setAttribute("data-this-week-title", dateStr);
        if (elDateLabel) elDateLabel.textContent = dateStr;
        // Removed loose brace

        // 지난주 주보도 함께 스크랩 탐색
        
      };

      imgTest.onerror = () => {
        console.log(
          "[주보 로딩 폴백] 자동화 파일이 존재하지 않아 실시간 원격 파싱 모드로 전환합니다.",
        );
        tryLoadingJubbo(0);
         // 지난주도 시도
      };
    }

    // 자동 로딩 개시
    tryProcessedJubbo();
  }

  // 주보 돋보기 확대 뷰어 모달 열기 함수
  function openJubboModal(imgUrl, titleText) {
    const modal = document.getElementById("jubboModal");
    const modalImg = document.getElementById("jubboModalImg");
    const modalContent = document.getElementById("jubboModalContent");

    if (!modal || !modalImg) return;

    modalImg.src = imgUrl;
    modalImg.alt = titleText || "주보 확대 이미지";
    jubboZoomLevel = 100;
    updateJubboZoomUI();

    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");

    // 모달을 띄웠을 때 초기 스크롤 중앙 정렬
    if (modalContent) {
      modalContent.scrollLeft = 0;
      modalContent.scrollTop = 0;
    }
  }

  // 주보 모달 닫기
  function closeJubboModal() {
    const modal = document.getElementById("jubboModal");
    const modalImg = document.getElementById("jubboModalImg");
    if (!modal) return;

    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (modalImg) modalImg.src = "";
  }

  // 배율 변경에 따른 UI 업데이트 함수
  function updateJubboZoomUI() {
    const modalImg = document.getElementById("jubboModalImg");
    const indicator = document.getElementById("jubboZoomIndicator");
    const modalContent = document.getElementById("jubboModalContent");

    if (!modalImg || !indicator) return;

    // CSS transform을 통한 고성능 스무스 줌
    modalImg.style.transform = `scale(${jubboZoomLevel / 100})`;
    indicator.textContent = `${jubboZoomLevel}%`;

    // 100% 이상인 경우에만 grab 마우스 커서 적용 (드래그 가능 신호 제공)
    if (jubboZoomLevel > 100) {
      modalImg.style.cursor = "grab";
      if (modalContent) {
        modalContent.style.overflow = "auto"; // 드래그 시 내비게이션 활성화
      }
    } else {
      modalImg.style.cursor = "default";
      if (modalContent) {
        modalContent.style.overflow = "hidden"; // 100%일 때는 불필요한 스크롤 제거
        modalContent.scrollLeft = 0;
        modalContent.scrollTop = 0;
      }
    }
  }

  // 주보 돋보기 확대 뷰어 모달 조작 및 마우스/터치 팬(Pan) 드래그 바인딩
  function bindJubboModalEvents() {
    const modal = document.getElementById("jubboModal");
    const modalClose = document.getElementById("jubboModalClose");
    const modalContent = document.getElementById("jubboModalContent");
    const modalImg = document.getElementById("jubboModalImg");

    const btnZoomIn = document.getElementById("btnJubboZoomIn");
    const btnZoomOut = document.getElementById("btnJubboZoomOut");
    const btnZoomReset = document.getElementById("btnJubboZoomReset");

    if (!modal) return;

    // 1. 닫기 핸들러
    if (modalClose) {
      modalClose.addEventListener("click", closeJubboModal);
    }
    // 뒷배경 클릭 시 닫기 (이미지 영역 외 클릭 시)
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target === modalContent) {
        closeJubboModal();
      }
    });

    // ESC 키 입력 시 닫기
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeJubboModal();
      }
    });

    // 2. 돋보기 줌 제어 핸들러
    if (btnZoomIn) {
      btnZoomIn.addEventListener("click", () => {
        jubboZoomLevel = Math.min(300, jubboZoomLevel + 50);
        updateJubboZoomUI();
      });
    }
    if (btnZoomOut) {
      btnZoomOut.addEventListener("click", () => {
        jubboZoomLevel = Math.max(100, jubboZoomLevel - 50);
        updateJubboZoomUI();
      });
    }
    if (btnZoomReset) {
      btnZoomReset.addEventListener("click", () => {
        jubboZoomLevel = 100;
        updateJubboZoomUI();
      });
    }

    // 3. 마우스 드래그 팬(Pan) 내비게이션 (PC 브라우저)
    if (modalContent && modalImg) {
      modalContent.addEventListener("mousedown", (e) => {
        if (jubboZoomLevel <= 100) return;
        isJubboDragging = true;
        modalContent.style.cursor = "grabbing";

        jubboStartX = e.pageX - modalContent.offsetLeft;
        jubboStartY = e.pageY - modalContent.offsetTop;
        jubboScrollLeft = modalContent.scrollLeft;
        jubboScrollTop = modalContent.scrollTop;
      });

      modalContent.addEventListener("mousemove", (e) => {
        if (!isJubboDragging) return;
        e.preventDefault();

        const x = e.pageX - modalContent.offsetLeft;
        const y = e.pageY - modalContent.offsetTop;
        const walkX = (x - jubboStartX) * 1.6; // 스무스한 드래그 감도 적용
        const walkY = (y - jubboStartY) * 1.6;

        modalContent.scrollLeft = jubboScrollLeft - walkX;
        modalContent.scrollTop = jubboScrollTop - walkY;
      });

      const stopDrag = () => {
        isJubboDragging = false;
        if (jubboZoomLevel > 100) {
          modalContent.style.cursor = "grab";
        } else {
          modalContent.style.cursor = "default";
        }
      };

      modalContent.addEventListener("mouseup", stopDrag);
      modalContent.addEventListener("mouseleave", stopDrag);

      // 4. 손가락 터치 드래그 팬(Pan) 내비게이션 (모바일/스마트폰 스마트 제어)
      modalContent.addEventListener("touchstart", (e) => {
        if (jubboZoomLevel <= 100) return;
        isJubboDragging = true;
        const touch = e.touches[0];

        jubboStartX = touch.pageX - modalContent.offsetLeft;
        jubboStartY = touch.pageY - modalContent.offsetTop;
        jubboScrollLeft = modalContent.scrollLeft;
        jubboScrollTop = modalContent.scrollTop;
      });

      modalContent.addEventListener(
        "touchmove",
        (e) => {
          if (!isJubboDragging) return;
          // 터치 제어가 가로 세로 내비게이션으로 흘러가도록 기본 스크롤 차단
          e.preventDefault();

          const touch = e.touches[0];
          const x = touch.pageX - modalContent.offsetLeft;
          const y = touch.pageY - modalContent.offsetTop;
          const walkX = (x - jubboStartX) * 1.6;
          const walkY = (y - jubboStartY) * 1.6;

          modalContent.scrollLeft = jubboScrollLeft - walkX;
          modalContent.scrollTop = jubboScrollTop - walkY;
        },
        { passive: false },
      );

      modalContent.addEventListener("touchend", () => {
        isJubboDragging = false;
      });
    }
  }

  // --- 6. Initialization Setup ---
  function init() {
    // Cache DOM Elements
    body = document.body;
    fontButtons = document.querySelectorAll(".btn-font-toggle");
    tabButtons = document.querySelectorAll(".tab-button");
    tabContents = document.querySelectorAll(".tab-content");

    passageTitle = document.getElementById("passageTitle");
    passageReference = document.getElementById("passageReference");
    passageContent = document.getElementById("passageContent");

    reflectionTextarea = document.getElementById("reflectionInput");
    btnSaveReflection = document.getElementById("btnSaveReflection");

    btnClearCanvas = document.getElementById("btnClearCanvas");
    btnSubmitDrawing = document.getElementById("btnSubmitDrawing");

    meditationQuote = document.getElementById("meditationQuote");
    meditationQuoteRef = document.getElementById("meditationQuoteRef");
    meditationContent = document.getElementById("meditationContent");
    meditationPrayer = document.getElementById("meditationPrayer");
    meditationDayLabel = document.getElementById("meditationDayLabel");
    btnPrevMeditation = document.getElementById("btnPrevMeditation");
    btnNextMeditation = document.getElementById("btnNextMeditation");

    transcriptionGuideText = document.getElementById("transcriptionGuideText");
    transcriptionTypingInput = document.getElementById(
      "transcriptionTypingInput",
    );
    typingFeedback = document.getElementById("typingFeedback");
    bibleBooksGridContainer = document.getElementById(
      "bibleBooksGridContainer",
    );
    explorerFilters = document.querySelectorAll(".btn-filter");

    // Cache Translation Toggle Buttons
    btnReadingRevised =
      document.getElementById("btnReadingRevised") ||
      document.querySelector(
        '#readingTranslationSwitcher [data-trans="revised"]',
      );
    btnReadingHangul =
      document.getElementById("btnReadingHangul") ||
      document.querySelector(
        '#readingTranslationSwitcher [data-trans="hangul"]',
      );
    btnMeditationRevised =
      document.getElementById("btnMeditationRevised") ||
      document.querySelector(
        '#meditationTranslationSwitcher [data-trans="revised"]',
      );
    btnMeditationHangul =
      document.getElementById("btnMeditationHangul") ||
      document.querySelector(
        '#meditationTranslationSwitcher [data-trans="hangul"]',
      );

    // Floating player caching
    floatingPlayerBar = document.getElementById("floatingPlayerBar");
    playerBookTag = document.getElementById("playerBookTag");
    playerVerseIndicator = document.getElementById("playerVerseIndicator");
    playerVerseText = document.getElementById("playerVerseText");
    btnPlayerPlayToggle = document.getElementById("btnPlayerPlayToggle");
    btnPlayerNext = document.getElementById("btnPlayerNext");
    btnPlayerPrev = document.getElementById("btnPlayerPrev");
    playerProgressBar = document.getElementById("playerProgressBar");
    playerProgressContainer = document.getElementById(
      "playerProgressContainer",
    );
    btnVoiceSetting = document.getElementById("btnVoiceSetting");
    voiceDropdown = document.getElementById("voiceDropdown");
    voiceSelect = document.getElementById("voiceSelect");
    voiceRate = document.getElementById("voiceRate");
    rateVal = document.getElementById("rateVal");
    btnPlayerList = document.getElementById("btnPlayerList");
    playerListPanel = document.getElementById("playerListPanel");

    // Theme selector
    themeSelect = document.getElementById("themeSelect");
    loadThemeState();

    // Start DB load
    const dbPromise = loadBibleDatabase();

    const finishInit = () => {
      // Load initial states from LocalStorage
      loadPersistedStates();

      // Setup 66-Book grid & Category rendering
      render66BooksGrid("all");

      // Setup daily meditation layout
      loadMeditationData(currentMeditationDay);

      // Bind event listeners
      bindEventListeners();

      // Render active book passage
      loadBiblePassage(currentBookId, currentChapterNum);

      // 의정부중앙교회 실시간 주간 주보 연동 및 모달 이벤트 바인딩
      try {
        bindJubboModalEvents();
        // loadLatestJubbo(); // Disabled for new module architecture
      } catch (err) {
        console.error("Failed to initialize church Jubbo component:", err);
      }

      // Initial check of layout dimensions
      setTimeout(() => {
        if (typeof window.resizeCanvas === "function") {
          window.resizeCanvas();
        }
      }, 200);
    };

    const isNode =
      typeof process !== "undefined" &&
      process.versions &&
      process.versions.node;
    if (isNode) {
      finishInit();
    } else if (dbPromise && typeof dbPromise.then === "function") {
      dbPromise.then(finishInit);
    } else {
      finishInit();
    }
  }

  // --- 7. Event Handler Bindings ---
  function bindEventListeners() {
    // 🎙️ 구글 초고음질 Neural2 TTS 관련 DOM 이벤트 바인딩
    const chkGoogleTts = document.getElementById("useGoogleTts");
    const txtGoogleApiKey = document.getElementById("googleApiKey");
    const containerApiKey = document.getElementById("googleApiKeyContainer");

    if (chkGoogleTts && txtGoogleApiKey && containerApiKey) {
      // 로컬 스토리지 데이터 로드 및 초기 맵핑
      const isGoogleActive =
        localStorage.getItem("grace-bible-use-google-tts") === "true";
      const savedKey = localStorage.getItem("grace-bible-google-api-key") || "";

      chkGoogleTts.checked = isGoogleActive;
      txtGoogleApiKey.value = savedKey;
      containerApiKey.style.display = isGoogleActive ? "block" : "none";

      // 구글 TTS 체크 토글 스위치 리스너
      chkGoogleTts.addEventListener("change", () => {
        const active = chkGoogleTts.checked;
        localStorage.setItem("grace-bible-use-google-tts", active);
        containerApiKey.style.display = active ? "block" : "none";
      });

      // GCP API Key 실시간 비밀 입력 리스너
      txtGoogleApiKey.addEventListener("input", () => {
        localStorage.setItem(
          "grace-bible-google-api-key",
          txtGoogleApiKey.value.trim(),
        );
      });
    }

    // Theme Selector change event listener
    if (themeSelect) {
      themeSelect.addEventListener("change", () => {
        setTheme(themeSelect.value);
      });
    }

    // 1. Font Scaler buttons
    fontButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const size = btn.getAttribute("data-size");
        setFontSize(size);
      });
    });

    // 2. Tab Navigation
    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");
        switchTab(targetTab);
      });
    });

    // 3. Reflection note saving
    if (btnSaveReflection) {
      btnSaveReflection.addEventListener("click", () => {
        const text = reflectionTextarea.value;
        localStorage.setItem(REFLECTION_KEY, text);
        alert("📝 주님의 은혜 가득한 묵상 노트가 안전하게 저장되었습니다!");
      });
    }

    // 4. Meditation navigation
    if (btnPrevMeditation) {
      btnPrevMeditation.addEventListener("click", () => {
        let prevDay = currentMeditationDay - 1;
        if (prevDay < 1) prevDay = 365;
        currentMeditationDay = prevDay;
        localStorage.setItem(MEDITATION_DAY_KEY, currentMeditationDay);
        loadMeditationData(currentMeditationDay);
      });
    }

    if (btnNextMeditation) {
      btnNextMeditation.addEventListener("click", () => {
        let nextDay = currentMeditationDay + 1;
        if (nextDay > 365) nextDay = 1;
        currentMeditationDay = nextDay;
        localStorage.setItem(MEDITATION_DAY_KEY, currentMeditationDay);
        loadMeditationData(currentMeditationDay);
      });
    }

    // Translation switcher button events
    const handleTranslationChange = (newTrans) => {
      setTranslation(newTrans);
    };

    if (btnReadingRevised) {
      btnReadingRevised.addEventListener("click", () =>
        handleTranslationChange("revised"),
      );
    }
    if (btnReadingHangul) {
      btnReadingHangul.addEventListener("click", () =>
        handleTranslationChange("hangul"),
      );
    }
    if (btnMeditationRevised) {
      btnMeditationRevised.addEventListener("click", () =>
        handleTranslationChange("revised"),
      );
    }
    if (btnMeditationHangul) {
      btnMeditationHangul.addEventListener("click", () =>
        handleTranslationChange("hangul"),
      );
    }

    // 5. 66 Book Category Filters
    explorerFilters.forEach((btn) => {
      btn.addEventListener("click", () => {
        explorerFilters.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const filterVal = btn.getAttribute("data-filter");
        render66BooksGrid(filterVal);
      });
    });

    // 6. Floating Player Settings Panel Toggle
    if (btnVoiceSetting) {
      btnVoiceSetting.addEventListener("click", (e) => {
        e.stopPropagation();
        voiceDropdown.classList.toggle("active");
      });
    }

    // Close settings popover when clicking anywhere else
    document.addEventListener("click", () => {
      if (voiceDropdown && voiceDropdown.classList.contains("active")) {
        voiceDropdown.classList.remove("active");
      }
    });

    if (voiceDropdown) {
      voiceDropdown.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    }

    // Rate Slider — 표시값 업데이트
    if (voiceRate && rateVal) {
      voiceRate.addEventListener("input", () => {
        rateVal.textContent = parseFloat(voiceRate.value).toFixed(2) + "x";
      });
      voiceRate.addEventListener("change", () => {
        if (
          window.bibleTTS &&
          typeof window.bibleTTS.updateVoiceParams === "function"
        ) {
          window.bibleTTS.updateVoiceParams();
        }
      });
    }

    // 목소리 유형 변경
    if (voiceSelect) {
      voiceSelect.addEventListener("change", () => {
        const val = voiceSelect.value;
        const defaultRates = { "sister-voice": 0.82, "brother-voice": 0.8 };
        if (defaultRates[val] && voiceRate && rateVal) {
          voiceRate.value = defaultRates[val];
          rateVal.textContent = defaultRates[val].toFixed(2) + "x";
        }
        if (
          window.bibleTTS &&
          typeof window.bibleTTS.handleVoiceTypeChange === "function"
        ) {
          window.bibleTTS.handleVoiceTypeChange();
        }
      });
    }

    // 📋 리스트 버튼 — 성경 목록 패널 토글
    if (btnPlayerList) {
      btnPlayerList.addEventListener("click", (e) => {
        e.stopPropagation();
        // 목소리 드롭다운 닫기
        if (voiceDropdown) voiceDropdown.classList.remove("active");
        if (playerListPanel) {
          const isOpen = playerListPanel.classList.toggle("active");
          if (isOpen) renderPlayerListPanel();
        }
      });
    }

    // 패널 외부 클릭 시 닫기
    document.addEventListener("click", (e) => {
      if (playerListPanel && playerListPanel.classList.contains("active")) {
        if (!playerListPanel.contains(e.target) && e.target !== btnPlayerList) {
          playerListPanel.classList.remove("active");
        }
      }
    });
    if (playerListPanel) {
      playerListPanel.addEventListener("click", (e) => e.stopPropagation());
    }

    // Playback events linked inside bible-tts.js, let's tie them into controls
    if (btnPlayerPlayToggle) {
      btnPlayerPlayToggle.addEventListener("click", () => {
        triggerPlayerPlayToggle();
      });
    }

    if (btnPlayerNext) {
      btnPlayerNext.addEventListener("click", () => {
        triggerPlayerNext();
      });
    }
    if (btnPlayerPrev) {
      btnPlayerPrev.addEventListener("click", () => {
        triggerPlayerPrev();
      });
    }
  }

  // --- 8. Core Layout UI Actions ---
  function setFontSize(size) {
    document.documentElement.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    );
    document.documentElement.classList.add(`font-size-${size}`);

    // Fallback for body in case CSS still targets body
    body.classList.remove(
      "font-size-small",
      "font-size-medium",
      "font-size-large",
    );
    body.classList.add(`font-size-${size}`);

    fontButtons.forEach((btn) => {
      if (btn.getAttribute("data-size") === size) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    localStorage.setItem(FONT_SIZE_KEY, size);
  }

  function switchTab(tabName) {
    // 1. 탭 버튼 활성화 스타일링
    tabButtons.forEach((b) => {
      if (b.getAttribute("data-tab") === tabName) {
        b.classList.add("active");
      } else {
        b.classList.remove("active");
      }
    });

    if (tabName === "home") {
      const btnThisWeek = document.getElementById("btnJubboNext");
      if (btnThisWeek) btnThisWeek.click();
    }

    // 2. 모든 탭 숨기고 선택된 탭만 표시
    tabContents.forEach((c) => {
      if (c.id === tabName + "Tab") {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    if (
      tabName === "transcription" &&
      typeof window.resizeCanvas === "function"
    ) {
      window.resizeCanvas();
    }
  }

  // --- 9. Data Loading & Persistence Actions ---
  function loadPersistedStates() {
    // 1. Font Size
    const savedFontSize = localStorage.getItem(FONT_SIZE_KEY);
    if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
      setFontSize(savedFontSize);
    } else {
      setFontSize("medium");
    }

    // 2. Reflection Note text
    const savedReflection = localStorage.getItem(REFLECTION_KEY);
    if (savedReflection && reflectionTextarea) {
      reflectionTextarea.value = savedReflection;
    }

    // 3. Current Active Bible Book
    const savedBookId = localStorage.getItem(CURRENT_BOOK_KEY);
    if (savedBookId) {
      currentBookId = parseInt(savedBookId, 10);
    }

    // 4. Current Active Bible Chapter
    const savedChapterNum = localStorage.getItem(CURRENT_CHAPTER_KEY);
    if (savedChapterNum) {
      currentChapterNum = parseInt(savedChapterNum, 10);
    } else {
      const bookObj = bibleBooks.find((b) => b.id === currentBookId);
      currentChapterNum =
        currentBookId === 19 ? 23 : bookObj ? bookObj.keyChapter : 1;
    }

    // 5. Daily Meditation Index (Day 1 - 365)
    const savedMeditationDay = localStorage.getItem(MEDITATION_DAY_KEY);
    if (savedMeditationDay) {
      currentMeditationDay = parseInt(savedMeditationDay, 10);
    } else {
      // Calculate current calendar day of the year (1 - 365) as dynamic default rotation!
      const now = new Date();
      const start = new Date(now.getFullYear(), 0, 0);
      const diff = now - start;
      const oneDay = 1000 * 60 * 60 * 24;
      currentMeditationDay = Math.floor(diff / oneDay) || 1;
      // Loop between 1 and 365
      if (currentMeditationDay > 365) currentMeditationDay = 365;
      if (currentMeditationDay < 1) currentMeditationDay = 1;
      localStorage.setItem(MEDITATION_DAY_KEY, currentMeditationDay);
    }

    // 6. Active Verse
    const savedActiveVerse = localStorage.getItem(ACTIVE_VERSE_KEY);
    if (savedActiveVerse) {
      activeVerseNum = parseInt(savedActiveVerse, 10);
    }

    // 7. Current Translation: 개역개정 4판 단일 고정 (번역본 전환 불필요)
    // (currentTranslation은 상수 'revised'로 이미 고정)
  }

  function setTranslation(transName) {
    currentTranslation = transName;
    localStorage.setItem("grace-bible-translation", transName);
    updateTranslationUIState(transName);

    // Refresh bible passage and meditation text with new translation
    loadBiblePassage(currentBookId, currentChapterNum);
    loadMeditationData(currentMeditationDay);
  }

  function updateTranslationUIState(transName) {
    const btnRR =
      document.getElementById("btnReadingRevised") ||
      document.querySelector(
        '#readingTranslationSwitcher [data-trans="revised"]',
      );
    const btnRH =
      document.getElementById("btnReadingHangul") ||
      document.querySelector(
        '#readingTranslationSwitcher [data-trans="hangul"]',
      );
    const btnMR =
      document.getElementById("btnMeditationRevised") ||
      document.querySelector(
        '#meditationTranslationSwitcher [data-trans="revised"]',
      );
    const btnMH =
      document.getElementById("btnMeditationHangul") ||
      document.querySelector(
        '#meditationTranslationSwitcher [data-trans="hangul"]',
      );

    const setActive = (activeBtn, inactiveBtn) => {
      if (activeBtn) {
        activeBtn.classList.add("active");
        activeBtn.style.background = "var(--primary-color)";
        activeBtn.style.color = "#FFFFFF";
      }
      if (inactiveBtn) {
        inactiveBtn.classList.remove("active");
        inactiveBtn.style.background = "transparent";
        inactiveBtn.style.color = "var(--text-muted)";
      }
    };

    if (transName === "revised") {
      setActive(btnRR, btnRH);
      setActive(btnMR, btnMH);
    } else {
      setActive(btnRH, btnRR);
      setActive(btnMH, btnMR);
    }
  }

  // Premium Theme Switcher logic
  function loadThemeState() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    // Default to 'theme-modern-olive' as requested
    const activeTheme = savedTheme || "theme-modern-olive";
    setTheme(activeTheme);
  }

  function setTheme(themeName) {
    if (!body) body = document.body;

    // Remove other theme classes
    body.classList.remove(
      "theme-modern-olive",
      "theme-classic-gold",
      "theme-royal-burgundy",
      "theme-cozy-dark",
    );
    // Add current theme class
    body.classList.add(themeName);

    // Persist configuration state
    localStorage.setItem(THEME_KEY, themeName);

    // Update theme select element if it exists
    if (themeSelect) {
      themeSelect.value = themeName;
    }

    // Dynamically update canvas calligraphy color if canvas exists
    if (typeof window.resizeCanvas === "function") {
      window.resizeCanvas();
    }
  }

  // Mock generation function for Comforting Verses when a custom chapter is explored
  function generateMockPassage(book, chapterNum) {
    if (chapterNum === book.keyChapter) {
      return {
        id: book.id,
        name: book.name,
        ref: book.ref,
        title: book.title,
        verses: book.verses,
      };
    }

    const mockRef = `${book.name} ${chapterNum}장 1-3절`;
    const mockTitle = `그의 나라와 그의 의`;

    const mockVerses = [
      {
        num: 1,
        text: `오늘도 주님의 거룩한 영이 너와 동행하시며 네 발걸음을 가장 선한 길로 인도해 주십니다.`,
        text_hangul: `오늘도 여호와의 신이 너와 동행하시며 네 행할 길을 가장 선한 길로 인도하여 주시느니라.`,
      },
      {
        num: 2,
        text: `너는 마음을 강하게 하고 담대히 하라 두려워하지 말며 놀라지 말라 네 하나님이 함께 하시느니라.`,
        text_hangul: `너는 마음을 강하게 하고 극히 담대히 하라 두려워하지 말며 놀라지 말라 네 여호와가 너와 함께 하느니라.`,
      },
      {
        num: 3,
        text: `내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있으며 주님의 은혜가 내게 가득합니다.`,
        text_hangul: `내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있으며 주의 은혜가 네게 족하도다.`,
      },
    ];

    return {
      id: book.id,
      name: book.name,
      ref: mockRef,
      title: mockTitle,
      verses: mockVerses,
    };
  }

  // Load a specific bible passage (verses list)

  window.graceBibleApp = window.graceBibleApp || {};
  window.graceBibleApp.playNextChapter = function () {
    if (!currentPassageData) return;
    const currentBookId = currentPassageData.bookId;
    const currentChapterNum = currentPassageData.chapterNum;
    const book = bibleBooks.find((b) => b.id === currentBookId);
    if (book && currentChapterNum < book.totalChapters) {
      loadBiblePassage(currentBookId, currentChapterNum + 1);
      setTimeout(() => {
        if (typeof window.bibleTTS.playCloudChapter === "function")
          window.bibleTTS.playCloudChapter();
      }, 1500);
    } else {
      const nextBookIndex =
        bibleBooks.findIndex((b) => b.id === currentBookId) + 1;
      if (nextBookIndex < bibleBooks.length) {
        loadBiblePassage(bibleBooks[nextBookIndex].id, 1);
        setTimeout(() => {
          if (typeof window.bibleTTS.playCloudChapter === "function")
            window.bibleTTS.playCloudChapter();
        }, 1500);
      }
    }
  };

  window.graceBibleApp.playPrevChapter = function () {
    if (!currentPassageData) return;
    const currentBookId = currentPassageData.bookId;
    const currentChapterNum = currentPassageData.chapterNum;
    if (currentChapterNum > 1) {
      loadBiblePassage(currentBookId, currentChapterNum - 1);
      setTimeout(() => {
        if (typeof window.bibleTTS.playCloudChapter === "function")
          window.bibleTTS.playCloudChapter();
      }, 1500);
    } else {
      const prevBookIndex =
        bibleBooks.findIndex((b) => b.id === currentBookId) - 1;
      if (prevBookIndex >= 0) {
        const prevBook = bibleBooks[prevBookIndex];
        loadBiblePassage(prevBook.id, prevBook.totalChapters);
        setTimeout(() => {
          if (typeof window.bibleTTS.playCloudChapter === "function")
            window.bibleTTS.playCloudChapter();
        }, 1500);
      }
    }
  };

  function loadBiblePassage(bookId, chapterNum = null) {
    const book = bibleBooks.find((b) => b.id === bookId);
    if (!book) return;

    currentBookId = bookId;
    localStorage.setItem(CURRENT_BOOK_KEY, currentBookId);

    const activeChapter = chapterNum || book.keyChapter;
    currentChapterNum = activeChapter;
    localStorage.setItem(CURRENT_CHAPTER_KEY, currentChapterNum);

    // Try to load real data from fetched bibleDbData
    const dbBook = bibleDbData.find((b) => b.id === bookId);
    const dbChapterVerses =
      dbBook && dbBook.chapters && dbBook.chapters[String(activeChapter)];

    if (dbChapterVerses) {
      // Map database structure (rev / hangul) to standard app structure (text / text_hangul)
      const mappedVerses = dbChapterVerses.map((v) => ({
        num: v.num,
        text: v.rev,
        text_hangul: v.hangul,
      }));

      const startVerse = mappedVerses[0].num;
      const endVerse = mappedVerses[mappedVerses.length - 1].num;
      const customRef = `${book.name} ${activeChapter}장 ${startVerse}-${endVerse}절`;

      currentPassageData = {
        id: book.id,
        name: book.name,
        ref: customRef,
        title: book.keyChapter === activeChapter ? book.title : "",
        verses: mappedVerses,
      };
    } else {
      // Fallback to mock passage
      currentPassageData = generateMockPassage(book, activeChapter);
    }

    // Update Title & Reference header elements
    if (passageTitle) {
      if (currentPassageData.title) {
        passageTitle.innerHTML = `${currentPassageData.name} <span class="passage-chapter-title">${activeChapter}장 "${currentPassageData.title}"</span>`;
      } else {
        passageTitle.innerHTML = `${currentPassageData.name} <span class="passage-chapter-title">${activeChapter}장</span>`;
      }
    }
    if (passageReference) {
      passageReference.textContent = `${currentPassageData.ref} (개역개정)`;
    }

    // Update Player Info labels
    if (playerBookTag) {
      playerBookTag.textContent = currentPassageData.name;
    }

    // Populate verses HTML dynamically
    if (passageContent) {
      passageContent.innerHTML = "";
      currentPassageData.verses.forEach((v) => {
        const verseDiv = document.createElement("div");
        verseDiv.className = "verse";
        verseDiv.setAttribute("data-verse", v.num);

        const textVal = v.text; // 개역개정 4판 단일
        verseDiv.setAttribute("data-text", textVal);

        // Verse details
        const vNumSpan = document.createElement("span");
        vNumSpan.className = "verse-num";
        vNumSpan.textContent = v.num;

        const vTextSpan = document.createElement("span");
        vTextSpan.className = "verse-text";
        vTextSpan.textContent = textVal;

        const playBtn = document.createElement("button");
        playBtn.type = "button";
        playBtn.className = "btn-play-verse";
        playBtn.setAttribute("aria-label", `${v.num}절 낭독`);
        playBtn.setAttribute("data-verse", v.num);
        playBtn.innerHTML = "🔊";

        verseDiv.appendChild(vNumSpan);
        verseDiv.appendChild(vTextSpan);
        verseDiv.appendChild(playBtn);

        // Clicking a verse selects it, highlights it, and triggers active typography copy!
        verseDiv.addEventListener("click", () => {
          selectVerse(v.num, verseDiv);
        });

        passageContent.appendChild(verseDiv);
      });
    }

    // Wire up TTS listeners on new dynamically generated play buttons
    if (
      window.bibleTTS &&
      typeof window.bibleTTS.wireUpPlayButtons === "function"
    ) {
      window.bibleTTS.wireUpPlayButtons();
    }

    // Auto select first verse as active to feed the transcription copy guide
    const firstVerse = currentPassageData.verses[0];
    if (firstVerse) {
      const activeText = firstVerse.text; // 개역개정 4판 단일
      updateTranscriptionCopyGuide(
        activeText,
        currentPassageData.name,
        firstVerse.num,
      );
      updatePlayerUI(currentPassageData.name, firstVerse.num, activeText);
    }
  }

  function selectVerse(verseNum, verseElement) {
    // Save to active verse state
    activeVerseNum = verseNum;
    localStorage.setItem(ACTIVE_VERSE_KEY, activeVerseNum);

    if (!currentPassageData) return;

    const verseObj = currentPassageData.verses.find((v) => v.num === verseNum);
    if (verseObj) {
      const activeText = verseObj.text; // 개역개정 4판 단일
      // Update calligraphy transcription guide text! Deep Typography linking
      updateTranscriptionCopyGuide(
        activeText,
        currentPassageData.name,
        verseNum,
      );

      // Reset typing input & feedback on verse selection for clean transcription experience
      if (transcriptionTypingInput) {
        transcriptionTypingInput.value = "";
      }
      if (typingFeedback) {
        typingFeedback.textContent = "";
      }

      // Update floating player metadata text
      updatePlayerUI(currentPassageData.name, verseNum, activeText);

      // Highlight locally
      const allVerses = document.querySelectorAll(".verse");
      allVerses.forEach((el) => {
        if (el.getAttribute("data-verse") !== String(verseNum)) {
          el.classList.remove("active-highlight");
        }
      });

      // Play verse TTS if window.bibleTTS is active, stopping previous
      if (window.bibleTTS && typeof window.bibleTTS.playVerse === "function") {
        const ttsActiveVerse = window.bibleTTS.getActiveHighlightedVerse();
        if (
          !ttsActiveVerse ||
          ttsActiveVerse.getAttribute("data-verse") !== String(verseNum)
        ) {
          window.bibleTTS.playVerse(verseElement);
        }
      } else {
        verseElement.classList.add("active-highlight");
      }
    }
  }

  function updateTranscriptionCopyGuide(text, bookName, verseNum) {
    if (transcriptionGuideText) {
      transcriptionGuideText.textContent = `"${text}" (${bookName} ${verseNum}절)`;
    }
  }

  function updatePlayerUI(bookName, verseNum, text) {
    if (playerBookTag) playerBookTag.textContent = bookName;
    if (playerVerseIndicator)
      playerVerseIndicator.textContent = `${verseNum}절 낭독`;
    if (playerVerseText) playerVerseText.textContent = text;
  }

  // Update the 365 daily meditation panel details based on rotated index
  function loadMeditationData(dayIndex) {
    // Map dayIndex to meditationDb array (rotating indices)
    const dbIndex = (dayIndex - 1) % meditationDb.length;
    const med = meditationDb[dbIndex];
    if (!med) return;

    const activeQuote = med.quote; // 개역개정 4판 단일

    if (meditationDayLabel) meditationDayLabel.textContent = `Day ${dayIndex}`;
    if (meditationQuote) meditationQuote.textContent = `"${activeQuote}"`;
    if (meditationQuoteRef) meditationQuoteRef.textContent = med.passage;
    if (meditationContent) meditationContent.textContent = med.content;
    if (meditationPrayer) meditationPrayer.textContent = med.prayer;
  }

  // Grouped Rendering of the 66 Books selector grid (Accordion Chapters Drawer)
  function render66BooksGrid(filterType) {
    if (!bibleBooksGridContainer) return;

    bibleBooksGridContainer.innerHTML = "";

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
        const booksInCat = bibleBooks.filter(
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
          container.className = `book-item-container ${book.id === currentBookId ? "active-container" : ""}`;
          container.setAttribute("data-book-id", book.id);

          const card = document.createElement("button");
          card.type = "button";
          card.className = `btn-book-card ${book.id === currentBookId ? "active-book" : ""}`;
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
            const allContainers = bibleBooksGridContainer.querySelectorAll(
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
              title.textContent = `🍀 ${book.name} — 총 ${book.chaptersCount}장`;
              accordion.appendChild(title);

              // Grid for chapter buttons
              const chaptersGrid = document.createElement("div");
              chaptersGrid.className = "chapters-grid";

              // Create chapter buttons
              for (let ch = 1; ch <= book.chaptersCount; ch++) {
                const chBtn = document.createElement("button");
                chBtn.type = "button";
                chBtn.className = "btn-chapter";
                chBtn.textContent = `${ch}장`;

                // Highlight active chapter
                if (book.id === currentBookId && ch === currentChapterNum) {
                  chBtn.style.borderColor = "var(--primary-color)";
                  chBtn.style.color = "#FFFFFF";
                  chBtn.style.background = "var(--primary-color)";
                } else if (ch === book.keyChapter) {
                  chBtn.innerHTML = `⭐ ${ch}장`;
                  chBtn.title = "주요 말씀 장";
                  chBtn.style.borderColor = "var(--primary-color)";
                  chBtn.style.color = "var(--primary-color)";
                }

                chBtn.addEventListener("click", (ev) => {
                  ev.stopPropagation(); // Avoid triggering container clicks

                  // Load the selected chapter passage
                  loadBiblePassage(book.id, ch);
                  switchTab("reading");

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
                    bibleBooksGridContainer.querySelectorAll(
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
        bibleBooksGridContainer.appendChild(testamentDiv);
      }
    };

    if (filterType === "all" || filterType === "ot") {
      renderTestament("OT", "📖 구약성경 (Old Testament)");
    }
    if (filterType === "all" || filterType === "nt") {
      renderTestament("NT", "🕊️ 신약성경 (New Testament)");
    }
  }

  // --- 10. Floating Player Navigation Integrations ---
  function triggerPlayerPlayToggle() {
    if (!window.bibleTTS) return;

    // ✅ 수정: isActuallySpeaking 기준으로 판단 (cloudAudio/SpeechSynthesis 모두 포함)
    if (window.bibleTTS.getIsActuallySpeaking()) {
      window.bibleTTS.stopPlayback();
      if (btnPlayerPlayToggle) btnPlayerPlayToggle.innerHTML = "▶ 재생";
    } else {
      if (typeof window.bibleTTS.playCloudChapter === "function") {
        window.bibleTTS.playCloudChapter();
      }
      if (btnPlayerPlayToggle) btnPlayerPlayToggle.innerHTML = "⏸ 정지";
    }
  }

  
  
  function triggerPlayerNext() {
    if (window.graceBibleApp && typeof window.graceBibleApp.playNextChapter === "function") {
      window.graceBibleApp.playNextChapter();
    }
  }

  function triggerPlayerPrev() {
    if (window.graceBibleApp && typeof window.graceBibleApp.playPrevChapter === "function") {
      window.graceBibleApp.playPrevChapter();
    }
  }

  function syncPlayStatus(isPlaying) {
    if (btnPlayerPlayToggle) {
      btnPlayerPlayToggle.innerHTML = isPlaying ? "⏸ 정지" : "▶ 재생";
    }
  }

  // 장(Chapter) 단위 프로그래스바 업데이트
  function updateProgressBar(progressPercent) {
    if (playerProgressBar) {
      playerProgressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
    }
  }

  // ── 성경 목록 리스트 패널 렌더링 ──────────────────────────────────────────
  function renderPlayerListPanel() {
    if (!playerListPanel) return;
    playerListPanel.innerHTML = "";

    // 카테고리 순서 정의
    const categoryOrder = [
      "모세오경",
      "역사서",
      "시가서",
      "대예언서",
      "소예언서",
      "복음서",
      "역사서(신)",
      "바울서신",
      "공동서신",
      "예언서(신)",
    ];
    // 책 목록을 카테고리별로 그룹핑
    const grouped = {};
    bibleBooks.forEach((b) => {
      const cat = b.category || "기타";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(b);
    });

    // 정렬: categoryOrder 기준, 나머지는 뒤에
    const cats = Object.keys(grouped).sort((a, b) => {
      const ia = categoryOrder.indexOf(a);
      const ib = categoryOrder.indexOf(b);
      if (ia === -1 && ib === -1) return 0;
      if (ia === -1) return 1;
      if (ib === -1) return -1;
      return ia - ib;
    });

    // 현재 선택된 책 추적 (장 패널 토글용)
    let openBookId = null;

    cats.forEach((cat) => {
      const books = grouped[cat];

      const section = document.createElement("div");
      section.className = "plist-section";

      const catLabel = document.createElement("div");
      catLabel.className = "plist-category";
      catLabel.textContent = cat;
      section.appendChild(catLabel);

      const bookGrid = document.createElement("div");
      bookGrid.className = "plist-book-grid";

      books.forEach((book) => {
        const bookBtn = document.createElement("button");
        bookBtn.type = "button";
        bookBtn.className = "plist-book-btn";
        bookBtn.textContent = book.name;
        if (book.id === currentBookId) bookBtn.classList.add("active");

        bookBtn.addEventListener("click", () => {
          // 기존 장 패널 제거
          const existingChPanel = playerListPanel.querySelector(
            ".plist-chapter-panel",
          );
          if (existingChPanel) existingChPanel.remove();

          // 같은 책 클릭 시 닫기
          if (openBookId === book.id) {
            openBookId = null;
            bookGrid
              .querySelectorAll(".plist-book-btn")
              .forEach((b) => b.classList.remove("open"));
            return;
          }

          openBookId = book.id;
          bookGrid
            .querySelectorAll(".plist-book-btn")
            .forEach((b) => b.classList.remove("open"));
          bookBtn.classList.add("open");

          // 장 선택 패널 생성
          const chPanel = document.createElement("div");
          chPanel.className = "plist-chapter-panel";

          const chLabel = document.createElement("div");
          chLabel.className = "plist-chapter-label";
          chLabel.textContent = `${book.name} — 장 선택`;
          chPanel.appendChild(chLabel);

          const chGrid = document.createElement("div");
          chGrid.className = "plist-chapter-grid";

          for (let ch = 1; ch <= book.chaptersCount; ch++) {
            const chBtn = document.createElement("button");
            chBtn.type = "button";
            chBtn.className = "plist-chapter-btn";
            chBtn.textContent = ch;
            if (book.id === currentBookId && ch === currentChapterNum)
              chBtn.classList.add("active");

            chBtn.addEventListener("click", () => {
              loadBiblePassage(book.id, ch);
              playerListPanel.classList.remove("active");
              // 로드 완료 후 1절부터 자동 재생
              setTimeout(() => {
                const firstEl = document.querySelector(
                  '.verse[data-verse="1"]',
                );
                if (firstEl && window.bibleTTS) {
                  window.bibleTTS.playVerse(firstEl);
                }
              }, 500);
            });

            chGrid.appendChild(chBtn);
          }

          chPanel.appendChild(chGrid);
          // bookBtn 바로 다음에 삽입
          section.appendChild(chPanel);
        });

        bookGrid.appendChild(bookBtn);
      });

      section.appendChild(bookGrid);
      playerListPanel.appendChild(section);
    });
  }

  // --- 11. Core Globals Exporting ---
  window.graceBibleApp = {
    bibleBooks,
    meditationDb,
    getCurrentBookId: () => currentBookId,
    getCurrentChapterNum: () => currentChapterNum,
    getActiveVerseNum: () => activeVerseNum,
    getMeditationDay: () => currentMeditationDay,
    // ✅ 신규: 현재 챕터의 절 목록 반환 (bible-tts.js의 autoAdvanceToNext에서 사용)
    getCurrentPassageVerses: () =>
      currentPassageData ? currentPassageData.verses : [],
    loadBiblePassage,
    loadMeditationData,
    selectVerse,
    switchTab,
    syncPlayStatus,
    updateProgressBar,
    updatePlayerUI,
    updateTranscriptionCopyGuide,
  };

  // Wire up DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
