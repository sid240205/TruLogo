from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.services.heatmap_service import heatmap_service
from typing import Optional

router = APIRouter()

@router.post("/analyze/logo")
async def analyze_logo(file: UploadFile = File(...)):
    try:
        content = await file.read()
        embedding = embedding_service.get_image_embedding(content)
        phash = embedding_service.get_phash(content)
        heatmap_b64 = heatmap_service.generate_heatmap(content)
        results = vector_store.search_image(embedding)
        
        # Calculate risk score based on similarity
        # FAISS IndexFlatL2 returns squared Euclidean distance
        # For normalized vectors: distance = 2 * (1 - cosine_similarity)
        # cosine_similarity = 1 - distance / 2
        
        risk_score = 0
        similar_marks = []
        
        if results:
            # Get the closest match score (smallest distance)
            min_distance = results[0]['score']
            
            # Convert squared L2 distance to cosine similarity
            # similarity ranges from -1 to 1
            similarity = 1 - (min_distance / 2)
            
            # Convert to percentage (0-100)
            # We only care about positive similarity for risk
            risk_score = max(0, similarity * 100)
            
            # Process all results
            for res in results:
                dist = res['score']
                sim = 1 - (dist / 2)
                res['similarity'] = max(0, sim) # Add similarity field
                similar_marks.append(res)
            
        return {
            "filename": file.filename,
            "risk_score": round(risk_score, 2),
            "phash": phash,
            "heatmap": heatmap_b64,
            "similar_marks": similar_marks
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/text")
async def analyze_text(text: str = Form(...)):
    try:
        embedding = embedding_service.get_text_embedding(text)
        results = vector_store.search_text(embedding)
        return {
            "text": text,
            "similar_marks": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
