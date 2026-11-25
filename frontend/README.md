# SmartCampus - Interface web (React)

React 18 + TypeScript + Vite. Pages : connexion, création de compte, tableau de bord protégé.

## Lancer en développement
1. Démarrer le backend (port 8082) : `docker compose up --build -d`
2. `cd frontend && npm install && npm run dev` puis ouvrir http://localhost:5173
   (les appels `/api` sont relayés vers http://localhost:8082 par Vite, donc pas de CORS à configurer).

## Scripts
- `npm run build` : build de production dans `dist/`
- `npm test` : tests (Vitest + Testing Library)

## Sécurité
Le jeton JWT est gardé dans `sessionStorage` (un seul onglet), la session est fermée automatiquement à l'expiration du jeton.
