# AI Resume Screening System

An end-to-end AI-powered Applicant Tracking System built with FastAPI, React, spaCy, Sentence Transformers, and SQLite/PostgreSQL support.

## Features

- Upload one or many PDF resumes
- Parse resume text with PyMuPDF
- Extract skills, education, and experience from resumes
- Rank candidates against a job description using:
  - Skill match: 40%
  - Experience relevance: 30%
  - Semantic similarity: 30%
- Explain candidate ranking with matched and missing skills
- View, download, and delete uploaded resumes
- React dashboard for resume management and candidate ranking

## Tech Stack

- Backend: FastAPI, SQLAlchemy, Pydantic
- Frontend: React, Vite, Axios
- NLP: spaCy
- AI Matching: Sentence Transformers (`all-MiniLM-L6-v2`)
- Database: SQLite by default, PostgreSQL supported through `DATABASE_URL`

## Project Structure

```text
.
|-- backend/
|   |-- config.py
|   |-- database.py
|   |-- dependencies.py
|   |-- main.py
|   `-- requirements.txt
|-- frontend/
|   |-- package.json
|   |-- vite.config.js
|   `-- src/
|-- models/
|-- routes/
|-- services/
|-- utils/
|-- resumes/
|-- db/
|-- requirements.txt
`-- start.bat
```

## API Overview

### Resume Management

- `POST /api/resumes/upload`
- `GET /api/resumes`
- `DELETE /api/resume/{id}`
- `GET /api/resume/{id}/download`

### ATS Workflow

- `POST /api/upload`
- `POST /api/rank`
- `GET /api/results`

### Job + Screening Routes

- `POST /api/jobs/upload`
- `GET /api/jobs`
- `POST /api/screening/process`
- `GET /api/screening/rankings/{job_id}`
- `POST /api/screening/match`

## Ranking Logic

Final score is computed as:

```text
score = 0.4 * skill_match + 0.3 * experience_relevance + 0.3 * semantic_similarity
```

The response includes:

- candidate name
- score
- matched skills
- missing skills
- explanation

## Local Setup

### Option 1: Start Everything With One Click

Run:

```bat
start.bat
```

This starts:

- Backend: `http://127.0.0.1:8000`
- Frontend: `http://localhost:5173`

### Option 2: Run Manually

Backend:

```bat
venv\Scripts\activate
uvicorn backend.main:app --reload
```

Frontend:

```bat
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file if you want to override defaults:

```env
DATABASE_URL=sqlite:///./resume_screening.db
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
RESUME_DIR=./resumes
JOB_DIR=./backend/storage/jobs
SPACY_MODEL=en_core_web_sm
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
```

To use PostgreSQL instead of SQLite:

```env
DATABASE_URL=postgresql+psycopg2://username:password@localhost:5432/resume_screening
```

## Notes

- Resume files are stored in the `resumes/` directory.
- SQLite is the default for local development to reduce setup friction.
- If the spaCy English model is missing, install it with:

```bat
venv\Scripts\python -m spacy download en_core_web_sm
```

## Deployment

### Frontend on Vercel

Deploy the `frontend/` directory as the Vercel project root.

Set this environment variable in Vercel:

```env
VITE_API_URL=https://your-render-backend.onrender.com/api
```

Notes:

- `frontend/vercel.json` is included so SPA routes rewrite to `index.html`
- Build command: `npm run build`
- Output directory: `dist`

### Backend on Render

The repo includes `render.yaml` for the FastAPI backend plus a PostgreSQL database.

Important Render environment values:

```env
CORS_ORIGINS=https://your-vercel-project.vercel.app,http://localhost:5173,http://127.0.0.1:5173
RESUME_DIR=/var/data/resumes
JOB_DIR=/var/data/jobs
SPACY_MODEL=en_core_web_sm
SENTENCE_TRANSFORMER_MODEL=all-MiniLM-L6-v2
```

Notes:

- `DATABASE_URL` is provided automatically from the Render PostgreSQL instance in `render.yaml`
- uploaded resumes are stored on the attached Render disk mounted at `/var/data`
- backend health check path is `/api/health`
- startup command is:

```text
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
```

## Frontend Dashboard

The React dashboard supports:

- uploading job descriptions
- uploading multiple resumes
- processing and ranking candidates
- filtering by skill
- viewing uploaded resumes
- deleting resumes
- downloading original resume files

## License

This project is provided for educational and portfolio use.
