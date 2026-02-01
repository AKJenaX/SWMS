## Purpose

This file gives concise, actionable guidance to AI coding agents working on this repository so they can be productive immediately.

## Big picture (what to know first)

- Two-tier app: a Node/Express backend (MySQL) and a React frontend (Create React App).
- Backend entry: `backend/server.js` (ESM modules). Database connection is in `backend/db.js` using `mysql2/promise`.
- Routes: one Express router per entity in `backend/*.js` — `authority.js`, `vehicle.js`, `driver.js`, `usertable.js`, `bin.js`.
- Frontend lives in `frontend/` and uses a small API factory `frontend/src/api/apiService.js` to perform axios calls against the backend.

## How components communicate

- Frontend -> Backend base URL: `http://localhost:3000` (see `frontend/src/api/apiService.js`).
- REST patterns used by backend routers:
  - GET `/<entity>` — returns all records
  - POST `/<entity>/add` — add record, response: `{ message, id }`
  - PUT `/<entity>/update/:id` — update by id
  - DELETE `/<entity>/delete/:id` — delete by id
- DB columns follow entity-specific IDs such as `Authority_ID`, `Vehicle_ID`, `Driver_ID`, `User_ID`, `Bin_ID` — backend SQL uses these names in queries.

## Project-specific conventions & caveats

- Backend uses ESM (`type: "module"` in `backend/package.json`) — use `import`/`export` when touching backend files.
- `backend/db.js` creates and exports `db` and contains hard-coded credentials (host `localhost`, user `root`, password `anup`, database `pro`). This is discoverable and must be updated when running in other environments.
- The frontend `createApiService(entity, entityIdKey)` fetches all records and performs client-side lookup in `getOne(id)`; there is no backend `GET /<entity>/:id`. When adding features, prefer adding an indexed backend GET-by-id route to avoid fetching entire tables.
- Backend behavior on DB failure: `connectDB()` logs the error and calls `process.exit(1)` — starting the server depends on a successful DB connection (see `backend/server.js`).
- Add endpoints follow response pattern `{ message: string, id?: number }` on creation. Tests and UI expect this shape.

## Developer workflows (commands)

Run backend (development):

```powershell
cd backend
npm install
npm run dev   # uses nodemon; or `npm start` to run once
```

Run frontend (development):

```powershell
cd frontend
npm install
npm start
```

Notes:
- Start the backend first so `http://localhost:3000` is available. The React dev server will prompt to use another port (e.g. 3001) if 3000 is already taken; the frontend's API URL targets the backend at port 3000.
- CORS is enabled in `backend/server.js` (`app.use(cors())`) so the frontend can call the backend directly during development.

## Useful files to reference when coding

- Backend
  - `backend/server.js` — app bootstrap and router wiring
  - `backend/db.js` — DB connection and credentials
  - `backend/*.js` (entity routers) — SQL statements and parameterized queries
- Frontend
  - `frontend/src/api/apiService.js` — single place for API usage patterns; use `createApiService(entity, entityIdKey)` for new entities
  - `frontend/src/App.jsx` — route mapping for pages
  - `frontend/src/pages/*` and `frontend/src/components/*` — UI and table/form templates

## Quick implementation tips for agents

- When adding a new entity:
  1. Add router `backend/<entity>.js` following the existing pattern (`GET /`, `POST /add`, `PUT /update/:id`, `DELETE /delete/:id`).
  2. Export default the router and register it in `backend/server.js` with `app.use('/<entity>', <entity>Routes)`.
  3. Add a frontend service via `createApiService('<entity>', '<Entity_ID>')` and a page under `frontend/src/pages/` reusing `TableTemplate.jsx` and `FormTemplate.jsx`.

- When reading or debugging data issues, check raw SQL in the router files (they use parameterized `db.execute(...)`) and ensure the column names match the DB schema (e.g., `Vehicle_ID`).

## Integration & dependencies

- Node packages (backend): `express`, `mysql2`, `cors`; dev: `nodemon`.
- Frontend: `react`, `react-dom`, `react-router-dom`, `axios`, `react-scripts`.
- No CI/test harness is present in the repo — unit tests are not discoverable.

---

If any section is unclear or you want me to expand examples (for example, add a sample `GET /<entity>/:id` backend template or wire a proxy), tell me which area to expand.
