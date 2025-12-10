from PIL import Image, ImageOps
import io
import numpy as np

class PreprocessingService:
    def preprocess(self, image_bytes: bytes) -> Image.Image:
        """
        Preprocesses the image for consistent analysis.
        - Converts to RGB
        - Resizes to standard size (e.g., 224x224 for CLIP) - *actually we keep it larger for OCR, let CLIP handle its own resize*
        - Normalizes orientation
        """
        try:
            image = Image.open(io.BytesIO(image_bytes))
            
            # Handle orientation from EXIF
            image = ImageOps.exif_transpose(image)
            
            # Convert to RGB (remove alpha channel if present)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # We don't resize here for EVERYTHING because OCR needs high res.
            # But we can return a standard "analysis ready" image object.
            return image
        except Exception as e:
            print(f"Preprocessing error: {e}")
            raise e

preprocessing_service = PreprocessingService()
