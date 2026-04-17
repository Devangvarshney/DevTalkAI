from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/english_coach"
    WHISPER_API_KEY: str = "dummy_whisper"
    GROQ_API_KEY: str = "dummy_groq"
    ELEVENLABS_API_KEY: str = "dummy_elevenlabs"

    class Config:
        env_file = ".env"

settings = Settings()
