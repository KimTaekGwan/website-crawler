from datetime import datetime
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Query, Path
from fastapi.responses import JSONResponse, FileResponse
from sqlalchemy.orm import Session

from app.api import deps
from app.crud import captures, websites, pages, screenshots, device_profiles
from app.models.capture import Capture, CaptureStatus
from app.models.page import Page
from app.models.screenshot import Screenshot
from app.schemas.capture import CaptureCreate, CaptureResponse, CaptureWithDetails
from app.schemas.page import PageCreate, PageResponse
from app.schemas.screenshot import ScreenshotCreate, ScreenshotResponse
from app.utils.capture import capture_website
from app.utils.url import validate_url, extract_domain

router = APIRouter()


@router.post("/", response_model=CaptureResponse)
async def create_capture(
    *,
    db: Session = Depends(deps.get_db),
    background_tasks: BackgroundTasks,
    capture_in: CaptureCreate
) -> Any:
    """
    새 캡처 작업 생성
    """
    # URL 검증
    if not validate_url(capture_in.url):
        raise HTTPException(status_code=400, detail="유효하지 않은 URL입니다")
    
    # 웹사이트 존재 확인 또는 생성
    domain = extract_domain(capture_in.url)
    website = websites.get_by_url(db, url=domain)
    
    if not website:
        # 새 웹사이트 생성
        website_create = {
            "name": domain,
            "url": capture_in.url,
            "domain": domain
        }
        website = websites.create(db, obj_in=website_create)
    
    # 새 캡처 작업 생성
    capture_data = {
        "website_id": website.id,
        "status": CaptureStatus.PENDING.value,
        "device_types": capture_in.device_types,
        "capture_full_page": capture_in.capture_full_page,
        "capture_dynamic_elements": capture_in.capture_dynamic_elements,
        "created_at": datetime.now(),
        "completed_at": None,
        "error": None,
        "progress": 0
    }
    
    db_capture = captures.create(db, obj_in=capture_data)
    
    # 백그라운드 작업으로 캡처 실행
    background_tasks.add_task(process_capture, db_capture.id, db)
    
    return db_capture


@router.get("/{capture_id}", response_model=CaptureWithDetails)
def get_capture(
    *,
    db: Session = Depends(deps.get_db),
    capture_id: int = Path(..., title="캡처 ID")
) -> Any:
    """
    캡처 상세 정보 조회
    """
    capture = captures.get_with_details(db, id=capture_id)
    if not capture:
        raise HTTPException(status_code=404, detail="캡처를 찾을 수 없습니다")
    return capture


@router.get("/", response_model=List[CaptureWithDetails])
def get_captures(
    *,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    website_id: Optional[int] = Query(None, description="웹사이트 ID로 필터링")
) -> Any:
    """
    캡처 목록 조회
    """
    if website_id:
        return captures.get_by_website(db, website_id=website_id, skip=skip, limit=limit)
    return captures.get_multi_with_details(db, skip=skip, limit=limit)


@router.get("/{capture_id}/status", response_model=Dict[str, Any])
def get_capture_status(
    *,
    db: Session = Depends(deps.get_db),
    capture_id: int = Path(..., title="캡처 ID")
) -> Any:
    """
    캡처 진행 상태 조회
    """
    capture = captures.get(db, id=capture_id)
    if not capture:
        raise HTTPException(status_code=404, detail="캡처를 찾을 수 없습니다")
    
    return {
        "id": capture.id,
        "status": capture.status,
        "progress": capture.progress,
        "error": capture.error
    }


