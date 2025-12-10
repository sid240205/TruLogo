from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store
from app.services.heatmap_service import heatmap_service
from app.services.metadata_service import metadata_service
from app.services.safety_service import safety_service
from app.services.remedy_engine import remedy_engine
from app.services.regeneration_service import regeneration_service
from typing import Optional
import json

router = APIRouter()

@router.post("/analyze/logo")
async def analyze_logo(file: UploadFile = File(...)):
    try:
        # Read file content
        content = await file.read()
        
        # --- Layer 1: Preprocessing ---
        # Note: We use the raw bytes for some services to avoid re-encoding loss, 
        # but PreprocessingService ensures we can handle the image format.
        # In a full pipeline, we might save the preprocessed image to a temp file here.
        from app.services.preprocessing_service import preprocessing_service
        # Verify image is valid
        preprocessing_service.preprocess(content)

        # --- Layer 2: Visual Fingerprinting ---
        # Generate pHash for duplicate detection
        phash = embedding_service.get_phash(content)
        
        # --- Layer 3: Deep Visual Semantic Analysis (CLIP) ---
        # Generate CLIP embedding
        image_embedding = embedding_service.get_image_embedding(content)
        # Search vector store for visual matches
        visual_matches = vector_store.search_image(image_embedding)
        
        # Generate Heatmap (Visual Interpretation)
        heatmap_b64 = heatmap_service.generate_heatmap(content)
        
        # --- Layer 4: Textual & Semantic Analysis (OCR + SBERT) ---
        from app.services.ocr_service import ocr_service
        # Extract text from logo
        extracted_text_image = Image.open(io.BytesIO(content))
        detected_text = ocr_service.extract_text(extracted_text_image)
        
        text_matches = []
        text_score = 0
        if detected_text:
            # Generate SBERT embedding for extracted text
            text_embedding = embedding_service.get_text_embedding(detected_text)
            # Search vector store for text matches
            text_matches = vector_store.search_text(text_embedding)
            
            # Calculate simple text score (max similarity found)
            if text_matches:
                # Convert distance to similarity roughly
                # Distances are L2. Lower is better. 
                # Very rough approximation for now.
                best_text_dist = text_matches[0]['score']
                text_score = max(0, (1 - best_text_dist) * 100) # heuristic
        
        # --- Layer 5: Risk & Legal Scoring ---
        # Metadata
        metadata = metadata_service.extract_metadata(content, file.filename)
        metadata['ocr_text'] = detected_text
        
        # Safety
        safety_results = safety_service.check_safety(metadata)
        
        # Check for pHash match (duplicate)
        # We need to check if any visual match is a "duplicate"
        # Since vector store returns L2 distance, we can't directly compare pHash there 
        # unless stored. For now, we trust the Vector Score for similarity, 
        # but in a real DB we'd query by pHash. 
        # Let's assume high vector similarity (> 0.95 approx) implies duplicate for now.
        # Visual matches: score is L2 distance. 
        # similarity = 1 - (dist / 2)
        
        best_visual_sim = 0
        phash_match = False
        
        processed_matches = []
        if visual_matches:
            min_dist = visual_matches[0]['score']
            best_visual_sim = max(0, (1 - (min_dist / 2)) * 100)
            
            if best_visual_sim > 90:
                phash_match = True # Approximate "exact match" logic
                
            for res in visual_matches:
                sim = max(0, (1 - (res['score'] / 2)) * 100)
                res['similarity'] = round(sim, 2)
                res['type'] = 'visual'
                processed_matches.append(res)
                
        # Combine text matches
        for res in text_matches:
             # Heuristic conversion for text
             sim = max(0, (1 - res['score']) * 100) 
             res['similarity'] = round(sim, 2)
             res['type'] = 'text'
             processed_matches.append(res)
             
        # Sort all matches by similarity
        processed_matches.sort(key=lambda x: x['similarity'], reverse=True)
        
        # Calculate Risk
        from app.services.risk_engine import risk_engine
        
        risk_result = risk_engine.calculate_risk(
            visual_similarity_score=best_visual_sim,
            text_similarity_score=text_score,
            phash_match=phash_match,
            safety_flags=safety_results
        )
        
        remedy = remedy_engine.get_remedy(risk_result['score'], safety_results)

        return {
            "filename": file.filename,
            "risk_score": risk_result['score'],
            "risk_level": risk_result['level'],
            "risk_factors": risk_result['factors'],
            "risk_breakdown": risk_result['breakdown'],
            "phash": phash,
            "heatmap": heatmap_b64,
            "detected_text": detected_text,
            "similar_marks": processed_matches[:5], # Top 5 mixed
            "metadata": metadata,
            "safety": safety_results,
            "remedy": remedy
        }
    except Exception as e:
        print(f"Error in analyze_logo: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/logo")
async def generate_logo(file: UploadFile = File(...), risk_score: float = Form(...)):
    try:
        content = await file.read()
        variants = regeneration_service.generate_alternatives(content, risk_score)
        return {"variants": variants}
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
