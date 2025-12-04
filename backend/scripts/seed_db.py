from app.services.vector_store import vector_store
from app.services.embedding_service import embedding_service
import os

def seed_data():
    print("Seeding dummy data...")
    
    # Dummy text trademarks
    trademarks = ["Starbucks", "Nike", "Apple", "Google", "Microsoft"]
    for tm in trademarks:
        print(f"Processing {tm}...")
        emb = embedding_service.get_text_embedding(tm)
        vector_store.add_text(tm, emb, {"name": tm, "type": "text"})
        
    # TODO: Add dummy images if available
    
    print("Seeding complete.")

if __name__ == "__main__":
    seed_data()
