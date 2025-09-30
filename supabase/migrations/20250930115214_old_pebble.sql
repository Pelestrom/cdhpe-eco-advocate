-- CDHPE Database Schema for Supabase
-- Execute these commands in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE media_type AS ENUM ('image', 'video', 'audio', 'document');
CREATE TYPE publication_type AS ENUM ('texte', 'image', 'video', 'audio');
CREATE TYPE event_status AS ENUM ('a_venir', 'termine');
CREATE TYPE message_origin AS ENUM ('contact', 'participation');

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Event types table
CREATE TABLE IF NOT EXISTS event_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE IF NOT EXISTS media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nom_fichier TEXT NOT NULL,
    url TEXT NOT NULL,
    type media_type NOT NULL,
    taille BIGINT,
    mime_type TEXT,
    uploaded_by TEXT DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Publications table
CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    titre TEXT NOT NULL,
    chapeau TEXT NOT NULL,
    contenu_long TEXT NOT NULL,
    type_media_principal publication_type DEFAULT 'texte',
    date_publication TIMESTAMPTZ DEFAULT NOW(),
    categorie_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    equipe_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    featured BOOLEAN DEFAULT FALSE,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titre TEXT NOT NULL,
    description_long TEXT NOT NULL,
    statut event_status DEFAULT 'a_venir',
    date_debut TIMESTAMPTZ NOT NULL,
    date_fin TIMESTAMPTZ,
    heure TIME,
    lieu TEXT NOT NULL,
    type_event_id UUID REFERENCES event_types(id) ON DELETE SET NULL,
    keywords TEXT[] DEFAULT '{}',
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    participants_count INTEGER DEFAULT 0,
    max_participants INTEGER DEFAULT 100,
    prix TEXT,
    gratuit BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Participants table
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    inscription_date TIMESTAMPTZ DEFAULT NOW(),
    confirmed BOOLEAN DEFAULT FALSE,
    UNIQUE(event_id, email)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    origine message_origin NOT NULL,
    ref_id UUID, -- event_id if participation
    nom TEXT NOT NULL,
    email TEXT NOT NULL,
    sujet TEXT,
    message TEXT NOT NULL,
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Support info table (for "Nous soutenir" page)
CREATE TABLE IF NOT EXISTS support_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'bank', 'mobile_money', 'other'
    nom TEXT NOT NULL,
    details JSONB NOT NULL,
    actif BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_publications_slug ON publications(slug);
CREATE INDEX IF NOT EXISTS idx_publications_date ON publications(date_publication DESC);
CREATE INDEX IF NOT EXISTS idx_publications_category ON publications(categorie_id);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_debut DESC);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(statut);
CREATE INDEX IF NOT EXISTS idx_participants_event ON participants(event_id);
CREATE INDEX IF NOT EXISTS idx_messages_origine ON messages(origine);

-- Create functions for automatic slug generation
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN lower(
        regexp_replace(
            regexp_replace(
                regexp_replace(title, '[àáâãäå]', 'a', 'g'),
                '[èéêë]', 'e', 'g'
            ),
            '[^a-z0-9]+', '-', 'g'
        )
    );
END;
$$ LANGUAGE plpgsql;

-- Function to update participants count
CREATE OR REPLACE FUNCTION update_participants_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events 
        SET participants_count = participants_count + 1 
        WHERE id = NEW.event_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events 
        SET participants_count = participants_count - 1 
        WHERE id = OLD.event_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_publications_updated_at
    BEFORE UPDATE ON publications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_participants_count_trigger
    AFTER INSERT OR DELETE ON participants
    FOR EACH ROW
    EXECUTE FUNCTION update_participants_count();

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Insert default data
INSERT INTO categories (nom, description) VALUES
    ('Actualités', 'Actualités générales du CDHPE'),
    ('Droits Humains', 'Articles sur les droits de l''homme'),
    ('Environnement', 'Articles sur la protection environnementale'),
    ('Formation', 'Formations et ateliers')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO teams (nom, description) VALUES
    ('Équipe Communication', 'Responsable de la communication externe'),
    ('Équipe Juridique', 'Équipe d''accompagnement juridique'),
    ('Équipe Environnement', 'Spécialistes en protection environnementale'),
    ('Direction', 'Direction générale du CDHPE')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO event_types (nom, description) VALUES
    ('Conférence', 'Conférences et colloques'),
    ('Formation', 'Formations et ateliers pratiques'),
    ('Atelier', 'Ateliers participatifs'),
    ('Table ronde', 'Tables rondes et débats'),
    ('Action terrain', 'Actions sur le terrain'),
    ('Séminaire', 'Séminaires spécialisés')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO support_info (type, nom, details) VALUES
    ('bank', 'Compte Bancaire Principal', '{"banque": "Banque Centrale du Congo", "compte": "XXXX-XXXX-XXXX", "titulaire": "CDHPE"}'),
    ('mobile_money', 'Orange Money', '{"numero": "+243 XX XXX XXXX", "nom": "CDHPE"}'),
    ('mobile_money', 'Airtel Money', '{"numero": "+243 XX XXX XXXX", "nom": "CDHPE"}')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read published publications" ON publications
    FOR SELECT USING (published = true);

CREATE POLICY "Public can read events" ON events
    FOR SELECT USING (true);

CREATE POLICY "Public can read categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read teams" ON teams
    FOR SELECT USING (true);

CREATE POLICY "Public can read event types" ON event_types
    FOR SELECT USING (true);

CREATE POLICY "Public can read media" ON media
    FOR SELECT USING (true);

CREATE POLICY "Public can read support info" ON support_info
    FOR SELECT USING (actif = true);

-- Policies for participant registration
CREATE POLICY "Public can insert participants" ON participants
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can read own participation" ON participants
    FOR SELECT USING (true);

-- Policies for contact messages
CREATE POLICY "Public can insert messages" ON messages
    FOR INSERT WITH CHECK (true);

-- Note: Admin access will be handled through service role key in the backend
-- No public policies for admin operations (INSERT/UPDATE/DELETE on most tables)