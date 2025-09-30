# Site Web CDHPE avec Intégration Supabase

Site web moderne pour le **Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement (CDHPE)** avec intégration complète Supabase et dashboard administrateur sécurisé.

## 🌟 Nouvelles Fonctionnalités

### Intégration Supabase Complète
- **Base de données** : Publications, événements, participants, messages, médias
- **Stockage** : Upload de fichiers (images, vidéos, audio, documents)
- **Sécurité** : Row Level Security (RLS) et politiques d'accès
- **Temps réel** : Synchronisation automatique des données

### Dashboard Admin Sécurisé
- **Authentification** : Protection par mot de passe unique
- **Gestion Publications** : Création, édition, suppression avec éditeur WYSIWYG
- **Gestion Événements** : Organisation complète des événements
- **Galerie Multimédia** : Upload et gestion des fichiers
- **Participants** : Suivi des inscriptions avec emails automatiques
- **Messages** : Réception et gestion des contacts
- **Logs** : Journal des activités administrateur

### Fonctionnalités Publiques
- **Inscriptions Événements** : Formulaire avec confirmation email
- **Contact** : Formulaires de contact avec stockage en base
- **Informations Bancaires** : Gestion dynamique des moyens de paiement
- **Responsive** : Design adaptatif mobile/desktop

## 🚀 Installation et Configuration

### Prérequis
- Node.js (version 18 ou plus récente)
- Compte Supabase
- Service email (SMTP ou SendGrid)

### 1. Installation du Projet

```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd cdhpe-website

# Installer les dépendances
npm install
```

### 2. Configuration Supabase

#### A. Créer un Projet Supabase
1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez l'URL du projet et la clé anonyme

#### B. Créer les Tables
1. Ouvrez l'éditeur SQL dans votre dashboard Supabase
2. Copiez et exécutez le contenu du fichier `schema.sql`
3. Vérifiez que toutes les tables sont créées

#### C. Configurer le Stockage
1. Allez dans Storage > Buckets
2. Créez un bucket nommé `media`
3. Configurez-le comme public ou avec des URLs signées selon vos besoins

#### D. Configurer les Politiques RLS
Les politiques sont automatiquement créées par le script `schema.sql`. Vérifiez dans Authentication > Policies.

### 3. Configuration des Variables d'Environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_role

# Admin Security
VITE_ADMIN_PASSWORD=votre_mot_de_passe_admin_securise

# Email Configuration (choisir une option)
# Option 1: SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app

# Option 2: SendGrid
SENDGRID_API_KEY=votre_cle_sendgrid

# Application
VITE_APP_NAME=CDHPE
VITE_APP_URL=http://localhost:8080
```

### 4. Lancement en Développement

```bash
npm run dev
```

Le site sera accessible à `http://localhost:8080`

## 📊 Structure de la Base de Données

### Tables Principales

#### Publications
- Gestion des articles et actualités
- Support des médias (texte, image, vidéo, audio)
- Catégorisation et équipes
- Système de brouillons et publications

#### Events
- Gestion complète des événements
- Statuts (à venir, terminé)
- Types d'événements configurables
- Comptage automatique des participants

#### Participants
- Inscriptions aux événements
- Confirmation par email
- Suivi des participations

#### Media
- Stockage des métadonnées des fichiers
- Intégration avec Supabase Storage
- Support multi-formats

#### Messages
- Réception des formulaires de contact
- Suivi des demandes de participation
- Système de lecture/non-lu

### Relations
- Publications ↔ Catégories
- Publications ↔ Équipes
- Publications ↔ Médias
- Événements ↔ Types d'événements
- Événements ↔ Participants
- Événements ↔ Médias

## 🔐 Sécurité

### Row Level Security (RLS)
- **Lecture publique** : Publications publiées, événements, catégories
- **Écriture publique** : Inscriptions événements, messages de contact
- **Admin uniquement** : Création/modification/suppression du contenu

### Authentification Admin
- Mot de passe unique stocké dans les variables d'environnement
- Vérification côté client avant accès au dashboard
- Session temporaire (pas de persistance)

### Upload de Fichiers
- Validation des types MIME
- Limitation de taille (200MB par défaut)
- Stockage sécurisé dans Supabase Storage

## 📧 Configuration Email

