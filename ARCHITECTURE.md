# 의정부중앙교회 스마트 주보 및 성경 앱 아키텍처 문서 (Architecture Document)

본 문서는 **의정부중앙교회(Grace Bible Study)** 웹 애플리케이션의 전체 구조, 데이터 흐름, 그리고 자동화 워크플로우를 정의합니다. 향후 모든 개발 및 유지보수는 본 문서를 기준으로 진행됩니다.

---

## 1. 프로젝트 폴더 구조 (Directory Structure)

프로젝트 루트 디렉토리에는 핵심 프론트엔드 파일들이 위치하며, 각종 데이터 처리 및 자동화 봇 스크립트는 `scripts/` 폴더 내에 통합 관리됩니다.

```
/
├── index.html              # 메인 UI 구조 및 레이아웃 (SPA 형태의 탭 네비게이션)
├── style.css               # 메인 스타일시트 (Glassmorphism, 반응형 디자인)
├── app.js                  # 프론트엔드 코어 비즈니스 로직 (탭 전환, 주보 로딩, 성경 데이터 매핑)
├── bible-tts.js            # TTS(Text-to-Speech) 오디오 재생 제어 엔진
├── canvas-drawing.js       # 필사 탭의 캘리그라피 캔버스 그리기 패드 로직
├── bible_db.json           # [데이터베이스] 성경 66권, 1189장, 31077절 전체 통합 데이터
├── manifest.webmanifest    # PWA 지원을 위한 매니페스트 파일
├── sw.js                   # 서비스 워커 (캐싱 및 오프라인 지원)
├── images/                 # 정적 이미지 리소스 (가치 비전, 배지 등)
│   └── jubbo/              # 스크래핑 봇이 가공한 주보 이미지 저장소
└── scripts/                # [백엔드/자동화 봇 폴더]
    ├── scrape-and-split.js # (최종) 주보 자동화 스크래퍼 (Node.js + Playwright)
    ├── build-bible-db.js   # 원본 텍스트를 파싱하여 bible_db.json을 생성하는 스크립트
    └── *-tts.js            # TTS 테스트 및 샘플 오디오 생성 유틸리티 스크립트들
```

---

## 2. 주요 아키텍처 및 워크플로우

### A. 주보 자동화 파이프라인 (Jubbo Automation Workflow)
교회 홈페이지(god4u.or.kr)에 업로드되는 주보를 자동으로 파싱하고 가공하여 웹앱에 반영하는 최종 프로세스입니다.

1. **Scraping (스크래핑):**
   - `scripts/scrape-and-split.js` 스크립트가 **Node.js Playwright** 모듈을 사용하여 백그라운드 환경(Headless Browser)에서 교회 공식 홈페이지 주보 게시판(pageCode=50)에 접속합니다.
   - 가장 최근 게시글 2개(이번 주, 지난 주)를 클릭하여 진입한 뒤, 고해상도 이미지(주보 원본 4장)의 링크를 추출 및 다운로드합니다.
2. **Parsing & Splitting (파싱 및 분할):**
   - 다운로드된 4장의 원본 이미지는 좌/우 2페이지가 결합된 형태입니다.
   - Node.js의 `sharp` 라이브러리를 이용하여 각 이미지를 정확히 반으로 잘라 총 8장의 낱장(세로형) 이미지로 가공합니다.
3. **Deploy (반영):**
   - 가공된 파일은 `processed_1.jpg ~ 8.jpg` (이번 주), `prev_processed_1.jpg ~ 8.jpg` (지난 주) 포맷으로 `images/jubbo/` 폴더에 저장됩니다.
   - 프론트엔드의 `app.js`는 접속 시 이 경로의 정적 파일들을 로드하여 브라우저에 표시합니다.

### B. 성경 텍스트-음성 변환 (Cloud TTS) 아키텍처
사용자가 '장 단위 재생'을 요청할 때 브라우저 자체 음성이 아닌 고품질 구글 클라우드 AI 음성을 제공하는 방식입니다.

1. **Frontend Request (`bible-tts.js`):**
   - 사용자가 [재생] 버튼을 누르면, 현재 장(Chapter)에 해당하는 모든 구절 텍스트를 하나로 합쳐서(최대 6000자 내외) GCP Cloud Function 엔드포인트(`https://bible-tts...`)로 `POST` 요청을 보냅니다.
2. **Cloud Function Processing:**
   - GCP Cloud Function은 전달받은 긴 텍스트를 GCP TTS API 한계(5000바이트)에 맞게 문장 단위로 자동 청크(Chunk) 분할합니다.
   - 분할된 텍스트들을 병렬로 TTS API에 전송하여 바이너리 오디오 버퍼(Buffer)로 변환한 뒤, 이를 단일 MP3 파일로 병합(Concat)합니다.
3. **Audio Playback:**
   - 최종 병합된 MP3 Blob 데이터를 프론트엔드로 반환하면, `bible-tts.js`가 브라우저의 네이티브 `Audio` 객체로 로드하여 백그라운드 재생을 시작합니다.
   - 재생이 종료되면 자동으로 다음 장(Next Chapter)으로 넘어가는 릴레이 로직을 수행합니다.

### C. 프론트엔드 UI 설계 (SPA Navigation)
- `index.html` 내부에 여러 `<div class="tab-content">` 구역을 만들어 두고, `app.js`의 `switchTab()` 함수를 통해 CSS `display` 속성을 토글하며 **Single Page Application(SPA)** 형태로 동작합니다.
- 복잡한 렌더링(성경 구절 리스트업, 주보 DOM 동적 생성)은 모두 `app.js` 내의 순수 자바스크립트(Vanilla JS) 로직으로 처리되어 외부 프레임워크(React 등) 없이도 최상의 로딩 속도와 모바일 최적화를 달성합니다.

---

## 3. 개발 원칙 (Rules of Development)
- **Here Only:** 이후 모든 백엔드 자동화 로직이나 스크립트 수정은 루트 디렉토리에 흩뜨리지 않고, 반드시 `scripts/` 폴더 내에서만 관리합니다.
- **Node.js Playwright:** 주보 파싱 봇 등 외부 크롤링은 Python을 섞어 쓰지 않고, 현재 성공적으로 통합된 Node.js 생태계(Playwright + Sharp)를 유지하여 단일 패키지 매니저(`package.json`)로 완벽히 통제합니다.
- **Vanilla First:** 웹앱의 프론트엔드 무게를 가볍게 유지하기 위해 복잡한 의존성 패키지를 지양하고, 현재의 Vanilla JS + CSS 구조를 고수합니다.