async def process_capture(capture_id: int, db: Session) -> None:
    """
    백그라운드에서 캡처 처리
    """
    # 캡처 정보 가져오기
    capture_obj = captures.get(db, id=capture_id)
    if not capture_obj:
        return
    
    # 처리 중으로 상태 업데이트
    captures.update_status(db, id=capture_id, status=CaptureStatus.PROCESSING.value)
    
    try:
        website = websites.get(db, id=capture_obj.website_id)
        if not website:
            captures.update_error(db, id=capture_id, error="웹사이트 정보를 찾을 수 없습니다")
            return
        
        # 디바이스 프로필 가져오기
        device_settings = []
        for device_type in capture_obj.device_types:
            profile = device_profiles.get_by_name(db, name=device_type)
            if profile:
                device_settings.append({
                    "type": device_type,
                    "width": profile.width,
                    "height": profile.height
                })
            else:
                # 기본 설정 사용
                if device_type.lower() == "desktop":
                    device_settings.append({"type": device_type, "width": 1920, "height": 1080})
                elif device_type.lower() == "tablet":
                    device_settings.append({"type": device_type, "width": 768, "height": 1024})
                elif device_type.lower() == "mobile":
                    device_settings.append({"type": device_type, "width": 375, "height": 667})
                else:
                    device_settings.append({"type": device_type, "width": 1280, "height": 720})
        
        # 디바이스 설정이 없으면 에러
        if not device_settings:
            captures.update_error(db, id=capture_id, error="유효한 디바이스 설정이 없습니다")
            return
        
        # 총 처리할 디바이스 수
        total_devices = len(device_settings)
        completed_devices = 0
        
        # 페이지 생성
        page_data = {
            "url": website.url,
            "website_id": website.id,
            "created_at": datetime.now(),
            "title": None  # 캡처 후 업데이트
        }
        page = pages.create(db, obj_in=page_data)
        
        # 각 디바이스 타입별 캡처 실행
        for device in device_settings:
            try:
                # 진행률 업데이트
                progress = int((completed_devices / total_devices) * 100)
                captures.update_progress(db, id=capture_id, progress=progress)
                
                # 캡처 실행
                capture_result = await capture_website(
                    url=website.url,
                    device_type=device["type"],
                    width=device["width"],
                    height=device["height"],
                    capture_full_page=capture_obj.capture_full_page,
                    capture_dynamic_elements=capture_obj.capture_dynamic_elements
                )
                
                # 페이지 제목 업데이트 (첫 캡처에서만)
                if completed_devices == 0 and capture_result.get("title"):
                    pages.update(db, db_obj=page, obj_in={"title": capture_result["title"]})
                
                # 스크린샷 저장
                screenshot_data = {
                    "path": capture_result["screenshot_path"],
                    "thumbnail_path": capture_result["thumbnail_path"],
                    "created_at": datetime.now(),
                    "page_id": page.id,
                    "capture_id": capture_id,
                    "device_type": device["type"],
                    "width": device["width"],
                    "height": device["height"],
                    "version": 1,  # 초기 버전
                    "metadata": capture_result.get("metadata", {})
                }
                
                screenshots.create(db, obj_in=screenshot_data)
                
                # 완료된 디바이스 카운트 증가
                completed_devices += 1
                
                # 진행률 업데이트
                progress = int((completed_devices / total_devices) * 100)
                captures.update_progress(db, id=capture_id, progress=progress)
                
            except Exception as e:
                captures.update_error(db, id=capture_id, error=f"디바이스 {device['type']} 캡처 중 오류: {str(e)}")
                return
        
        # 모든 캡처 완료
        captures.update_completed(db, id=capture_id)
        
    except Exception as e:
        captures.update_error(db, id=capture_id, error=f"캡처 처리 중 오류: {str(e)}")


@router.get("/screenshots/{screenshot_id}")
def get_screenshot(
    *,
    db: Session = Depends(deps.get_db),
    screenshot_id: int = Path(..., title="스크린샷 ID")
) -> Any:
    """
    스크린샷 이미지 조회
    """
    screenshot = screenshots.get(db, id=screenshot_id)
    if not screenshot:
        raise HTTPException(status_code=404, detail="스크린샷을 찾을 수 없습니다")
    
    return FileResponse(screenshot.path, media_type="image/png")