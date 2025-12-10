class RiskEngine:
    def calculate_risk(self, 
                       visual_similarity_score: float, 
                       text_similarity_score: float, 
                       phash_match: bool, 
                       safety_flags: dict) -> dict:
        """
        Calculates a comprehensive risk score based on 5 layers.
        
        Args:
            visual_similarity_score (0-100): CLIP similarity.
            text_similarity_score (0-100): SBERT similarity of extracted text.
            phash_match (bool): True if perceptual hash indicates near-exact duplicate.
            safety_flags (dict): Safety service results (NSFW, etc).
            
        Returns:
            dict: {
                "score": float, 
                "level": str, 
                "factors": list[str],
                "breakdown": dict
            }
        """
        
        score = 0
        factors = []
        
        # 1. Base Score from Visual Similarity (CLIP)
        # Weight: 40%
        # If visual similarity is high (>80), it's a strong indicator.
        visual_contribution = 0
        if visual_similarity_score > 20: # Threshold to start counting
            visual_contribution = ((visual_similarity_score - 20) / 80) * 40
        score += visual_contribution
        
        if visual_similarity_score > 70:
            factors.append("High visual similarity to existing trademark")
        
        # 2. Textual Similarity (OCR + SBERT)
        # Weight: 30%
        # If the text is the same, it's a huge issue (Word Mark infringement).
        text_contribution = 0
        if text_similarity_score > 30:
            text_contribution = ((text_similarity_score - 30) / 70) * 30
        score += text_contribution
        
        if text_similarity_score > 80:
            factors.append("Brand name text conflict detected")
            
        # 3. Fingerprinting (pHash)
        # Weight: Boost to 100% if match found
        if phash_match:
            score = max(score, 95)
            factors.append("Exact or near-exact image duplicate detected (Potential Copycat)")
            
        # 4. Safety Flags
        # Weight: Override
        if not safety_flags.get('is_safe', True):
            score = max(score, 90)
            factors.append("Violation of safety guidelines detected")
            
        # Normalize Score
        score = min(100, max(0, score))
        
        # Determine Level
        if score < 30:
            level = "LOW"
        elif score < 70:
            level = "MEDIUM"
        else:
            level = "HIGH"
            
        if not factors and score > 0:
            factors.append("Minor similarity detected")
            
        return {
            "score": round(score, 1),
            "level": level,
            "factors": factors,
            "breakdown": {
                "visual_score": round(visual_similarity_score, 1),
                "text_score": round(text_similarity_score, 1),
                "is_duplicate": phash_match
            }
        }

risk_engine = RiskEngine()
