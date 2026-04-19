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

- `/` → `Library`
- `/library` → `Library`
- `/log` → `LogBook`
- `/stats` → `StatsDisplay`

**Data flow**: On app load, `App.jsx` dispatches all four `initialize*` thunks. Each thunk fetches from the API and populates its Redux slice. Subsequent mutations call the API service first, then dispatch an update action to sync the store.

**State slices** (`frontend/src/reducers/`): `bookReducer`, `articleReducer`, `bookLogReducer`, `articleLogReducer` — each exports async thunks (`initializeX`, `createX`, `updateX`, `deleteX`).

**API services** (`frontend/src/services/`): Thin Axios wrappers — `books.js`, `articles.js`, `bookLogs.js`, `articleLogs.js`.

**Components** (`frontend/src/components/`):

- `Library.jsx` — combined books + articles list with inline `SortDropdown` component; uses `sortLibrary` + `applyFilters` from utils
- `forms/FilterLibraryForm.jsx` — collapsible filter panel (type, genre group, outlet, finished, has-progress); draft state submitted explicitly via Filter button
- `LogBook.jsx` — all reading logs grouped by date; includes currently-reading progress at top
- `CurrentlyReading.jsx` — in-progress books with page/percentage update and mark-finished
- `StatsDisplay.jsx` — current-month reading statistics
- `DropdownMenu.jsx` — reusable three-dot action menu with outside-click detection
- `forms/BookForm.jsx` — create book (+ optional initial log)
- `forms/ArticleForm.jsx` — create article + article log in one action
- `forms/EditBookForm.jsx` — edit book; calls `modifyBook` thunk which cascades to bookLogs in store
- `forms/EditArticleForm.jsx` — edit article metadata only
- `forms/EditArticleLogForm.jsx` — edit article log fields + article metadata together
- `forms/AddProgressForm.jsx` — append a book log; auto-sets `finished` when page ≥ total pages

**Utilities** (`frontend/src/utils/`):

- `deweyTags.js` — Dewey-inspired genre tag map (00–99); exports `deweyLabel(code)` and `deweyText(code)`
- `libraryFilters.js` — `sortLibrary(library, sortKey)`, `applyFilters(library, filters, bookLogs)`, `SORT_OPTIONS`, `DEFAULT_FILTERS`, `getFinishedBookIds(bookLogs)`, `getBooksWithProgressIds(bookLogs)`

**Sorting** (`sortLibrary`): 11 options (latest/earliest added, author A–Z, title A–Z, length low/high, publish date earliest/latest, genre 0–99/99–0, outlet A–Z). Nulls always sort to the bottom regardless of direction. Books' `yearPublished` (integer year) is converted to `YEAR-01-01` for date comparison with article `datePublished`. `pages` (books) and `length` (articles, in minutes) are treated as equivalent for length sorting.

**Filtering** (`applyFilters`): type (books/articles), genre group (ranges 00–09 … 90–99, multi-select), outlet substring match, finished (books with any `finished: true` bookLog; articles always included), has reading progress (books with any bookLog; articles always included).

### Backend

- **Framework**: Express 5
- **Database**: MongoDB via Mongoose 9
- **Entry point**: `backend/index.js` → `backend/app.js`

**API endpoints** (all under `/api`):

- `GET/POST/PUT/DELETE /api/books`
- `GET/POST/PUT/DELETE /api/articles`
- `GET/POST/DELETE /api/booklogs`
- `GET/POST/PUT /api/articlelogs`

All `PUT` handlers pass `{ new: true, runValidators: true }` to `findByIdAndUpdate` so Mongoose schema validators (min/max, custom) run on updates.

**Models** (`backend/models/`): `Book`, `Article`, `BookLog`, `ArticleLog`. `BookLog` references a `Book`; `ArticleLog` references an `Article`.

- `Book`: title (required), author, yearPublished (required), pages (required, min 1), genreTag (0–99 integer)
- `Article`: title (required), url (required, unique, normalized), author, outlet, length in minutes (required, integer ≥ 0), datePublished, genreTag (0–99 integer)
- `BookLog`: book ref (required), currentPage (required), finished (bool, default false), date, readLength (auto-calculated in controller as currentPage − previous currentPage)
- `ArticleLog`: article ref (required), date, readLength, notes, favorite (bool)

**Controllers** (`backend/controllers/`): `books.js`, `articles.js`, `bookLogs.js`, `articleLogs.js`. Book and article DELETE handlers cascade-delete their associated logs. `bookLogs` POST validates that currentPage > 0 and > the previous log's currentPage for that book.

**Config**: `backend/.env` holds `PORT`, `MONGODB_URI`, and `TEST_MONGODB_URI`. Environment switching is handled in `backend/utils/config.js`.
