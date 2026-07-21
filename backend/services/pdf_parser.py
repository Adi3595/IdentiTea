import fitz  # PyMuPDF
import re

class PDFParserService:
    def __init__(self):
        pass

    async def extract_text(self, file_bytes: bytes) -> str:
        """
        Extracts and cleans text from a PDF byte stream.
        """
        try:
            # Open the PDF from bytes
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            extracted_text = []
            
            for page_num in range(len(doc)):
                page = doc.load_page(page_num)
                # Extract text using blocks to preserve some structure
                text = page.get_text("text")
                extracted_text.append(text)
                
            doc.close()
            
            full_text = "\n".join(extracted_text)
            
            # Clean up the text: remove excess whitespace and weird control characters
            cleaned_text = re.sub(r'\n+', '\n', full_text)
            cleaned_text = re.sub(r'[^\x00-\x7F]+', ' ', cleaned_text) # Basic ASCII conversion for LLM safety
            
            return cleaned_text.strip()
            
        except Exception as e:
            print(f"Error parsing PDF: {str(e)}")
            raise ValueError(f"Failed to parse PDF document: {str(e)}")

pdf_parser_service = PDFParserService()
