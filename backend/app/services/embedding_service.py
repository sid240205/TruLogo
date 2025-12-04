import torch
from sentence_transformers import SentenceTransformer
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io

import imagehash

class EmbeddingService:
    def __init__(self):
        # Load SBERT for text
        self.text_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Load CLIP for images
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    def get_text_embedding(self, text: str):
        """Generate embedding for text using SBERT."""
        return self.text_model.encode(text).tolist()

    def get_image_embedding(self, image_bytes: bytes):
        """Generate embedding for image using CLIP."""
        image = Image.open(io.BytesIO(image_bytes))
        inputs = self.clip_processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            image_features = self.clip_model.get_image_features(**inputs)
        
        # Normalize
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        return image_features[0].tolist()

    def get_phash(self, image_bytes: bytes) -> str:
        """Generate perceptual hash for image."""
        image = Image.open(io.BytesIO(image_bytes))
        return str(imagehash.phash(image))

# Singleton instance
embedding_service = EmbeddingService()
