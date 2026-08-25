export const DDL_STATEMENTS: string[] = [
  `CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS editions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordinal TEXT NOT NULL,
    year INTEGER NOT NULL,
    eyebrow TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    stats JSONB NOT NULL DEFAULT '[]'::jsonb,
    video_id TEXT,
    backdrop_url TEXT,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    labs JSONB NOT NULL DEFAULT '[]'::jsonb,
    speaker_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS speakers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT,
    company TEXT,
    image_url TEXT,
    checked_in_at TIMESTAMPTZ,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS labs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS schedule_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    time TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    tag TEXT NOT NULL DEFAULT 'Conferencia',
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS faq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
  )`,
  `DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('pendiente', 'aprobado', 'rechazado');
  EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    telefono TEXT NOT NULL,
    empresa TEXT NOT NULL,
    perfil TEXT NOT NULL,
    extras JSONB NOT NULL DEFAULT '{}'::jsonb,
    status registration_status NOT NULL DEFAULT 'pendiente',
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS registrations_email_unique ON registrations (email)`,
  `DO $$ BEGIN
    CREATE TYPE checkin_kind AS ENUM ('asistente', 'expositor');
  EXCEPTION WHEN duplicate_object THEN null; END $$`,
  `CREATE TABLE IF NOT EXISTS checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    kind checkin_kind NOT NULL,
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    speaker_id UUID REFERENCES speakers(id) ON DELETE CASCADE,
    note TEXT,
    checked_in_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`,
  `ALTER TABLE registrations ADD COLUMN IF NOT EXISTS access_code TEXT`,
  `ALTER TABLE editions ADD COLUMN IF NOT EXISTS logo_url TEXT`,
  `CREATE UNIQUE INDEX IF NOT EXISTS registrations_access_code_unique ON registrations (access_code)`,
  `ALTER TABLE speakers ADD COLUMN IF NOT EXISTS bio TEXT`,
  `ALTER TABLE speakers ADD COLUMN IF NOT EXISTS linkedin_url TEXT`,
  `ALTER TABLE speakers ADD COLUMN IF NOT EXISTS website_url TEXT`,
];
