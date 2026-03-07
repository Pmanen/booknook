# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Booknook is a personal reading tracker for books and articles. It is a full-stack app with a React frontend and an Express/MongoDB backend.

## Development Commands

Both services must run simultaneously during development.

**Backend** (runs on port 3003):
```bash
cd backend && npm run dev    # node --watch index.js
cd backend && npm start      # production
```

**Frontend** (runs on port 5173, proxies `/api` to port 3003):
```bash
cd frontend && npm run dev
cd frontend && npm run build
cd frontend && npm run lint
```

There are no automated tests. The `backend/requests/` directory contains `.rest` files for manual API testing.

## Architecture

### Frontend

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4 with custom primary color `#BD5252`
- **State**: Redux Toolkit — all server data lives in the Redux store
- **Routing**: React Router DOM 7

**Routes** (defined in `frontend/src/App.jsx`):
- `/` → `StatsDisplay`
- `/library` → `Library`
- `/log` → `LogBook`

**Data flow**: On app load, `App.jsx` dispatches all four `initialize*` thunks. Each thunk fetches from the API and populates its Redux slice. Subsequent mutations call the API service first, then dispatch an update action to sync the store.

**State slices** (`frontend/src/reducers/`): `bookReducer`, `articleReducer`, `bookLogReducer`, `articleLogReducer` — each exports async thunks (`initializeX`, `createX`, `updateX`, `deleteX`).

**API services** (`frontend/src/services/`): Thin Axios wrappers — `books.js`, `articles.js`, `bookLogs.js`, `articleLogs.js`.

### Backend

- **Framework**: Express 5
- **Database**: MongoDB via Mongoose 9
- **Entry point**: `backend/index.js` → `backend/app.js`

**API endpoints** (all under `/api`):
- `GET/POST /api/books`
- `GET/POST /api/articles`
- `GET/POST /api/booklogs`
- `GET/POST /api/articlelogs`

**Models** (`backend/models/`): `Book`, `Article`, `BookLog`, `ArticleLog`. `BookLog` references a `Book`; `ArticleLog` references an `Article`.

**Config**: `backend/.env` holds `PORT`, `MONGODB_URI`, and `TEST_MONGODB_URI`. Environment switching is handled in `backend/utils/config.js`.
