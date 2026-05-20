-- Extensiones necesarias para UNIS+
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";    -- UUIDs como primary keys
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Búsqueda full-text con trigrams
CREATE EXTENSION IF NOT EXISTS "unaccent";     -- Búsqueda sin tildes (importante para español)

-- Esquema de la aplicación separado del público
CREATE SCHEMA IF NOT EXISTS app;