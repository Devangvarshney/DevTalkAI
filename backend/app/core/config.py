from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://user:password@localhost/english_coach"
    WHISPER_API_KEY: str = "dummy_whisper"
    GROQ_API_KEY: str = "dummy_groq"
    
    # MongoDB Connection Configuration
    MONGO_URI: str = "mongodb://127.0.0.1:27017"
    DB_NAME: str = "english_speak"
    
    # Cloudinary Storage Configuration
    CLOUDINARY_CLOUD_NAME: str = ""
    CLOUDINARY_API_KEY: str = ""
    CLOUDINARY_API_SECRET: str = ""

    class Config:
        env_file = ".env"
        extra = "ignore" # Bypasses validation crashes for any other extra environment variables

settings = Settings()
