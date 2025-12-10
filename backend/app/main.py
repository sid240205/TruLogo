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
from app.api import dashboard
from app.core.database import engine
from app.models.base import Base

app.include_router(analyze.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
from app.api import search
app.include_router(search.router, prefix="/api/v1")

from app.api.endpoints import generate
app.include_router(generate.router, prefix="/api/v1")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        # Create all tables if they don't exist
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Welcome to TruLogo API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
