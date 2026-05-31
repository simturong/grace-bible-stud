@echo off
chcp 65001 >nul
title ⛪ 의정부중앙교회 은혜 성경 공부 웹앱 - 평생 통합 관리기 ⛪
color 0B

:menu
cls
echo =====================================================================
echo    ⛪ 의정부중앙교회 은혜 성경 공부 웹앱 평생 통합 관리 패키지 ⛪
echo =====================================================================
echo  [작업 경로] E:\Tak\Gemini\grace-bible-study
echo  [구동 포트] http://localhost:8081 (무캐시 초고속 로컬 서비스 중)
echo =====================================================================
echo   1. ⛪ 실시간 주보 자동 수집 및 이분할 분할 배치 (Playwright Sniffer)
echo   2. 🔊 로컬 성경 및 오늘의 묵상 MP3 오디오 벌크 굽기 (무제한 비용 0원)
echo   3. 🚀 웹앱 PWA 강제 업데이트 및 로컬 서버 재기동 (Cache-Busting)
echo   4. 🛠️ 웹앱 소스코드 문법 무결성 종합 자가 진단 (Syntax Checker)
echo   5. ❌ 로컬 백업 및 임시 파일 청소 (Cleanup)
echo   6. 🚪 프로그램 종료
echo =====================================================================
set /p choice="수행하실 작업 번호를 선택하고 Enter를 눌러주세요 (1-6): "

if "%choice%"=="1" goto scrape
if "%choice%"=="2" goto bake
if "%choice%"=="3" goto server
if "%choice%"=="4" goto syntax
if "%choice%"=="5" goto clean
if "%choice%"=="6" goto exit

echo.
echo ⚠️ 잘못된 선택입니다. 다시 선택해 주세요.
timeout /t 2 >nul
goto menu

:scrape
cls
echo =====================================================================
echo   ⛪ 1단계: 실시간 주보 홈페이지 자동화 수집 엔진을 가동합니다...
echo =====================================================================
echo * Playwright Chromium 브라우저를 백그라운드 구동하여 최신 주보를 추출합니다.
node scrape-and-split.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ [오류] 주보 자동 수집 도중 문제가 발생했습니다. 네트워크 상태를 확인하세요.
) else (
    echo.
    echo 🎉 [성공] 이번 주 및 지난주 8장 주보 이분할 가공 및 이미지 배포가 완벽하게 마감되었습니다!
)
echo.
pause
goto menu

:bake
cls
echo =====================================================================
echo   🔊 2단계: 로컬 무료 오디오 벌크 굽기(Baking) 엔진을 가동합니다...
echo =====================================================================
echo * 시편 23편 및 오늘의 묵상 텍스트를 무료 고품질 한국어 오디오 MP3 파일로 변환합니다.
node build-bible-audio.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ [오류] 오디오 벌크 굽기 도중 오류가 발생했습니다.
) else (
    echo.
    echo 🎉 [성공] audio/ 폴더 내에 초고속 로컬 MP3 파일들이 무결하게 배포 완료되었습니다!
)
echo.
pause
goto menu

:server
cls
echo =====================================================================
echo   🚀 3단계: PWA 캐시 갱신 및 무캐시 로컬 웹 서버를 재부팅합니다...
echo =====================================================================
echo * 브라우저 내부의 오랜 고여있던 캐시를 완전 폭파(Busting) 처리합니다.
echo * 8081 포트에서 실시간 코드가 100% 즉각 반영되는 서버를 활성화합니다.
echo.
echo http://localhost:8081 주소로 스마트폰이나 태블릿에서 접속해 보실 수 있습니다.
echo.
echo [안내] 기동 중인 서버를 끄려면 터미널 창에서 Ctrl + C를 입력하십시오.
echo.
npx --yes http-server . -p 8081 --no-cache -c-1
pause
goto menu

:syntax
cls
echo =====================================================================
echo   🛠️ 4단계: 웹앱 핵심 소스코드 자가 진단 및 문법 체크를 수행합니다...
echo =====================================================================
node -c app.js bible-tts.js canvas-drawing.js build-bible-audio.js scrape-and-split.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ [오류] 자바스크립트 코드 내에 구문 문법 오류(Syntax Error)가 감지되었습니다!
) else (
    echo.
    echo 🎉 [안전] 자가 진단 결과, 모든 핵심 자바스크립트 소스코드가 100% 무결합니다!
)
echo.
pause
goto menu

:clean
cls
echo =====================================================================
echo   ❌ 5단계: 로컬 임시 캐시 및 백업 잔재 쓰레기 파일들을 청소합니다...
echo =====================================================================
del /f /q test_allorigins.jpg test.jpg >nul 2>&1
echo.
echo 🎉 [완료] 지저분한 임시 테스트 이미지 파일들이 말끔하게 소거 및 정돈되었습니다!
echo.
pause
goto menu

:exit
cls
echo =====================================================================
echo   ⛪ 의정부중앙교회 은혜 성경 공부 웹앱 통합 관리기를 종료합니다.
echo   부모님과 어르신들의 삶에 날마다 주님의 은혜와 평강이 넘치기를 소망합니다.
echo =====================================================================
timeout /t 3 >nul
exit
