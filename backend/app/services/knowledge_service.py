import os
from typing import List
import glob

class KnowledgeService:
    def __init__(self, kb_path: str = "app/data/knowledge_base"):
        self.kb_path = kb_path
        self.documents = {}
        self.load_documents()

    def load_documents(self):
        """Loads all markdown files from the knowledge base directory."""
        if not os.path.exists(self.kb_path):
            print(f"Warning: KB path {self.kb_path} does not exist.")
            return

        files = glob.glob(os.path.join(self.kb_path, "*.md"))
        for f in files:
            with open(f, "r", encoding="utf-8") as file:
                self.documents[os.path.basename(f)] = file.read()
        print(f"Loaded {len(self.documents)} documents into Knowledge Service.")

    def search(self, query: str, limit: int = 3) -> str:
        """
        Simple keyword-based retrieval. 
        In production, use VectorStore (Chroma/FAISS).
        """
        query_words = query.lower().split()
        scores = []

        for doc_name, content in self.documents.items():
            score = 0
            content_lower = content.lower()
            for word in query_words:
                if word in content_lower:
                    score += content_lower.count(word)
            
            if score > 0:
                scores.append((score, doc_name, content))
        
        # Sort by score desc
        scores.sort(key=lambda x: x[0], reverse=True)
        
        # Return top N chunks (for now, full files if small, or truncated)
        results = [doc[2] for doc in scores[:limit]]
        return "\n\n---\n\n".join(results)
