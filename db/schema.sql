CREATE TABLE IF NOT EXISTS candidates (
    id SERIAL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    storage_path VARCHAR(500),
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    resume_text TEXT NOT NULL,
    cleaned_text TEXT NOT NULL,
    skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    education JSONB NOT NULL DEFAULT '[]'::jsonb,
    experience_years DOUBLE PRECISION NOT NULL DEFAULT 0,
    experience_highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS job_descriptions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    source_filename VARCHAR(255),
    storage_path VARCHAR(500),
    description_text TEXT NOT NULL,
    cleaned_text TEXT NOT NULL,
    required_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    minimum_years_experience DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS screening_results (
    id SERIAL PRIMARY KEY,
    candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES job_descriptions(id) ON DELETE CASCADE,
    skill_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    experience_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    semantic_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    match_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    matched_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    missing_skills JSONB NOT NULL DEFAULT '[]'::jsonb,
    explanation JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_candidate_job_result UNIQUE (candidate_id, job_id)
);

CREATE INDEX IF NOT EXISTS idx_candidates_email ON candidates(email);
CREATE INDEX IF NOT EXISTS idx_jobs_title ON job_descriptions(title);
CREATE INDEX IF NOT EXISTS idx_screening_job_id ON screening_results(job_id);
