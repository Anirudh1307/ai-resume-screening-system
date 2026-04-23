from __future__ import annotations

from fastapi import HTTPException, status


MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024


def validate_uploaded_file(
    *,
    filename: str | None,
    content: bytes,
    allowed_extensions: set[str],
    entity_name: str,
) -> None:
    if not filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity_name} file name is required.",
        )

    normalized_name = filename.lower()
    if not any(normalized_name.endswith(extension) for extension in allowed_extensions):
        allowed = ", ".join(sorted(allowed_extensions))
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity_name} uploads must use one of: {allowed}.",
        )

    if not content:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"{entity_name} upload is empty.",
        )

    if len(content) > MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"{entity_name} upload exceeds the 10 MB limit. "
                "Split large files before uploading."
            ),
        )
