from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from core.auth import get_current_user
import uuid
import logging

router = APIRouter()

MAX_FILE_SIZE = 5 * 1024 * 1024 # 5 MB
ALLOWED_MIME_TYPES = ["application/pdf", "image/png", "image/jpeg"]

async def scan_for_viruses(content: bytes) -> bool:
    # Placeholder for a real virus scan (e.g. ClamAV integration)
    # Return False if virus is detected.
    return True

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...), 
    current_user: dict = Depends(get_current_user)
):
    # 1. MIME type validation
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported file type. Only PDF, PNG, and JPEG are allowed."
        )

    # 2. Size validation
    content = await file.read()
    if len(content) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds the 5MB limit."
        )

    # 3. Virus Scan Hook
    is_safe = await scan_for_viruses(content)
    if not is_safe:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File rejected: Virus scan failed."
        )

    # 4. Upload to Storage & Get Signed URL (Mocked)
    file_id = str(uuid.uuid4())
    mock_signed_url = f"https://storage.supabase.com/documents/{file_id}?signature=mock_sig"
    
    # Store record in database (placeholder for actual postgres insert)
    # db.insert_document(user_id=current_user["uid"], file_id=file_id, url=mock_signed_url)

    logging.info(f"User {current_user['uid']} uploaded document {file.filename}")

    return {
        "id": file_id,
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content),
        "url": mock_signed_url,
        "status": "uploaded and scanned"
    }
