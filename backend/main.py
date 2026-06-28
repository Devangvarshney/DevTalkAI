from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import endpoints, auth
from app.core.config import settings
from fastapi.staticfiles import StaticFiles
app = FastAPI(title="AI English Speaking Coach API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=False, # Must be False if allow_origins is ["*"] to prevent browser CORS blocks
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(endpoints.router, prefix="/api/v1")
app.include_router(auth.router, prefix="/api/v1/auth")

@app.get("/")
def root():
    return {"message": "AI English Speaking Coach API Provider"}
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")