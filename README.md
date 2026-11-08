# COSIDER AI – Assistant Intelligent Documentaire

Projet Master 1 IA. Deux applications indépendantes : `backend/` (FastAPI) et `frontend/` (Vue 3 + Tailwind).
État actuel : **squelette (Étape 3)** – aucune fonctionnalité métier, structure et configuration uniquement.

## Prérequis
Python 3.11+, Node.js 20+, Docker (PostgreSQL), Ollama (plus tard, pour les LLM locaux).

## Lancer le backend
```bash
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows : .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```
Vérification : http://localhost:8000/api/health – documentation : http://localhost:8000/docs

## Lancer le frontend
```bash
cd frontend
npm install
npm run dev
```
Application : http://localhost:5173 (le proxy Vite redirige `/api` vers le backend).

## Base de données
```bash
docker compose up -d postgres
```

## Feuille de route
Voir le cahier des charges (semaines 3 à 9 : développement, 10 à 11 : évaluation).
