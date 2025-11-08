"""
File preview service for generating thumbnails and previews.
"""

import io
import base64
from pathlib import Path
from typing import Optional

from PIL import Image
import PyPDF2

from core.config import settings


class FilePreviewService:
    """Service for generating file previews and thumbnails."""
    
    def __init__(self):
        """Initialize preview service."""
        self.max_size = settings.MAX_PREVIEW_SIZE
        self.thumbnail_size = settings.THUMBNAIL_SIZE
    
    def generate_thumbnail(self, file_path: str) -> Optional[str]:
        """
        Generate a thumbnail for an image file.
        
        Args:
            file_path: Path to the image file
            
        Returns:
            Base64-encoded thumbnail image, or None if not possible
        """
        path = Path(file_path)
        
        if not path.exists() or not path.is_file():
            return None
        
        # Check file size
        if path.stat().st_size > self.max_size:
            return None
        
        try:
            # Open and resize image
            with Image.open(path) as img:
                # Convert RGBA to RGB if necessary
                if img.mode in ('RGBA', 'LA', 'P'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'P':
                        img = img.convert('RGBA')
                    background.paste(img, mask=img.split()[-1] if img.mode in ('RGBA', 'LA') else None)
                    img = background
                
                # Create thumbnail
                img.thumbnail((self.thumbnail_size, self.thumbnail_size), Image.Resampling.LANCZOS)
                
                # Save to bytes
                buffer = io.BytesIO()
                img.save(buffer, format='JPEG', quality=85)
                buffer.seek(0)
                
                # Encode to base64
                return base64.b64encode(buffer.getvalue()).decode('utf-8')
        except Exception:
            return None
    
    def get_text_preview(self, file_path: str, max_lines: int = 50) -> Optional[str]:
        """
        Get a text preview of a file.
        
        Args:
            file_path: Path to the text file
            max_lines: Maximum number of lines to read
            
        Returns:
            Text content preview, or None if not possible
        """
        path = Path(file_path)
        
        if not path.exists() or not path.is_file():
            return None
        
        # Check file size
        if path.stat().st_size > self.max_size:
            return None
        
        try:
            with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = []
                for i, line in enumerate(f):
                    if i >= max_lines:
                        lines.append("... (truncated)")
                        break
                    lines.append(line.rstrip())
                return '\n'.join(lines)
        except Exception:
            return None
    
    def get_pdf_preview(self, file_path: str, max_pages: int = 3) -> Optional[dict]:
        """
        Get a preview of a PDF file.
        
        Args:
            file_path: Path to the PDF file
            max_pages: Maximum number of pages to extract text from
            
        Returns:
            Dict with page count and text preview, or None if not possible
        """
        path = Path(file_path)
        
        if not path.exists() or not path.is_file():
            return None
        
        # Check file size
        if path.stat().st_size > self.max_size:
            return None
        
        try:
            with open(path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                page_count = len(pdf_reader.pages)
                
                # Extract text from first few pages
                text_parts = []
                for i in range(min(max_pages, page_count)):
                    page = pdf_reader.pages[i]
                    text_parts.append(page.extract_text())
                
                return {
                    'page_count': page_count,
                    'preview_text': '\n\n'.join(text_parts),
                    'truncated': page_count > max_pages
                }
        except Exception:
            return None
    
    def get_file_preview(self, file_path: str, mime_type: Optional[str] = None) -> dict:
        """
        Get appropriate preview for a file based on its type.
        
        Args:
            file_path: Path to the file
            mime_type: MIME type of the file (optional)
            
        Returns:
            Dict with preview data
        """
        result = {
            'type': 'unknown',
            'data': None
        }
        
        path = Path(file_path)
        extension = path.suffix.lower()
        
        # Image preview
        if extension in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
            thumbnail = self.generate_thumbnail(file_path)
            if thumbnail:
                result['type'] = 'image'
                result['data'] = thumbnail
        
        # Text preview
        elif extension in ['.txt', '.md', '.json', '.xml', '.csv', '.log', '.py', '.js', '.html', '.css']:
            text = self.get_text_preview(file_path)
            if text:
                result['type'] = 'text'
                result['data'] = text
        
        # PDF preview
        elif extension == '.pdf':
            pdf_data = self.get_pdf_preview(file_path)
            if pdf_data:
                result['type'] = 'pdf'
                result['data'] = pdf_data
        
        return result
