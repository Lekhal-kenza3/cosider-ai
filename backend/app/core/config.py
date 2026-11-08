"""Configuration centralisée, lue depuis les variables d'environnement (.env)."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "COSIDER AI"
    debug: bool = False
    cors_origins: str = "http://localhost:5173"

    database_url: str = "postgresql://cosider:change_me@localhost:5432/cosider_ai"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 480

    storage_dir: str = "storage/documents"
    chroma_dir: str = "chroma_db"
    max_upload_mb: int = 25

    embedding_model: str = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
    ollama_base_url: str = "http://localhost:11434"
    llm_model: str = "qwen2.5:7b-instruct"
    chunk_size: int = 700
    chunk_overlap: int = 100
    top_k: int = 5
    similarity_threshold: float = 0.35

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
