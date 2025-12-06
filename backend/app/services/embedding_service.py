import torch
from sentence_transformers import SentenceTransformer
from transformers import CLIPProcessor, CLIPModel
from PIL import Image
import io
import tempfile
import os

# Import custom perceptual hashing module
from app.services.perceptual_hash import (
    PerceptualHasher,
    HashAlgorithm,
    hamming_distance,
    hash_to_hex,
    hex_to_hash,
    similarity_from_distance
)


class EmbeddingService:
    """
    Service for generating embeddings and perceptual hashes for images and text.
    
    Features:
    - CLIP embeddings for images (512-dim vectors)
    - SBERT embeddings for text (384-dim vectors)
    - Perceptual hashing with pHash, aHash, dHash algorithms
    - Hash comparison and similarity scoring
    """
    
    def __init__(self):
        # Load SBERT for text
        self.text_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Load CLIP for images
        self.clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
        self.clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        
        # Initialize perceptual hashers for each algorithm
        self._phash_hasher = PerceptualHasher(algorithm=HashAlgorithm.PHASH)
        self._ahash_hasher = PerceptualHasher(algorithm=HashAlgorithm.AHASH)
        self._dhash_hasher = PerceptualHasher(algorithm=HashAlgorithm.DHASH)

    def get_text_embedding(self, text: str):
        """Generate embedding for text using SBERT."""
        return self.text_model.encode(text).tolist()

    def get_clip_text_embedding(self, text: str):
        """Generate embedding for text using CLIP (for zero-shot image matching)."""
        inputs = self.clip_processor(text=[text], return_tensors="pt", padding=True)
        
        with torch.no_grad():
            text_features = self.clip_model.get_text_features(**inputs)
        
        # Normalize
        text_features = text_features / text_features.norm(p=2, dim=-1, keepdim=True)
        return text_features[0].tolist()

    def get_image_embedding(self, image_bytes: bytes):
        """Generate embedding for image using CLIP."""
        image = Image.open(io.BytesIO(image_bytes))
        inputs = self.clip_processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            image_features = self.clip_model.get_image_features(**inputs)
        
        # Normalize
        image_features = image_features / image_features.norm(p=2, dim=-1, keepdim=True)
        return image_features[0].tolist()

    def _hash_from_bytes(self, image_bytes: bytes, hasher: PerceptualHasher) -> str:
        """
        Generate perceptual hash from image bytes.
        
        The hasher expects a file path, so we write to a temp file.
        """
        with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as tmp:
            # Convert bytes to image and save
            image = Image.open(io.BytesIO(image_bytes))
            image.save(tmp.name, format='PNG')
            tmp_path = tmp.name
        
        try:
            result = hasher.hash_image(tmp_path)
            return result.hash_hex
        finally:
            # Clean up temp file
            os.unlink(tmp_path)

    def get_phash(self, image_bytes: bytes) -> str:
        """
        Generate DCT-based perceptual hash (pHash) for image.
        
        Most robust algorithm - good for detecting resized, cropped, or 
        slightly modified images.
        
        Returns:
            16-character hex string representing 64-bit hash
        """
        return self._hash_from_bytes(image_bytes, self._phash_hasher)

    def get_ahash(self, image_bytes: bytes) -> str:
        """
        Generate average hash (aHash) for image.
        
        Fastest algorithm but less robust to modifications.
        
        Returns:
            16-character hex string representing 64-bit hash
        """
        return self._hash_from_bytes(image_bytes, self._ahash_hasher)

    def get_dhash(self, image_bytes: bytes) -> str:
        """
        Generate difference hash (dHash) for image.
        
        Good for detecting gradients, less sensitive to brightness changes.
        
        Returns:
            16-character hex string representing 64-bit hash
        """
        return self._hash_from_bytes(image_bytes, self._dhash_hasher)

    def get_all_hashes(self, image_bytes: bytes) -> dict:
        """
        Generate all three perceptual hashes for an image.
        
        Returns:
            Dict with 'phash', 'ahash', 'dhash' keys
        """
        return {
            'phash': self.get_phash(image_bytes),
            'ahash': self.get_ahash(image_bytes),
            'dhash': self.get_dhash(image_bytes)
        }

    def compare_hashes(self, hash1: str, hash2: str) -> dict:
        """
        Compare two perceptual hashes and return similarity metrics.
        
        Args:
            hash1: First hash (hex string)
            hash2: Second hash (hex string)
            
        Returns:
            Dict with 'distance' (0-64) and 'similarity' (0.0-1.0)
        """
        h1 = hex_to_hash(hash1)
        h2 = hex_to_hash(hash2)
        distance = hamming_distance(h1, h2)
        
        return {
            'distance': distance,
            'similarity': similarity_from_distance(distance),
            'is_likely_duplicate': distance <= 10,
            'is_exact_match': distance == 0
        }


# Singleton instance
embedding_service = EmbeddingService()

