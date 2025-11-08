"""
File browsing endpoints.
"""

from typing import List
from fastapi import APIRouter, HTTPException, Query

from schemas.file import DirectoryContents, FileInfo, FileSearchResult
from services.file_browser import FileBrowserService


router = APIRouter(prefix="/files", tags=["files"])
file_browser = FileBrowserService()


@router.get("/browse", response_model=DirectoryContents)
def browse_directory(
    path: str = Query(..., description="Directory path to browse"),
    include_hidden: bool = Query(False, description="Include hidden files")
):
    """
    Browse a directory and get its contents.
    
    Args:
        path: Directory path
        include_hidden: Whether to include hidden files
        
    Returns:
        Directory contents with files and subdirectories
        
    Raises:
        HTTPException: If path is invalid or access denied
    """
    try:
        return file_browser.get_directory_contents(path, include_hidden)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error browsing directory: {str(e)}")


@router.get("/info", response_model=FileInfo)
def get_file_info(path: str = Query(..., description="File path")):
    """
    Get information about a specific file.
    
    Args:
        path: File path
        
    Returns:
        File information
        
    Raises:
        HTTPException: If file not found or access denied
    """
    try:
        return file_browser.get_file_info(path)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error getting file info: {str(e)}")


@router.get("/search", response_model=FileSearchResult)
def search_files(
    base_path: str = Query(..., description="Base directory to search in"),
    pattern: str = Query(..., description="Search pattern"),
    max_results: int = Query(100, description="Maximum number of results", ge=1, le=1000)
):
    """
    Search for files matching a pattern.
    
    Args:
        base_path: Base directory to search in
        pattern: Search pattern (simple text matching)
        max_results: Maximum number of results
        
    Returns:
        Search results
        
    Raises:
        HTTPException: If search fails
    """
    try:
        files = file_browser.search_files(base_path, pattern, max_results)
        return FileSearchResult(
            files=files,
            total_count=len(files),
            query=pattern,
            search_path=base_path
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except PermissionError as e:
        raise HTTPException(status_code=403, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching files: {str(e)}")
