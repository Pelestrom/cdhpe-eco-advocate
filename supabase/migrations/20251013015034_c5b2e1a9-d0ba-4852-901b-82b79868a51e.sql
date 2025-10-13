-- Créer les tables de référence
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.event_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nom text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Activer RLS sur les nouvelles tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_types ENABLE ROW LEVEL SECURITY;

-- Policies pour categories (lecture publique, écriture admin)
CREATE POLICY "Catégories lisibles par tous" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins peuvent insérer catégories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins peuvent modifier catégories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Admins peuvent supprimer catégories" ON public.categories FOR DELETE USING (true);

-- Policies pour teams
CREATE POLICY "Équipes lisibles par tous" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Admins peuvent insérer équipes" ON public.teams FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins peuvent modifier équipes" ON public.teams FOR UPDATE USING (true);
CREATE POLICY "Admins peuvent supprimer équipes" ON public.teams FOR DELETE USING (true);

-- Policies pour event_types
CREATE POLICY "Types événements lisibles par tous" ON public.event_types FOR SELECT USING (true);
CREATE POLICY "Admins peuvent insérer types" ON public.event_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins peuvent modifier types" ON public.event_types FOR UPDATE USING (true);
CREATE POLICY "Admins peuvent supprimer types" ON public.event_types FOR DELETE USING (true);

-- Ajouter des colonnes à publications
ALTER TABLE public.publications 
  ADD COLUMN IF NOT EXISTS categorie_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS equipe_id uuid REFERENCES public.teams(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type_media_principal text DEFAULT 'texte' CHECK (type_media_principal IN ('texte', 'image', 'video', 'audio'));

-- Migrer les données existantes de category (text) vers categorie_id
-- D'abord créer les catégories basées sur les valeurs existantes
INSERT INTO public.categories (nom)
SELECT DISTINCT category 
FROM public.publications 
WHERE category IS NOT NULL 
ON CONFLICT (nom) DO NOTHING;

-- Mettre à jour les publications avec les nouvelles références
UPDATE public.publications p
SET categorie_id = c.id
FROM public.categories c
WHERE p.category = c.nom;

-- Ajouter des colonnes à events
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS type_event_id uuid REFERENCES public.event_types(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS media_id uuid REFERENCES public.media(id) ON DELETE SET NULL;

-- Migrer les données existantes de type (text) vers type_event_id
INSERT INTO public.event_types (nom)
SELECT DISTINCT type 
FROM public.events 
WHERE type IS NOT NULL 
ON CONFLICT (nom) DO NOTHING;

UPDATE public.events e
SET type_event_id = et.id
FROM public.event_types et
WHERE e.type = et.nom;

-- Migrer tags vers keywords si nécessaire
UPDATE public.events
SET keywords = tags
WHERE tags IS NOT NULL AND keywords = '{}';

-- Créer une table support_info pour les informations de soutien
CREATE TABLE IF NOT EXISTS public.support_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL, -- 'bank', 'paypal', 'crypto', etc.
  nom text NOT NULL,
  details jsonb DEFAULT '{}',
  actif boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.support_info ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Info soutien lisible par tous" ON public.support_info FOR SELECT USING (actif = true);
CREATE POLICY "Admins peuvent gérer info soutien" ON public.support_info FOR ALL USING (true);

-- Créer une table admin_logs pour tracer les actions admin
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  action text NOT NULL,
  details jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins peuvent voir logs" ON public.admin_logs FOR SELECT USING (true);
CREATE POLICY "Système peut insérer logs" ON public.admin_logs FOR INSERT WITH CHECK (true);

-- Triggers pour updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_types_updated_at BEFORE UPDATE ON public.event_types
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_support_info_updated_at BEFORE UPDATE ON public.support_info
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Créer le bucket de stockage pour les médias
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Policies pour le bucket media
CREATE POLICY "Médias accessibles publiquement"
ON storage.objects FOR SELECT
USING (bucket_id = 'media');

CREATE POLICY "Utilisateurs authentifiés peuvent uploader"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs authentifiés peuvent mettre à jour"
ON storage.objects FOR UPDATE
USING (bucket_id = 'media' AND auth.role() = 'authenticated');

CREATE POLICY "Utilisateurs authentifiés peuvent supprimer"
ON storage.objects FOR DELETE
USING (bucket_id = 'media' AND auth.role() = 'authenticated');

-- Insérer quelques données de base
INSERT INTO public.categories (nom, description) VALUES
  ('Actualités', 'Actualités générales de l''organisation'),
  ('Droits Humains', 'Informations sur les droits de l''homme'),
  ('Environnement', 'Sujets environnementaux'),
  ('Éducation', 'Programmes éducatifs et formations')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO public.teams (nom, description) VALUES
  ('Équipe Communication', 'Équipe en charge de la communication'),
  ('Équipe Recherche', 'Équipe de recherche et documentation'),
  ('Direction', 'Direction de l''organisation')
ON CONFLICT (nom) DO NOTHING;

INSERT INTO public.event_types (nom, description) VALUES
  ('Atelier', 'Ateliers pratiques'),
  ('Conférence', 'Conférences et présentations'),
  ('Formation', 'Sessions de formation'),
  ('Réunion', 'Réunions et assemblées')
ON CONFLICT (nom) DO NOTHING;