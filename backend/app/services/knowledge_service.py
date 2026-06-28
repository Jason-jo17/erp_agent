import os
from typing import List
import glob
import chromadb
from chromadb.config import Settings

class KnowledgeService:
    def __init__(self, kb_path: str = "app/data/knowledge_base"):
        self.kb_path = kb_path
        self.documents = {}
        
        # Initialize ChromaDB client
        persist_directory = os.path.join(os.getcwd(), "chroma_db")
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)
        self.collection = self.chroma_client.get_or_create_collection(name="erp_knowledge")
        
        self.load_documents()

    def load_documents(self):
        """Loads all markdown files into ChromaDB if not already loaded."""
        if not os.path.exists(self.kb_path):
            print(f"Warning: KB path {self.kb_path} does not exist.")
            return

        files = glob.glob(os.path.join(self.kb_path, "*.md"))
        new_docs = []
        new_ids = []
        
        for f in files:
            with open(f, "r", encoding="utf-8") as file:
                content = file.read()
                doc_name = os.path.basename(f)
                self.documents[doc_name] = content
                new_docs.append(content)
                new_ids.append(doc_name)
                
        # Upsert documents to Chroma
        if new_docs:
            self.collection.upsert(
                documents=new_docs,
                ids=new_ids
            )
            print(f"✅ Upserted {len(new_docs)} documents into ChromaDB Knowledge Service.")

    def search(self, query: str, limit: int = 3) -> str:
        """
        Retrieves top K documents from ChromaDB.
        """
        try:
            results = self.collection.query(
                query_texts=[query],
                n_results=limit
            )
            
            if results and results['documents'] and results['documents'][0]:
                return "\n\n---\n\n".join(results['documents'][0])
            return ""
        except Exception as e:
            print(f"⚠️ ChromaDB search error: {e}")
            return ""
