import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.vector_store import vector_store
from unittest.mock import MagicMock
import numpy as np

client = TestClient(app)

def test_risk_score_calculation_high_risk():
    """Test that high similarity results in high risk score."""
    # Mock embedding service to return a dummy embedding
    # We can't easily mock the service inside the endpoint without dependency injection or patching
    # But we can mock the vector_store.search_image method which is what matters
    
    # Mock vector_store.search_image
    # Distance 0 means identical, so similarity 1.0, risk 100
    vector_store.search_image = MagicMock(return_value=[
        {"score": 0.0, "metadata": {"name": "Test Brand"}}
    ])
    
    # We need a dummy image
    from PIL import Image
    import io
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_bytes = img_byte_arr.getvalue()
    
    response = client.post(
        "/api/v1/analyze/logo",
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 100.0
    assert len(data["similar_marks"]) == 1
    assert data["similar_marks"][0]["similarity"] == 1.0

def test_risk_score_calculation_low_risk():
    """Test that low similarity results in low risk score."""
    # Distance 2.0 means opposite (if normalized), similarity 0.0, risk 0
    # Distance 1.0 means orthogonal, similarity 0.5, risk 50
    
    vector_store.search_image = MagicMock(return_value=[
        {"score": 1.0, "metadata": {"name": "Test Brand"}}
    ])
    
    # Create dummy image
    from PIL import Image
    import io
    img = Image.new('RGB', (100, 100), color = 'blue')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_bytes = img_byte_arr.getvalue()
    
    response = client.post(
        "/api/v1/analyze/logo",
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 50.0
    assert data["similar_marks"][0]["similarity"] == 0.5

def test_risk_score_no_matches():
    """Test that no matches results in 0 risk score."""
    vector_store.search_image = MagicMock(return_value=[])
    
    # Create dummy image
    from PIL import Image
    import io
    img = Image.new('RGB', (100, 100), color = 'green')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_bytes = img_byte_arr.getvalue()
    
    response = client.post(
        "/api/v1/analyze/logo",
        files={"file": ("test.png", img_bytes, "image/png")}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["risk_score"] == 0
    assert len(data["similar_marks"]) == 0
