from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from pathlib import Path

# Explicitly load .env from backend root
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# Default to a local postgres url if not set
DATABASE_URL = os.getenv("DATABASE_URL")

print(f"DEBUG: Loaded .env from {env_path}")
print(f"DEBUG: DATABASE_URL is set: {bool(DATABASE_URL)}")
if DATABASE_URL:
    # Mask password for safety
    masked_url = DATABASE_URL.replace(DATABASE_URL.split(":")[2].split("@")[0], "****") if ":" in DATABASE_URL and "@" in DATABASE_URL else "INVALID_FORMAT"
    print(f"DEBUG: Active Database URL: {masked_url}")
else:
    print("DEBUG: Using default localhost URL (which is likely failing)")
    DATABASE_URL = "postgresql+asyncpg://postgres:password@localhost/msme_db"

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
