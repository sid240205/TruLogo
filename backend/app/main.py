from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TruLogo API", version="0.1.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import analyze

app.include_router(analyze.router, prefix="/api/v1")
from app.api import search
app.include_router(search.router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": "Welcome to TruLogo API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
