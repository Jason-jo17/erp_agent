# 🚀 Deployment Guide: Railway & Vercel

This guide will help you deploy the **Backend (Python/FatAPI)** to **Railway** and the **Frontend (React)** to **Vercel**.

---

## Part 1: Backend Deployment (Railway)

We will use Railway to host the Backend, Database (Postgres), Redis, and MongoDB.

### 1. Set up Railway Project
1.  Log in to [Railway.app](https://railway.app/).
2.  Click **"New Project"**.
3.  Select **"Deploy from GitHub repo"** and choose your repo: `Jason-jo17/erp_agent`.
4.  Adding the **Backend Service**:
    *   Railway might try to auto-detect the root. Since the backend is in a generic folder, you might need to configure it.
    *   Go to **Settings** > **Root Directory** and set it to `/backend`.
    *   Railway will detect the `Dockerfile`.
    *   **IMPORTANT**: In **Variables**, add the following (copy from your `.env.example` but set real values):
        *   `OPENAI_API_KEY` (or Google/OpenRouter keys)
        *   `PORT`: `8000`
        *   `SECRET_KEY`: Generate a random string.
        *   `NIXPACKS_PYTHON_VERSION`: `3.11` (optional, but good for stability)
    *   *Do not set DB variables yet, we will add them next.*

### 2. Add Databases (Postgres, Mongo, Redis)
In your Railway Project Canvas:
1.  Right-click (or click "New") -> **Database** -> **PostgreSQL**.
    *   This will automatically add `DATABASE_URL` , `PGUSER`, etc. variables to your project.
2.  Right-click -> **Database** -> **Redis**.
    *   This will add `REDIS_URL`.
3.  Right-click -> **Database** -> **MongoDB**.
    *   This will add `MONGO_URL`.

### 3. Link Variables to Backend
1.  Click on your **Backend** service card.
2.  Go to **Variables**.
3.  Railway usually "Shared Variables" automatically, but ensure:
    *   `DATABASE_URL` is set (Railway provides this).
    *   `MONGO_URL` is set.
    *   `REDIS_URL` is set.

### 4. Deploy
1.  Railway usually deploys automatically on push.
2.  Once "Active", click the service URL (e.g., `https://erp-agent-production.up.railway.app`).
3.  Add `/docs` to the end to verify Swagger UI is working.
4.  **Copy this URL**.

---

## Part 2: Frontend Deployment (Vercel)

We will use Vercel to host the React Frontend.

### 1. Import Project
1.  Log in to [Vercel.com](https://vercel.com/).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import `Jason-jo17/erp_agent`.

### 2. Configure Build
1.  **Framework Preset**: Vite (should be auto-detected).
2.  **Root Directory**: Click "Edit" and select `frontend`.
3.  **Environment Variables**:
    *   Add `VITE_API_URL` = `https://YOUR_RAILWAY_URL.up.railway.app` (The URL from Part 1).

### 3. Configure Proxy (Important!)
I have added a `vercel.json` file to the frontend.
1.  Go to your GitHub repo.
2.  Edit `frontend/vercel.json`.
3.  Change `https://YOUR_RAILWAY_BACKEND_URL.up.railway.app/api/:path*` to your **Actual Railway Backend URL**.
    *   *Example*: `https://web-production-1234.up.railway.app/api/:path*`
4.  Commit this change.

### 4. Deploy
1.  Vercel will build and deploy.
2.  Visit the Vercel URL.
3.  Test the chat. The requests should go from `Vercel` -> `Railway`.

---

## Troubleshooting
- **CORS Errors**: If you see CORS errors in the browser console, go to **Railway Dashboard** > **Backend Service** > **Variables** and add/update:
  ```
  BACKEND_CORS_ORIGINS=["https://your-vercel-app.vercel.app", "http://localhost:3010"]
  ```
  (The backend must explicitly allow the Vercel domain).
