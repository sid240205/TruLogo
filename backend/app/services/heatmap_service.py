import numpy as np
from PIL import Image
import io
import base64
import torch
from scipy.ndimage import gaussian_filter

# Import the shared CLIP model from embedding service
from app.services.embedding_service import embedding_service


class HeatmapService:
    """
    Generates attention-based heatmaps showing which parts of an image
    the CLIP model focuses on during analysis.
    """
    
    def __init__(self):
        # Use the CLIP model from embedding service
        self.clip_model = embedding_service.clip_model
        self.clip_processor = embedding_service.clip_processor
        
        # Colormap for heatmap visualization (from cool blue to hot red)
        self.colormap = self._create_colormap()
    
    def _create_colormap(self):
        """Create a professional colormap (inferno-like: purple -> red -> yellow)."""
        colors = []
        for i in range(256):
            t = i / 255.0
            if t < 0.25:
                # Black to Purple
                r = int(t * 4 * 60)
                g = 0
                b = int(t * 4 * 140)
            elif t < 0.5:
                # Purple to Red
                r = int(60 + (t - 0.25) * 4 * 195)
                g = 0
                b = int(140 - (t - 0.25) * 4 * 140)
            elif t < 0.75:
                # Red to Orange
                r = 255
                g = int((t - 0.5) * 4 * 165)
                b = 0
            else:
                # Orange to Yellow
                r = 255
                g = int(165 + (t - 0.75) * 4 * 90)
                b = int((t - 0.75) * 4 * 80)
            colors.append((min(255, r), min(255, g), min(255, b)))
        return colors

    def _extract_attention_map(self, image: Image.Image) -> np.ndarray:
        """
        Extract attention-like saliency map from CLIP vision model.
        Uses gradient-based saliency to find important image regions.
        """
        # Prepare image for CLIP
        inputs = self.clip_processor(images=image, return_tensors="pt")
        pixel_values = inputs['pixel_values'].clone()
        pixel_values.requires_grad_(True)
        
        # Forward pass with gradient tracking
        try:
            # Get vision model outputs with attention
            vision_outputs = self.clip_model.vision_model(
                pixel_values=pixel_values,
                output_attentions=True
            )
            
            # Get the attention from the last transformer layer
            # Shape: (batch, num_heads, seq_len, seq_len)
            attentions = vision_outputs.attentions
            
            if attentions is not None and len(attentions) > 0:
                # Use the last layer's attention
                last_attention = attentions[-1]
                
                # Average over all heads: (batch, seq_len, seq_len)
                attention_avg = last_attention.mean(dim=1)
                
                # Get attention from CLS token to all patch tokens
                # First token is CLS, rest are patches
                cls_attention = attention_avg[0, 0, 1:]  # Skip CLS token itself
                
                # CLIP ViT-B/32 has 7x7 = 49 patches for 224x224 input
                num_patches = cls_attention.shape[0]
                patch_size = int(np.sqrt(num_patches))
                
                # Reshape to 2D grid
                attention_map = cls_attention.detach().numpy().reshape(patch_size, patch_size)
                
                return attention_map
        except Exception as e:
            print(f"Attention extraction failed, using gradient fallback: {e}")
        
        # Fallback: Gradient-based saliency
        return self._gradient_saliency(image)
    
    def _gradient_saliency(self, image: Image.Image) -> np.ndarray:
        """Fallback gradient-based saliency map."""
        # Create fresh tensor with gradient tracking
        inputs = self.clip_processor(images=image, return_tensors="pt")
        pixel_values = inputs['pixel_values'].clone().detach().requires_grad_(True)
        
        # Get image features
        outputs = self.clip_model.vision_model(pixel_values=pixel_values)
        pooled = outputs.pooler_output
        
        # Compute gradient of the pooled output magnitude
        loss = pooled.norm()
        loss.backward()
        
        # Get gradient w.r.t. input
        if pixel_values.grad is not None:
            gradients = pixel_values.grad.data.abs()
            # Average over color channels
            saliency = gradients[0].mean(dim=0).numpy()
        else:
            # Fallback to simple center-weighted map if gradients not available
            saliency = self._create_center_fallback(image.size)
            return saliency
        
        # Resize to smaller grid for consistency (7x7 like attention)
        from PIL import Image as PILImage
        saliency_normalized = (saliency - saliency.min()) / (saliency.max() - saliency.min() + 1e-8)
        saliency_img = PILImage.fromarray((saliency_normalized * 255).astype(np.uint8))
        saliency_img = saliency_img.resize((7, 7), PILImage.Resampling.BILINEAR)
        
        return np.array(saliency_img) / 255.0
    
    def _create_center_fallback(self, size):
        """Create a simple center-weighted fallback map."""
        width, height = size
        y, x = np.ogrid[:height, :width]
        center_y, center_x = height / 2, width / 2
        dist = np.sqrt((x - center_x)**2 + (y - center_y)**2)
        max_dist = np.sqrt(center_x**2 + center_y**2)
        return 1 - (dist / max_dist)

    def generate_heatmap(self, image_bytes: bytes) -> str:
        """
        Generates an attention heatmap overlay for the given image.
        Returns base64 encoded PNG.
        """
        # Open and prepare image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        original_size = image.size
        
        # Get attention map
        attention_map = self._extract_attention_map(image)
        
        # Normalize to 0-1
        attention_map = attention_map - attention_map.min()
        if attention_map.max() > 0:
            attention_map = attention_map / attention_map.max()
        
        # Apply Gaussian smoothing for visual appeal
        attention_map = gaussian_filter(attention_map, sigma=0.8)
        
        # Resize attention map to original image size
        attention_resized = np.array(
            Image.fromarray((attention_map * 255).astype(np.uint8)).resize(
                original_size, Image.Resampling.BILINEAR
            )
        ) / 255.0
        
        # Apply another smoothing pass at full resolution
        attention_resized = gaussian_filter(attention_resized, sigma=max(original_size) / 50)
        
        # Normalize again after smoothing
        attention_resized = attention_resized - attention_resized.min()
        if attention_resized.max() > 0:
            attention_resized = attention_resized / attention_resized.max()
        
        # Create heatmap overlay with colormap
        heatmap = Image.new("RGBA", original_size, (0, 0, 0, 0))
        
        for x in range(original_size[0]):
            for y in range(original_size[1]):
                intensity = attention_resized[y, x]
                color_idx = int(intensity * 255)
                r, g, b = self.colormap[min(255, color_idx)]
                # Variable transparency: more attention = more visible
                alpha = int(intensity * 180)  # Max alpha 180 for visibility
                heatmap.putpixel((x, y), (r, g, b, alpha))
        
        # Composite heatmap on original image
        original_rgba = image.convert("RGBA")
        combined = Image.alpha_composite(original_rgba, heatmap)
        
        # Return as base64 PNG
        buffered = io.BytesIO()
        combined.save(buffered, format="PNG")
        return base64.b64encode(buffered.getvalue()).decode()
    
    def generate_comparison(self, image_bytes: bytes) -> dict:
        """
        Generate both original and heatmap for side-by-side comparison.
        Returns dict with 'original' and 'heatmap' as base64 PNGs.
        """
        # Original image as base64
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        orig_buffer = io.BytesIO()
        image.save(orig_buffer, format="PNG")
        original_b64 = base64.b64encode(orig_buffer.getvalue()).decode()
        
        # Heatmap
        heatmap_b64 = self.generate_heatmap(image_bytes)
        
        return {
            "original": original_b64,
            "heatmap": heatmap_b64
        }


# Singleton instance
heatmap_service = HeatmapService()
