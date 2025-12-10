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
    business_name: str = Form(...),
    business_description: str = Form(...),
    business_type: str = Form("none"),
    color: str = Form("none")
):
    api_key = os.getenv("SLAZZER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Slazzer API Key not configured")

    url = "https://api.slazzer.com/v2.0/logo-generator" # Verify this endpoint in documentation
    
    headers = {
        "API-KEY": api_key
    }
    
    data = {
        "business_name": business_name,
        "business_description": business_description,
        "business_type": business_type,
        "color": color
    }

    async with httpx.AsyncClient() as client:
        try:
            # Note: Slazzer likely returns an image or a URL. 
            # If it returns binary, we might want to stream it or save it.
            # Assuming it returns binary image for now based on standard image gen APIs, 
            # or a JSON with url. Let's assume JSON with URL or check response content type.
            response = await client.post(url, headers=headers, data=data, timeout=30.0)
            response.raise_for_status()
            
            # Check content type
            content_type = response.headers.get("content-type", "")
            if "image" in content_type:
                # API returned an image directly
                from fastapi.responses import Response
                return Response(content=response.content, media_type=content_type)
            else:
                return response.json()
                
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=e.response.status_code, detail=f"Slazzer API Error: {e.response.text}")
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
