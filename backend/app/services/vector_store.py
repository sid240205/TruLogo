import faiss
import numpy as np
import os
import pickle

class VectorStore:
    def __init__(self, index_path="vector_store.index"):
        self.index_path = index_path
        self.metadata_path = index_path + ".meta"
        
        self.text_dimension = 384
        self.image_dimension = 512
        
        if os.path.exists(self.index_path + "_text") and os.path.exists(self.index_path + "_image"):
            self.load_index()
        else:
            self.text_index = faiss.IndexFlatL2(self.text_dimension)
            self.image_index = faiss.IndexFlatL2(self.image_dimension)
            self.metadata = {} # Map ID to metadata

    def save_index(self):
        # Ensure directory exists
        directory = os.path.dirname(self.index_path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory)
            
        faiss.write_index(self.text_index, self.index_path + "_text")
        faiss.write_index(self.image_index, self.index_path + "_image")
        with open(self.metadata_path, 'wb') as f:
            pickle.dump(self.metadata, f)

    def load_index(self):
        self.text_index = faiss.read_index(self.index_path + "_text")
        self.image_index = faiss.read_index(self.index_path + "_image")
        if os.path.exists(self.metadata_path):
            with open(self.metadata_path, 'rb') as f:
                self.metadata = pickle.load(f)
        else:
            self.metadata = {}

    def add_text(self, id: str, vector: list, metadata: dict):
        vec = np.array([vector], dtype=np.float32)
        self.text_index.add(vec)
        self.metadata[f"text_{self.text_index.ntotal - 1}"] = metadata
        self.save_index()

    def add_image(self, id: str, vector: list, metadata: dict):
        vec = np.array([vector], dtype=np.float32)
        self.image_index.add(vec)
        self.metadata[f"image_{self.image_index.ntotal - 1}"] = metadata
        self.save_index()

    def search_text(self, vector: list, k: int = 5):
        vec = np.array([vector], dtype=np.float32)
        distances, indices = self.text_index.search(vec, k)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1:
                meta = self.metadata.get(f"text_{idx}", {})
                results.append({"score": float(distances[0][i]), "metadata": meta})
        return results

    def search_image(self, vector: list, k: int = 5):
        vec = np.array([vector], dtype=np.float32)
        distances, indices = self.image_index.search(vec, k)
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1:
                meta = self.metadata.get(f"image_{idx}", {})
                results.append({"score": float(distances[0][i]), "metadata": meta})
        return results

# Singleton
vector_store = VectorStore()
