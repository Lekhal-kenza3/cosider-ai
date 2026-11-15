
from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, UploadFile

router = APIRouter(prefix="/documents", tags=["Documents"])

# Dossier où nous allons enregistrer les PDF
STORAGE_DIR = Path(__file__).resolve().parents[3] / "storage" / "documents"
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 Mo


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Vérifier l'extension du fichier
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Seuls les fichiers PDF sont acceptés."
        )

    # Lire le fichier
    content = await file.read(MAX_FILE_SIZE + 1)

    # Vérifier sa taille
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=413,
            detail="Le PDF dépasse la limite de 10 Mo."
        )

    # Vérifier la signature du PDF
    if not content.startswith(b"%PDF-"):
        raise HTTPException(
            status_code=400,
            detail="Le fichier ne semble pas être un PDF valide."
        )

    # Créer un nom unique pour éviter les conflits
    filename = f"{uuid4().hex}.pdf"
    destination = STORAGE_DIR / filename

    # Enregistrer le PDF sur le serveur
    destination.write_bytes(content)

    return {
        "message": "Document importé avec succès",
        "filename": file.filename,
        "document_id": filename,
        "size": len(content)
    }
