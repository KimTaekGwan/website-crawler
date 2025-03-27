from typing import Any, Dict

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl

from app.utils.url import validate_url, extract_domain, normalize_url

router = APIRouter()


class UrlValidateRequest(BaseModel):
    url: str


class UrlValidateResponse(BaseModel):
    url: str
    is_valid: bool
    normalized_url: str
    domain: str


@router.post("/validate", response_model=UrlValidateResponse)
def validate_url_endpoint(request: UrlValidateRequest) -> Any:
    """
    URL 유효성 검사 및 정보 추출
    """
    url = request.url
    is_valid = validate_url(url)
    
    if not is_valid:
        return {
            "url": url,
            "is_valid": False,
            "normalized_url": url,
            "domain": ""
        }
    
    normalized = normalize_url(url)
    domain = extract_domain(url)
    
    return {
        "url": url,
        "is_valid": True,
        "normalized_url": normalized,
        "domain": domain
    }