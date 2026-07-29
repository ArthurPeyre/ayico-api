-- Up Migration
CREATE SCHEMA IF NOT EXISTS authentication;

CREATE TABLE authentication.users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Down Migration
DROP SCHEMA IF EXISTS authentication CASCADE;