
"""Point d'entrée des routes de COSIDER AI."""

from fastapi import APIRouter
from app.api.routes import health, documents

api_router = APIRouter(prefix="/api")

# Route pour vérifier le fonctionnement du serveur
api_router.include_router(health.router)

# Route pour importer les documents PDF
api_router.include_router(documents.router)

