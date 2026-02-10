# KAIRA / ALMATIQ

AI-powered muscle recovery landing page with KAIRA chat assistant.

## Prerequisites

- **Python 3.10+** with pip
- **Node.js 18+** and npm
- **MongoDB** (running locally on port 27017, or update `backend/.env`)

## Run the Application

### 1. Backend (Terminal 1)

```powershell
cd backend
pip install fastapi uvicorn motor python-dotenv httpx pydantic starlette
python -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Or use the run script:

```powershell
cd backend
.\run.ps1
```

### 2. Frontend (Terminal 2)

```powershell
cd frontend
npm install
npm start
```

Or:

```powershell
cd frontend
.\run.ps1
```

### 3. Open the App

- **Frontend:** http://localhost:3000  
- **Backend API docs:** http://localhost:8000/docs  

## Environment

- `backend/.env` — `MONGO_URL`, `DB_NAME`, `CORS_ORIGINS`
- `frontend/.env` — `REACT_APP_BACKEND_URL` (default: http://localhost:8000)

## MongoDB

If MongoDB is not running locally, the backend will fail on startup. To use MongoDB Atlas or another host, update `MONGO_URL` in `backend/.env`.
