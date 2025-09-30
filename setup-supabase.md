# Guide de Configuration Supabase pour CDHPE

Ce guide vous accompagne étape par étape pour configurer Supabase pour le site CDHPE.

## 1. Création du Projet Supabase

### Étape 1.1 : Créer un Compte
1. Allez sur [supabase.com](https://supabase.com)
2. Cliquez sur "Start your project"
3. Connectez-vous avec GitHub, Google ou créez un compte

### Étape 1.2 : Nouveau Projet
1. Cliquez sur "New Project"
2. Choisissez votre organisation
3. Remplissez les informations :
   - **Name** : `cdhpe-website`
   - **Database Password** : Générez un mot de passe fort
   - **Region** : Choisissez la région la plus proche (Europe West pour l'Afrique)
4. Cliquez sur "Create new project"

⏱️ **Attente** : La création prend 2-3 minutes

## 2. Configuration de la Base de Données

### Étape 2.1 : Accéder à l'Éditeur SQL
1. Dans votre projet Supabase, allez dans l'onglet "SQL Editor"
2. Cliquez sur "New query"

### Étape 2.2 : Exécuter le Script de Création
1. Copiez tout le contenu du fichier `schema.sql`
2. Collez-le dans l'éditeur SQL
3. Cliquez sur "Run" (ou Ctrl+Enter)

✅ **Vérification** : Vous devriez voir "Success. No rows returned" et toutes les tables créées dans l'onglet "Table Editor"

### Étape 2.3 : Vérifier les Tables Créées
Allez dans "Table Editor" et vérifiez que ces tables existent :
- `categories`
- `teams`
- `event_types`
- `media`
- `publications`
- `events`
- `participants`
- `messages`
- `support_info`
- `admin_logs`

## 3. Configuration du Stockage

### Étape 3.1 : Créer le Bucket Media
1. Allez dans l'onglet "Storage"
2. Cliquez sur "Create a new bucket"
3. Remplissez :
   - **Name** : `media`
   - **Public bucket** : ✅ Coché (pour l'accès public aux images)
4. Cliquez sur "Create bucket"

### Étape 3.2 : Configurer les Politiques du Bucket
1. Cliquez sur le bucket `media`
2. Allez dans l'onglet "Policies"
3. Cliquez sur "New policy"
4. Choisissez "For full customization"
5. Utilisez cette politique pour l'upload :

```sql
CREATE POLICY "Allow public uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'media');
```

6. Créez une autre politique pour la lecture :

```sql
CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'media');
```

## 4. Récupération des Clés API

### Étape 4.1 : Clés du Projet
1. Allez dans "Settings" > "API"
2. Notez ces informations :
   - **Project URL** : `https://votre-projet.supabase.co`
   - **anon public** : Clé publique pour le frontend
   - **service_role** : Clé privée pour les opérations admin

⚠️ **Important** : Ne partagez JAMAIS la clé `service_role` publiquement

### Étape 4.2 : Configuration du Fichier .env
Créez/modifiez votre fichier `.env` :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anon_publique
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role
VITE_ADMIN_PASSWORD=votre_mot_de_passe_admin_securise
```

## 5. Test de la Configuration

### Étape 5.1 : Test de Connexion
1. Lancez votre application : `npm run dev`
2. Ouvrez la console du navigateur (F12)
3. Allez sur la page d'accueil
4. Vérifiez qu'il n'y a pas d'erreurs de connexion Supabase

### Étape 5.2 : Test du Dashboard Admin
1. Allez sur `/admin`
2. Entrez votre mot de passe admin
3. Vérifiez que vous pouvez accéder au dashboard

### Étape 5.3 : Test d'Upload
1. Dans le dashboard admin, allez dans l'onglet "Médias"
2. Essayez d'uploader une image
3. Vérifiez qu'elle apparaît dans la galerie

## 6. Configuration Email (Optionnel)

### Option A : Gmail SMTP
1. Activez l'authentification à 2 facteurs sur votre compte Gmail
2. Générez un mot de passe d'application :
   - Allez dans "Gérer votre compte Google"
   - Sécurité > Mots de passe des applications
   - Générez un mot de passe pour "Mail"
3. Ajoutez dans `.env` :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
```

### Option B : SendGrid
1. Créez un compte sur [sendgrid.com](https://sendgrid.com)
2. Créez une clé API
3. Ajoutez dans `.env` :

```env
SENDGRID_API_KEY=SG.votre_cle_sendgrid
```

## 7. Sécurité et Bonnes Pratiques

### Étape 7.1 : Vérifier les Politiques RLS
1. Allez dans "Authentication" > "Policies"
2. Vérifiez que chaque table a ses politiques
3. Testez l'accès public (sans être connecté)

### Étape 7.2 : Sauvegardes
1. Allez dans "Settings" > "Database"
2. Configurez les sauvegardes automatiques
3. Testez une sauvegarde manuelle

### Étape 7.3 : Monitoring
1. Allez dans "Reports"
2. Surveillez l'utilisation de la base de données
3. Configurez des alertes si nécessaire

## 8. Déploiement en Production

### Étape 8.1 : Variables d'Environnement
Configurez les mêmes variables dans votre plateforme de déploiement :
- Vercel : Dashboard > Settings > Environment Variables
- Netlify : Site settings > Environment variables

### Étape 8.2 : Domaine Personnalisé (Optionnel)
1. Dans Supabase, allez dans "Settings" > "Custom Domains"
2. Configurez votre domaine personnalisé
3. Mettez à jour `VITE_SUPABASE_URL` avec votre domaine

## 9. Dépannage

### Problème : "Invalid API key"
- Vérifiez que les clés dans `.env` sont correctes
- Redémarrez le serveur de développement

### Problème : "Table doesn't exist"
- Vérifiez que le script `schema.sql` s'est exécuté sans erreur
- Regardez les logs dans l'onglet "Logs" de Supabase

### Problème : "Upload failed"
- Vérifiez que le bucket `media` existe
- Vérifiez les politiques de stockage
- Contrôlez la taille du fichier (limite par défaut : 50MB)

### Problème : "RLS policy violation"
- Vérifiez les politiques RLS dans "Authentication" > "Policies"
- Assurez-vous que les politiques permettent l'accès public nécessaire

## 10. Commandes Utiles

### Réinitialiser les Tables
```sql
-- Attention : Supprime toutes les données !
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
-- Puis ré-exécuter schema.sql
```

### Vider une Table
```sql
TRUNCATE TABLE nom_de_la_table RESTART IDENTITY CASCADE;
```

### Voir les Politiques Actives
```sql
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 📞 Support

Si vous rencontrez des problèmes :
1. Consultez les logs Supabase dans l'onglet "Logs"
2. Vérifiez la documentation officielle : [docs.supabase.com](https://docs.supabase.com)
3. Contactez le support technique

---

✅ **Configuration Terminée !** Votre instance Supabase est prête pour le site CDHPE.