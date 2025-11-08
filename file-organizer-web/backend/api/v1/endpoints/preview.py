"""
File preview endpoints.
"""

from fastapi import APIRouter, HTTPException, Query

from services.file_preview import FilePreviewService


router = APIRouter(prefix="/preview", tags=["preview"])
preview_service = FilePreviewService()


@router.get("/thumbnail")
def get_thumbnail(path: str = Query(..., description="Image file path")):
    """
    Generate a thumbnail for an image file.
    
    Args:
        path: Path to the image file
        
    Returns:
        Base64-encoded thumbnail
        
    Raises:
        HTTPException: If thumbnail generation fails
    """
    try:
        thumbnail = preview_service.generate_thumbnail(path)
        if thumbnail is None:
            raise HTTPException(
                status_code=400,
                detail="Unable to generate thumbnail for this file"
            )
        return {"thumbnail": thumbnail, "format": "jpeg"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating thumbnail: {str(e)}"
        )


@router.get("/text")
def get_text_preview(
    path: str = Query(..., description="Text file path"),
    max_lines: int = Query(50, description="Maximum lines to read", ge=1, le=1000)
):
    """
    Get a text preview of a file.
    
    Args:
        path: Path to the text file
        max_lines: Maximum number of lines to read
        
    Returns:
        Text content
        
    Raises:
        HTTPException: If preview fails
    """
    try:
        text = preview_service.get_text_preview(path, max_lines)
        if text is None:
            raise HTTPException(
                status_code=400,
                detail="Unable to read text from this file"
            )
        return {"text": text}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error reading text: {str(e)}"
        )


@router.get("/pdf")
def get_pdf_preview(
    path: str = Query(..., description="PDF file path"),
    max_pages: int = Query(3, description="Maximum pages to extract", ge=1, le=10)
):
    """
    Get a preview of a PDF file.
    
    Args:
        path: Path to the PDF file
        max_pages: Maximum number of pages to extract
        
    Returns:
        PDF preview data
        
    Raises:
        HTTPException: If preview fails
    """
    try:
        pdf_data = preview_service.get_pdf_preview(path, max_pages)
        if pdf_data is None:
            raise HTTPException(
                status_code=400,
                detail="Unable to preview this PDF file"
            )
        return pdf_data
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error previewing PDF: {str(e)}"
        )


@router.get("/file")
def get_file_preview(
    path: str = Query(..., description="File path"),
    mime_type: str = Query(None, description="MIME type hint")
):
    """
    Get an appropriate preview for any file.
    
    Args:
        path: Path to the file
        mime_type: Optional MIME type hint
        
    Returns:
        Preview data based on file type
        
    Raises:
        HTTPException: If preview fails
    """
    try:
        result = preview_service.get_file_preview(path, mime_type)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating preview: {str(e)}"
        )
