from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends
from pydantic import BaseModel
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

class LogoGenRequest(BaseModel):
    business_name: str
    business_description: str
    business_type: str = "none"
    color: str = "red"

@router.post("/generate/logo")
async def generate_logo(
    request: LogoGenRequest
):
    business_name = request.business_name
    business_description = request.business_description
    business_type = request.business_type
    color = request.color
    from app.services.stable_diffusion import logo_generator
    from fastapi.responses import Response

    if not business_name:
        raise HTTPException(status_code=400, detail="Business name is required")

    try:
        # Construct a rich prompt
        prompt = f"Logo for {business_name}"
        if business_description:
            prompt += f", {business_description}"
        if business_type and business_type != "none":
            prompt += f", {business_type} industry"
        if color and color != "none":
            prompt += f", {color} color scheme"

        # Generate image
        # This is a blocking operation, efficiently handling it in async app requires running in threadpool if it takes time.
        # However, for simplicity in this prototype, we'll run it directly or offload if needed.
        # Since diffusers runs on CPU/GPU, it might block the event loop. 
        # For production, utilize run_in_executor.
        import asyncio
        from concurrent.futures import ThreadPoolExecutor
        
        # Run generation in a separate thread to avoid blocking the main loop
        loop = asyncio.get_event_loop()
        image_bytes = await loop.run_in_executor(None, logo_generator.generate, prompt)

        return Response(content=image_bytes, media_type="image/png")
                
    except Exception as e:
        print(f"Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
