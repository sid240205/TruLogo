import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from PIL import Image
import io
import numpy as np
import os

client = TestClient(app)

def create_dummy_image():
    """Create a simple dummy image for testing."""
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    return img_byte_arr.getvalue()

def test_phash_generation():
    """Test that pHash is generated correctly."""
    img_bytes = create_dummy_image()
    phash = embedding_service.get_phash(img_bytes)
    assert isinstance(phash, str)
    assert len(phash) > 0

def test_vector_store_persistence():
    """Test that vector store saves and loads correctly."""
    # Add dummy data
    vector = np.random.rand(512).astype('float32')
    vector_store.add_image("test_id", vector, {"test": "data"})
    
    # Check if files exist
    assert os.path.exists("vector_store.index_image")
    assert os.path.exists("vector_store.index.meta")
    
    # Reload
    vector_store.load_index()
    assert vector_store.image_index.ntotal > 0

def test_analyze_logo_endpoint():
    """Test the /analyze/logo endpoint."""
    img_bytes = create_dummy_image()
    response = client.post(
        "/api/v1/analyze/logo",
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    assert response.status_code == 200
    data = response.json()
    assert "phash" in data
    assert "risk_score" in data
    assert "heatmap" in data
