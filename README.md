# Site Web CDHPE

Site web moderne pour le **Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement (CDHPE)** développé avec React, TypeScript, Tailwind CSS et Vite.

## 🌟 Fonctionnalités

- **Design moderne et responsive** : Interface élégante inspirée du logo bleu/vert du CDHPE
- **Navigation intuitive** : Accueil, Actualités, Événements, Nous soutenir
- **Système d'actualités** : Articles avec pagination, recherche et filtrage par catégorie
- **Gestion d'événements** : Événements à venir et passés avec système d'inscription
- **Formulaires de contact** : Pour les dons, bénévolat et partenariats
- **Architecture modulaire** : Composants réutilisables et code maintenable
- **Accessibilité** : Balises sémantiques, navigation clavier, contrastes optimisés
- **SEO optimisé** : Meta tags, structure sémantique, URLs propres

## 🚀 Installation et Développement

### Prérequis
- Node.js (version 16 ou plus récente)
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone [URL_DU_REPO]
cd cdhpe-website

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le site sera accessible à l'adresse `http://localhost:8080`

### Scripts disponibles
```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint

# Vérification TypeScript
npm run type-check
```

## 🏗️ Architecture du Projet

```
src/
├── components/           # Composants réutilisables
│   ├── ui/              # Composants UI de base (shadcn)
│   ├── Header.tsx       # En-tête avec navigation
│   ├── Footer.tsx       # Pied de page
│   ├── Hero.tsx         # Section héros
│   ├── NewsCard.tsx     # Carte d'actualité
│   └── EventCard.tsx    # Carte d'événement
├── pages/               # Pages de l'application
│   ├── Index.tsx        # Page d'accueil
│   ├── Actualites.tsx   # Liste des actualités
│   ├── ArticleDetail.tsx # Détail d'un article
│   ├── Evenement.tsx    # Liste des événements
│   └── NousSoutenir.tsx # Page de soutien
├── services/            # Services et API
│   └── apiClient.ts     # Client API (prêt pour Supabase)
├── data/               # Données JSON (temporaire)
│   ├── news.json       # Articles d'actualité
│   └── events.json     # Événements
└── hooks/              # Hooks React personnalisés
```

## 🎨 Système de Design

Le site utilise un système de design basé sur les couleurs du logo CDHPE :
- **Primaire** : Bleu CDHPE (#2BB5CE approximatif)
- **Secondaire** : Vert CDHPE (#4ADE80 approximatif)
- **Dégradés** : Transitions harmonieuses bleu vers vert
- **Typographie** : System fonts avec hiérarchie claire
- **Espacement** : Grille cohérente basée sur Tailwind CSS

### Composants UI
- Utilisation de shadcn/ui pour les composants de base
- Variantes personnalisées avec les couleurs CDHPE
- Animations subtiles et transitions fluides
- Focus sur l'accessibilité et l'expérience utilisateur

## 📱 Responsive Design

Le site s'adapte à tous les écrans :
- **Mobile** : Navigation hamburger, cartes empilées, contenu optimisé
- **Tablette** : Grilles adaptatives, navigation simplifiée
- **Desktop** : Layout complet, navigation horizontale, grilles multi-colonnes

## 🔗 Intégration Future avec Supabase

Le code est préparé pour une intégration facile avec Supabase :
- Structure des données compatible
- Client API abstrait (voir `src/services/apiClient.ts`)
- Types TypeScript définis
- Variables d'environnement configurées (voir `.env.example`)

### Fonctionnalités Supabase prévues :
- Authentification des administrateurs
- Base de données pour actualités et événements
- Système de commentaires
- Gestion des inscriptions aux événements
- Envoi d'emails automatisés

## 🌐 SEO et Performance

- **Meta tags** optimisés pour le référencement
- **Structure sémantique** HTML5
- **Images optimisées** avec attributs alt
- **URLs propres** et lisibles
- **Chargement rapide** grâce à Vite
- **Bundle optimisé** pour la production

## 🤝 Contribution

Pour contribuer au projet :
1. Forkez le repository
2. Créez une branche pour votre feature (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Email : contact@cdhpe.org
- Issues GitHub : [Lien vers les issues]

---

**CDHPE** - Comité de Défense des Droits de l'Homme et de la Protection de l'Environnement  
*Ensemble pour un avenir juste et durable*
