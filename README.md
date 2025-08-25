# ReelPrompt — Local Setup

This document shows how to start the frontend (Client), backend (Backend) and PostgreSQL database on Windows (PowerShell / cmd). Follow steps in order.

Prereqs

- Node.js 18+ (you have Node 20)
- npm
- PostgreSQL (psql)
- Optional: Git, VS Code

Project layout

- Backend: ReelPrompt\Backend
- Frontend: ReelPrompt\Client

1. Create PostgreSQL database

- Open PowerShell or cmd as user that can run psql.

PowerShell / cmd (example):

```powershell
# create DB and user (run in psql shell or use -c)
psql -U postgres -h 127.0.0.1 -c "CREATE DATABASE movie_recommendation;"
psql -U postgres -h 127.0.0.1 -c "CREATE USER movieuser WITH PASSWORD 'moviepass123';"
psql -U postgres -h 127.0.0.1 -c "GRANT ALL PRIVILEGES ON DATABASE movie_recommendation TO movieuser;"
```

If you prefer use existing postgres user (`postgres`), skip creating user and grant.

2. Backend — install & run
   Open PowerShell in Backend folder:

```powershell
cd "ReelPrompt\Backend"

# install dependencies
npm install

# create .env (see example below) and set real values
# run DB migrations
npm run migrate

# (optional) create admin user
npm run create:admin

# start backend in dev
npm run dev
# or production
npm start
```

Notes:

- `npm run migrate` uses `sequelize-cli`. If it fails, run the helper script:
  ```powershell
  node migrate.js
  ```
- If migrations or DB connection fail, confirm values in Backend\.env and Postgres is running.

3. Frontend — install & run
   Open PowerShell in Client folder:

```powershell
cd "ReelPrompt\Client"

# install deps
npm install

# add client .env (see example below) if needed
# start dev server (Vite)
npm run dev
```

- Default Vite URL: http://localhost:5173
- If `npm run dev` fails with "Cannot find module ... vite", run `npm install` inside Client.

4. .env files (examples)

- Backend: create `ReelPrompt\Backend\.env` with real values. Example provided below.

5. Common commands

- Reset DB (development): drop DB, recreate, then `npm run migrate`
- Run tests (backend): `npm test`
- Build frontend: inside Client `npm run build` then `npm run preview`

6. Troubleshooting

- DB auth errors: ensure DB_USER/DB_PASSWORD match and Postgres is reachable at DB_HOST:DB_PORT.
- migrations fail: check `config/database.json` and `.sequelizerc`.
- Backend "No token provided": authenticate via /api/auth/signin and use returned JWT in `Authorization: Bearer <token>`.
- Frontend Vite missing: run `npm install` inside Client.
- If AI suggestion model crashes with memory errors: suggestionService batches or reduce pool size (see Services/suggestionService.js).

7. API docs

- After backend is running, view Swagger UI: http://localhost:5000/api-docs
- Health: http://localhost:5000/health

8. Useful file locations

- Backend server: ReelPrompt\Backend\server.js
- Backend migrations: ReelPrompt\Backend\migrations
- Frontend entry: ReelPrompt\Client\src\main.jsx
