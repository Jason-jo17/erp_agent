import os
from typing import Dict, Any, Optional
from jinja2 import Environment, FileSystemLoader

# Optional: Try importing WeasyPrint, mock if missing to avoid hard crash during dev
try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False
    print("⚠️ WeasyPrint not found. PDF generation will be mocked.")

class DocumentGenerator:
    def __init__(self):
        self.template_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "templates")
        self.env = Environment(loader=FileSystemLoader(self.template_dir))
        
        # Ensure output dir exists
        self.output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "documents")
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_document(self, template_name: str, context: Dict[str, Any], output_filename: str = "document.pdf") -> str:
        """
        Generates a PDF from a Jinja2 HTML template.
        Returns the absolute path to the generated file.
        """
        try:
            # 1. Render HTML
            if not template_name.endswith(".html"):
                template_name += ".html"
                
            template = self.env.get_template(template_name)
            html_content = template.render(**context)
            
            output_path = os.path.join(self.output_dir, output_filename)
            
            # 2. Convert to PDF
            if WEASYPRINT_AVAILABLE:
                HTML(string=html_content).write_pdf(output_path)
                print(f"📄 PDF Generated: {output_path}")
            else:
                # Mock Implementation for Dev (Text File)
                with open(output_path.replace(".pdf", ".txt"), "w", encoding="utf-8") as f:
                    f.write(html_content)
                output_path = output_path.replace(".pdf", ".txt")
                print(f"📄 Mock Document Generated: {output_path}")
                
            return output_path
            
        except Exception as e:
            print(f"❌ Document Generation Failed: {e}")
            raise e

# Global Instance
document_generator = DocumentGenerator()
