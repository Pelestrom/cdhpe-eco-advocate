-- Ajout des politiques RLS pour le bucket media
-- Permet à tout le monde d'uploader des fichiers dans le bucket media (pour l'admin)
CREATE POLICY "Admins peuvent uploader dans media"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'media');

-- Permet la mise à jour des fichiers
CREATE POLICY "Admins peuvent modifier fichiers media"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'media');

-- Permet la suppression des fichiers
CREATE POLICY "Admins peuvent supprimer fichiers media"
ON storage.objects
FOR DELETE
USING (bucket_id = 'media');

-- Permet la lecture publique des fichiers
CREATE POLICY "Lecture publique fichiers media"
ON storage.objects
FOR SELECT
USING (bucket_id = 'media');