### Option 1: SMTP (Gmail, Outlook, etc.)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre_email@gmail.com
SMTP_PASS=votre_mot_de_passe_app
```

### Option 2: SendGrid
```env
SENDGRID_API_KEY=SG.votre_cle_sendgrid
```

### Emails Automatiques
- **Confirmation d'inscription** : Envoyé automatiquement après inscription à un événement
- **Template personnalisable** : Nom du participant, détails de l'événement
- **Gestion des erreurs** : Logs des échecs d'envoi

## 🎨 Interface Admin

### Accès
- URL : `/admin`
- Authentification par mot de passe
- Interface responsive

### Fonctionnalités

#### Publications
- ✅ Création avec éditeur de texte
- ✅ Upload de médias
- ✅ Gestion des catégories
- ✅ Système de brouillons
- ✅ Articles à la une

#### Événements
- ✅ Création d'événements
- ✅ Gestion des types
- ✅ Upload d'images
- ✅ Mots-clés (jusqu'à 4)
- ✅ Suivi des participants

#### Médias
- ✅ Galerie complète
- ✅ Upload par glisser-déposer
- ✅ Prévisualisation
- ✅ Gestion des métadonnées

#### Messages
- ✅ Boîte de réception
- ✅ Marquage lu/non-lu
- ✅ Réponse par email

#### Participants
- ✅ Liste par événement
- ✅ Export CSV (à implémenter)
- ✅ Renvoi d'emails de confirmation

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Configurer les variables d'environnement dans le dashboard Vercel
```

### Netlify
```bash
# Build
npm run build

# Déployer le dossier dist/
# Configurer les variables d'environnement dans Netlify
```

### Variables d'Environnement en Production
Assurez-vous de configurer toutes les variables d'environnement dans votre plateforme de déploiement :
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `VITE_ADMIN_PASSWORD`
- Variables email (SMTP ou SendGrid)

## 🔧 Développement

### Structure du Code
```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI (shadcn)
│   ├── FileUploader.tsx # Upload de fichiers
│   └── ...
├── pages/               # Pages de l'application
│   ├── Admin.tsx        # Dashboard administrateur
│   └── ...
├── services/            # Services et API
│   ├── supabaseClient.ts # Client Supabase
│   ├── apiService.ts    # Service API principal
│   └── apiClient.ts     # Client legacy (compatibilité)
└── ...
```

### Scripts Disponibles
```bash
npm run dev          # Développement
npm run build        # Build de production
npm run preview      # Prévisualisation du build
npm run lint         # Linting
```

### Ajout de Nouvelles Fonctionnalités

#### Nouvelle Table
1. Ajouter la table dans `schema.sql`
2. Créer l'interface TypeScript dans `supabaseClient.ts`
3. Ajouter les méthodes dans `apiService.ts`
4. Créer les composants d'interface

#### Nouveau Type de Média
1. Mettre à jour l'enum `media_type` dans la base
2. Ajouter la validation dans `FileUploader.tsx`
3. Mettre à jour les icônes et prévisualisations

## 🐛 Dépannage

### Erreurs Communes

#### "Missing Supabase environment variables"
- Vérifiez que `.env` contient `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`
- Redémarrez le serveur de développement

#### "Admin client not configured"
- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est définie
- Cette clé est nécessaire pour les opérations admin

#### Erreurs d'Upload
- Vérifiez que le bucket `media` existe dans Supabase Storage
- Vérifiez les permissions du bucket
- Contrôlez la taille des fichiers

#### Emails non envoyés
- Vérifiez la configuration SMTP/SendGrid
- Consultez les logs de l'application
- Testez la connexion email

### Logs et Debugging
- Les actions admin sont loggées dans la table `admin_logs`
- Utilisez les outils de développement du navigateur
- Consultez les logs Supabase dans le dashboard

## 📞 Support

Pour toute question ou problème :
- Consultez la documentation Supabase : [docs.supabase.com](https://docs.supabase.com)
- Issues GitHub : [Lien vers les issues]
- Email : contact@cdhpe.org

## 🔄 Migrations et Mises à Jour

### Mise à Jour de la Base de Données
1. Créez un nouveau fichier de migration dans `migrations/`
2. Testez sur un environnement de développement
3. Appliquez en production via l'éditeur SQL Supabase

### Sauvegarde
- Utilisez les outils de sauvegarde Supabase
- Exportez régulièrement les données importantes
- Testez la restauration

---

**CDHPE** - Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement  
*Ensemble pour un avenir juste et durable*

## 📋 Checklist de Déploiement

- [ ] Projet Supabase créé
- [ ] Tables créées avec `schema.sql`
- [ ] Bucket `media` configuré
- [ ] Variables d'environnement définies
- [ ] Service email configuré
- [ ] Tests des fonctionnalités admin
- [ ] Tests des inscriptions événements
- [ ] Tests d'upload de fichiers
- [ ] Vérification de la sécurité RLS
- [ ] Déploiement en production
- [ ] Tests post-déploiement