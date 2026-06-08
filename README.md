# Project TMR

날씨 기반 술 / 메뉴 (안주) 추천 웹앱  
Weather-based food and drink recommendation web app.

## 앱 개요 / App Concept

Project TMR은 현재 날씨, 사용자 위치, 음식 카테고리, 주종 선택을 바탕으로 오늘 어울리는 안주와 술 조합을 추천하는 웹앱입니다. 추후 사용자 선택 이력과 AI 추천 문구를 활용해 더 자연스럽고 개인화된 추천으로 확장할 수 있습니다.

Project TMR is a web app that recommends food and drink pairings based on current weather, user location, food category, and drink type. It can later evolve into a more natural and personalized recommendation service using user history and AI-generated recommendation messages.

## 주요 기능 / Key Features

- 날씨 기반 메뉴 추천 / Weather-based menu recommendation
- 음식 카테고리 선택 / Food category selection
- 주종 선택 / Drink type selection
- 주종별 브랜드 랜덤 추천 / Random brand recommendation by drink type
- 현재 위치 기반 주변 음식점 검색 / Nearby restaurant search based on current location
- 카카오 지도 기반 1km 반경 음식점 표시 / Kakao map display for restaurants within a 1km radius
- 음식 이미지 로딩 오버레이 / Food image loading overlay

## 기술 스택 / Tech Stack

- 프론트엔드 / Frontend: React + TypeScript + Vite
- 백엔드 / Backend: NestJS + TypeScript
- 데이터베이스 / Database: PostgreSQL or MSSQL, to be decided
- 날씨 API / Weather API: Korea Meteorological Administration API
- 지도 및 장소 API / Map and Place API: Kakao Map / Kakao Local API
- AI 추천 확장 / AI Recommendation Extension: OpenAI API, planned

## 프로젝트 구조 / Project Structure

```text
D:\Project_TMR
  frontend\   React web app / React 프론트엔드 앱
  backend\    NestJS API server / NestJS 백엔드 API 서버
  docs\       Product, API, and database notes / 제품, API, DB 문서
  infra\      Deployment and Docker files / 배포 및 Docker 관련 파일
```

## MVP 흐름 / MVP Flow

1. 브라우저 위치 권한 요청 / Request browser location permission.
2. 위도와 경도로 현재 날씨 조회 / Fetch current weather by latitude and longitude.
3. 음식 카테고리와 주종 선택 / Select food category and drink type.
4. 날씨와 선택값을 기반으로 메뉴와 술 브랜드 추천 / Recommend a menu and drink brand based on weather and selected preferences.
5. 추천 메뉴 키워드로 주변 음식점 검색 / Search nearby restaurants using the recommended menu keyword.
6. 추천 결과, 추천 이유, 날씨, 주변 음식점을 화면에 표시 / Display recommendation, reason, weather, and nearby restaurants.

## 환경 변수 / Environment Variables

백엔드 환경 파일 / Backend environment file:

```powershell
D:\Project_TMR\backend\.env
```

```env
KMA_SERVICE_KEY=secured_kma_service_key
KAKAO_REST_API_KEY=secured_kakao_rest_api_key
```

프론트엔드 환경 파일 / Frontend environment file:

```powershell
D:\Project_TMR\frontend\.env
```

```env
VITE_API_BASE_URL=https://project-tmr-nine.vercel.app
VITE_KAKAO_JAVASCRIPT_KEY=secured_kakao_javascript_key
```

## 실행 방법 / How to Run

환경 파일을 먼저 생성합니다.  
Create environment files first.

```powershell
copy D:\Project_TMR\backend\.env.example D:\Project_TMR\backend\.env
copy D:\Project_TMR\frontend\.env.example D:\Project_TMR\frontend\.env
```

백엔드 실행 / Run backend:

```powershell
cd D:\Project_TMR\backend
npm run start:dev
```

프론트엔드 실행 / Run frontend:

```powershell
cd D:\Project_TMR\frontend
npm run dev -- --host 127.0.0.1
```

## 접속 주소 / URLs

- 프론트엔드 / Frontend: https://project-tmr-0605.vercel.app/
- 백엔드 API / Backend API: https://project-tmr-nine.vercel.app/api/recommendation

## Git Bash 실행 명령어 / Git Bash Commands

백엔드 실행 / Run backend:

```bash
cd /d/Project_TMR/backend
npm run start:dev
```

프론트엔드 실행 / Run frontend:

```bash
cd /d/Project_TMR/frontend
npm run dev -- --host 127.0.0.1
```

종료 / Stop server:

```text
Ctrl + C
```

## 향후 개발 방향 / Future Improvements

- 회원 가입 및 로그인 / User registration and login
- 추천 이력 저장 / Save recommendation history
- 사용자 선호도 기반 추천 / Preference-based recommendation
- OpenAI API 기반 자연스러운 추천 문구 생성 / Natural recommendation messages using the OpenAI API
- 데이터베이스 연동 / Database integration
- 배포 환경 구성 / Deployment setup
