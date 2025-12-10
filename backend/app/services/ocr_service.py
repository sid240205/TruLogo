import easyocr
import numpy as np
from PIL import Image

class OCRService:
    def __init__(self):
        # Initialize reader for English. 'gpu=False' if no GPU, but let's try auto.
        # Note: Initializing this might take time on first run as it downloads models.
        try:
            self.reader = easyocr.Reader(['en']) 
        except Exception as e:
            print(f"Failed to initialize EasyOCR: {e}")
            self.reader = None

    def extract_text(self, image: Image.Image) -> str:
        """
        Extracts text from a PIL Image.
        """
        if not self.reader:
            return ""

        try:
            # EasyOCR expects numpy array or file path
            img_np = np.array(image)
            
            # Detail=0 gives simple list of text
            results = self.reader.readtext(img_np, detail=0)
            
            # Join all detected text
            extracted_text = " ".join(results)
            return extracted_text.strip()
        except Exception as e:
            print(f"OCR extraction error: {e}")
            return ""

ocr_service = OCRService()
