/**
 * E:/Tak/Gemini/grace-bible-study/sw.js
 * 
 * [캐시 해결 자멸 서비스 워커]
 * 브라우저 로컬 저장소에 고여 있던 옛날 PWA 캐시(v1~v5)를 흔적도 없이 완전히 폭파하고,
 * 매번 서버에 직접 노크하여 최신 버전의 모던 올리브 테마를 0.1초 만에 100% 뿜어내도록 제어합니다.
 */

// 1. 새 서비스 워커가 대기 없이 즉각 구 버전을 대체
self.addEventListener('install', () => {
  self.skipWaiting();
});

// 2. 활성화 즉시 브라우저 하드에 쌓여 있던 모든 과거 캐시 저장소(Cache Storage)를 스캔하여 강제 전면 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          console.log('[Service Worker] 과거 고여있던 캐시 강제 소멸 삭제:', cache);
          return caches.delete(cache);
        })
      );
    }).then(() => {
      // 제어권을 열려 있는 모든 웹페이지 브라우저로 즉시 강제 이동
      return self.clients.claim();
    })
  );
});

// 3. 페치(요청) 시 로컬 캐시를 전혀 쓰지 않고, 매번 네트워크(서버)에서 최신 데이터를 100% 실시간으로 직접 긁어옴
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // 오프라인 대비를 위한 아주 기본적이고 가벼운 안전장치만 작동
      return caches.match(event.request);
    })
  );
});

// Cache bust: 1780230380024
// Cache bust (lazy load fix): 1780232779509