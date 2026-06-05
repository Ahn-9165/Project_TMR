# Project TMR

Weather-based food and drink recommendation web app.

## App Concept

Project TMR recommends Korean anju and matching drinks based on the current weather, user location, and optional preferences. It can later show nearby restaurants through a map/place API.

## Stack

- Frontend: React + TypeScript + Vite
- Backend: NestJS + TypeScript
- Database: PostgreSQL or MSSQL, to be decided
- External APIs:
  - Weather: OpenWeather or Korea Meteorological Administration API
  - Places/Map: Kakao Map recommended for Korean local search

## Monorepo Layout

```text
D:\Project_TMR
  frontend\   React web app
  backend\    NestJS API server
  docs\       product, API, and database notes
  infra\      deployment and docker files
```

## MVP Flow

1. Request browser location permission.
2. Fetch current weather by latitude and longitude.
3. Generate food and drink recommendation.
4. Search nearby restaurants by recommended menu keyword.
5. Display recommendation, reason, weather, and nearby places.

## First Commands

Create environment files first:

```powershell
copy D:\Project_TMR\backend\.env.example D:\Project_TMR\backend\.env
copy D:\Project_TMR\frontend\.env.example D:\Project_TMR\frontend\.env
```

```powershell
cd D:\Project_TMR\frontend
npm run dev
```

```powershell
cd D:\Project_TMR\backend
npm run start:dev
```
