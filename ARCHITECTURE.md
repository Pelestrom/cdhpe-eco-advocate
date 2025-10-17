# Architecture du Projet CDHPE

Ce document décrit l'organisation et le rôle de chaque fichier dans le projet CDHPE (Centre de Défense des Droits de la Personne Humaine et de l'Environnement).

## 📁 Structure du Projet

### Racine du Projet

- **`README.md`** : Documentation principale du projet avec instructions d'installation et utilisation
- **`.env`** : Variables d'environnement (clés API Supabase, configuration)
- **`package.json`** : Dépendances et scripts npm du projet
- **`vite.config.ts`** : Configuration du bundler Vite
- **`tailwind.config.ts`** : Configuration de Tailwind CSS (thème, couleurs, plugins)
- **`tsconfig.json`** : Configuration TypeScript

### `/src` - Code Source Principal

#### Fichiers Racine
- **`main.tsx`** : Point d'entrée de l'application React
- **`App.tsx`** : Composant racine avec routing et navigation
- **`App.css`** : Styles globaux de l'application
- **`index.css`** : Styles CSS de base et variables Tailwind

#### `/src/pages` - Pages de l'Application

- **`Index.tsx`** : Page d'accueil avec hero, événements, actualités
- **`Actualites.tsx`** : Page listant toutes les publications/actualités
- **`ArticleDetail.tsx`** : Page de détail d'une publication/article
- **`Evenement.tsx`** : Page de détail d'un événement avec inscription
- **`NousSoutenir.tsx`** : Page de contact et soutien (contact, participation, dons)
- **`Admin.tsx`** : Interface d'administration complète (gestion publications, événements, médias, etc.)
- **`NotFound.tsx`** : Page 404

#### `/src/components` - Composants Réutilisables

**Composants Principaux :**
- **`Header.tsx`** : En-tête de navigation avec menu
- **`Footer.tsx`** : Pied de page avec liens et informations
- **`Hero.tsx`** : Section hero de la page d'accueil
- **`EventCard.tsx`** : Carte d'affichage d'un événement
- **`NewsCard.tsx`** : Carte d'affichage d'une actualité
- **`FileUploader.tsx`** : Composant d'upload de fichiers pour l'admin

**`/src/components/ui/`** - Composants UI shadcn/ui :
Tous les composants d'interface réutilisables (boutons, dialogues, formulaires, etc.)
- `button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `textarea.tsx`
- `tabs.tsx`, `badge.tsx`, `switch.tsx`, `toast.tsx`, `toaster.tsx`
- `accordion.tsx`, `alert.tsx`, `calendar.tsx`, `checkbox.tsx`
- Et bien d'autres...

#### `/src/services` - Services et API

- **`apiService.ts`** : Service principal pour toutes les interactions avec Supabase
  - Gestion des publications (CRUD)
  - Gestion des événements (CRUD)
  - Gestion des inscriptions
  - Gestion des messages de contact
  - Gestion des médias (upload, suppression)
  - Gestion des catégories, équipes, types d'événements
  - Authentification admin

- **`apiClient.ts`** : Configuration du client API (si utilisé)
- **`supabaseClient.ts`** : Types et interfaces TypeScript pour les données Supabase

#### `/src/integrations/supabase` - Intégration Supabase

- **`client.ts`** : Client Supabase configuré avec les credentials
- **`types.ts`** : Types générés automatiquement depuis la base de données (READ-ONLY)

#### `/src/hooks` - Custom Hooks React

- **`use-toast.ts`** : Hook pour les notifications toast
- **`use-mobile.tsx`** : Hook pour détecter les écrans mobiles

#### `/src/lib` - Utilitaires

- **`utils.ts`** : Fonctions utilitaires (classNames, etc.)

#### `/src/data` - Données Statiques

- **`events.json`** : Données d'événements de démo/fallback
- **`news.json`** : Données d'actualités de démo/fallback

### `/public` - Fichiers Publics

- **`logo.jpg`** : Logo de l'organisation
- **`robots.txt`** : Fichier pour les robots d'indexation
- **Autres assets statiques**

### `/src/assets` - Assets de l'Application

- **`hero-presentation.jpg`** : Image hero de la page d'accueil
- **`events-section-bg.jpg`** : Image de fond section événements
- **`news-section-bg.jpg`** : Image de fond section actualités
- **`contact-bg.jpg`** : Image de fond page contact

### `/supabase` - Configuration Backend

- **`config.toml`** : Configuration du projet Supabase
- **`/migrations/`** : Migrations SQL de la base de données (READ-ONLY - générées automatiquement)

## 🗄️ Base de Données Supabase

### Tables Principales

1. **`publications`** : Articles et actualités
   - Champs : title, slug, summary, content, type, category, author, featured, published, image_url, etc.

2. **`events`** : Événements
   - Champs : title, description, date, time, location, status, max_participants, is_free, price, etc.

3. **`event_registrations`** : Inscriptions aux événements
   - Champs : event_id, name, email, status

4. **`contact_messages`** : Messages de contact
   - Champs : name, email, message, help_type, status

5. **`media`** : Fichiers médias uploadés
   - Champs : name, url, type, mime_type, size_bytes

6. **`categories`** : Catégories des publications

7. **`teams`** : Équipes de l'organisation

8. **`event_types`** : Types d'événements

9. **`support_info`** : Informations de soutien (dons, partenaires)

10. **`admin_logs`** : Logs des actions admin

### Storage

- **Bucket `media`** : Stockage des images et fichiers uploadés

## 🔑 Fonctionnalités Clés

### Frontend
- **React + TypeScript** : Application moderne et typée
- **Vite** : Build tool rapide
- **Tailwind CSS** : Styling avec design system
- **React Router** : Navigation SPA
- **shadcn/ui** : Bibliothèque de composants UI

### Backend (Supabase)
- **PostgreSQL** : Base de données relationnelle
- **Storage** : Stockage de fichiers
- **RLS (Row Level Security)** : Sécurité au niveau des lignes
- **API REST auto-générée** : Accès direct aux tables

### Admin
- Authentification par mot de passe
- CRUD complet pour publications, événements, catégories, équipes
- Gestion des médias avec upload
- Visualisation des inscriptions et messages
- Logs d'activité

## 🔄 Flux de Données

1. **Lecture** : `Page` → `apiService` → `Supabase` → Affichage
2. **Écriture Admin** : `Admin` → `apiService` → `Supabase` → Mise à jour UI
3. **Upload Média** : `FileUploader` → `apiService.adminUploadMedia()` → Supabase Storage → Database

## 🎨 Design System

- Couleurs définies dans `index.css` (variables CSS)
- Composants configurables via `tailwind.config.ts`
- Thème sombre/clair supporté
- Composants UI réutilisables dans `/components/ui`

## 🚀 Points d'Entrée

1. **Utilisateur** : `/` (Index.tsx) → Navigation via Header
2. **Admin** : `/admin` (Admin.tsx) → Connexion → Dashboard
3. **API** : `apiService.ts` → Toutes les méthodes d'accès aux données
