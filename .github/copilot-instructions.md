Project: Hackathon (React + Express + MongoDB)

Summary
- Backend: Express (CommonJS) app at `Backend/app.js` + `Backend/server.js`. MongoDB connection helper in `Backend/config/db.js`. Routes under `Backend/routes` (example: `routes/user.js`) call controllers in `Backend/controller` which use Mongoose models from `Backend/models`.
- Frontend: Vite + React (ESM) in `Frontend/` with entry `src/main.jsx` and routing in `src/App.jsx`. Environment variables in `Frontend/.env` and accessed via `import.meta.env.VITE_API_URL`.

Why this structure matters
- The backend is split into a lightweight app module (`app.js`) and a small server launcher (`server.js`) that calls `connectDB()`; edits that affect DB startup should consider `config/db.js` and `server.js` together.
- Controllers are thin and return JSON. Business logic lives in `Backend/controller/*`. Keep side effects (DB writes, hashing) in controllers or models.

Key patterns and examples
- Routes to controllers: `routes/user.js` maps `/register` -> `controller/user.registerUser` and `/login` -> `controller/auth.login`.
- Admin login is env-driven (NOT in DB): `Backend/controller/auth.js` checks `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD`. Do not change this behavior unless migrating admin to DB — update both controller and any docs/env files.
- Passwords are hashed with bcrypt on register: `controller/user.js` uses `bcrypt.hash(password, 10)` and `auth.js` uses `bcrypt.compare`.
- Mongoose models are simple schemas in `Backend/models`. Example: `models/user.js` defines fields `first_name`, `last_name`, `email`, `password`, `role`.

Developer workflows (how to run & debug)
- Backend (Node, CommonJS):
  - Install: run `npm install` inside `Backend/`.
  - Run locally: set `MONGO_URI` and (optionally) `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `Backend/.env`, then run the server with `node server.js` (or `nodemon server.js` if available).
  - The express app listens on `process.env.PORT || 5000`.
- Frontend (Vite, ESM):
  - Install: run `npm install` inside `Frontend/`.
  - Dev server: `npm run dev` (uses Vite). Ensure `VITE_API_URL` in `Frontend/.env` points to backend (e.g. `http://localhost:5000/api/users`).

Conventions and gotchas for AI changes
- File style: Backend uses CommonJS (`require`, `module.exports`); Frontend uses ES modules (`import`). Keep module style consistent per folder.
- Environment variables:
  - Backend reads `process.env.MONGO_URI`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
  - Frontend expects `VITE_API_URL` (used in `src/components/*` via `import.meta.env.VITE_API_URL`).
  - Don’t commit real secrets. If adding new env keys, document them in the appropriate `.env` files.
- Routes and API paths: Backend mounts user routes at `/api/users` (see `app.js`). Frontend calls registration at `${VITE_API_URL}/users/register` and login at `${VITE_API_URL}/login` in some components — note the duplicated `/users` path in code; confirm final API base URL when changing routes.

Integration points and external dependencies
- MongoDB (mongoose): connection is central and can fail silently if `MONGO_URI` is missing — check `config/db.js` and `app.js` logs.
- bcrypt: used for hashing/verification. Keep salt rounds (10) consistent across register/login code.
- Frontend communicates to backend via fetch/axios; current code uses `fetch` in `Registration.jsx` and `Login.jsx`.

When editing or adding features
- If you change a route path, update both `Backend/routes/*` and any Frontend components that call the endpoint (search for the path or `VITE_API_URL`).
- If adding a new environment variable, add it to the appropriate `.env` and update README or this file.
- For adding new models, follow the minimal schema pattern in `Backend/models/user.js` and export with `module.exports = mongoose.model('Name', schema)`.

Quick references (files to open first)
- Backend: `Backend/app.js`, `Backend/server.js`, `Backend/config/db.js`, `Backend/routes/user.js`, `Backend/controller/auth.js`, `Backend/controller/user.js`, `Backend/models/user.js`.
- Frontend: `Frontend/package.json`, `Frontend/.env`, `Frontend/src/main.jsx`, `Frontend/src/App.jsx`, `Frontend/src/components/Login.jsx`, `Frontend/src/components/Registration.jsx`.

Notes (new functionality)
- Backend endpoints added for HealthMate: POST `/api/auth/register`, POST `/api/auth/login` (returns JWT); POST `/api/upload` (multipart, protected) — accepts images (jpg/jpeg/png/gif) and PDF, max 10MB; POST `/api/ai/analyze` (protected, expects `{ fileId }` and saves bilingual AI insight); POST `/api/vitals/add`, GET `/api/vitals`; GET `/api/users/reports`.
- Frontend: `AuthContext` (in `Frontend/src/context/AuthContext.jsx`) stores JWT in `localStorage` and exposes `authFetch(path, options)` which automatically attaches the Authorization header. Use `authFetch('/upload', { method: 'POST', body: formData })` for uploads.
- Env vars: Backend now requires `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. See `Backend/.env.example` and `Frontend/.env.example`.

If something is missing or unclear
- Tell me which area you want expanded (auth flows, API paths, env variables, or run scripts). I can tighten this file and add examples or small helper scripts (e.g., a start script or seed) if desired.

END