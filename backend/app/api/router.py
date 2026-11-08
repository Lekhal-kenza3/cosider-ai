"""Point d'entrée des routes. Chaque module ajoutera son routeur ici."""
from fastapi import APIRouter
from app.api.routes import health

api_router = APIRouter(prefix="/api")
api_router.include_router(health.router)
# À venir : auth, documents, chat, dashboard, settings
