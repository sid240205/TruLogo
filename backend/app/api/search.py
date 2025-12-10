from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.embedding_service import embedding_service
from app.services.vector_store import vector_store

router = APIRouter(prefix="/search", tags=["Search"])

class SearchRequest(BaseModel):
    query: str
    k: int = 5

class SearchResult(BaseModel):
    score: float
    metadata: dict
    content: Optional[str] = None # Helper to extract content directly if available

@router.post("/", response_model=List[SearchResult])
async def search_knowledge_base(request: SearchRequest):
    """
    Search the vector store for relevant content based on the query.
    Used for the IP Guide Chatbot RAG pipeline.
    """
    try:
        # 1. Generate embedding for the query
        # Using get_text_embedding from embedding_service (SBERT)
        # Ensure this matches the embedding model used for the index
        query_vector = embedding_service.get_text_embedding(request.query)
        
        # 2. Search text index
        results = vector_store.search_text(query_vector, k=request.k)
        
        # 3. Format results
        formatted_results = []
        for res in results:
            # Add simple content extraction if metadata has 'text' or 'content' field
            # strict typing for Pydantic
            metadata = res.get("metadata", {})
            content = metadata.get("text") or metadata.get("content") or ""
            
            formatted_results.append(SearchResult(
                score=res["score"],
                metadata=metadata,
                content=str(content)
            ))
            
        return formatted_results

    except Exception as e:
        print(f"Search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
