-- Create database if not exists
SELECT 'CREATE DATABASE movie_recommendation'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'movie_recommendation');

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin');
    END IF;
END $$;