import numpy as np
from PIL import Image
import io
import base64

class HeatmapService:
    def generate_heatmap(self, image_bytes: bytes) -> str:
        """
        Generates a heatmap overlay for the given image.
        For MVP, this generates a dummy heatmap (e.g., center focus).
        In production, use Grad-CAM on the CLIP model.
        """
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        width, height = image.size
        
        # Create a dummy heatmap (red overlay in the center)
        heatmap = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        
        # Simple center gradient logic (placeholder)
        # In real impl, this would come from model attention maps
        for x in range(width):
            for y in range(height):
                dist = ((x - width/2)**2 + (y - height/2)**2)**0.5
                max_dist = (width**2 + height**2)**0.5 / 2
                intensity = max(0, 1 - dist/max_dist)
                
                if intensity > 0.5:
                    heatmap.putpixel((x, y), (255, 0, 0, int(intensity * 100)))
        
        # Composite
        combined = Image.alpha_composite(image.convert("RGBA"), heatmap)
        
        # Return as base64
        buffered = io.BytesIO()
        combined.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()

heatmap_service = HeatmapService()
