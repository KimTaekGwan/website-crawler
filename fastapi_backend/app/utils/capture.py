import asyncio
import logging
import os
from datetime import datetime
from io import BytesIO
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Union

from PIL import Image
from playwright.async_api import async_playwright
from slugify import slugify

logger = logging.getLogger(__name__)

SCREENSHOTS_DIR = Path("storage/screenshots")
THUMBNAILS_DIR = Path("storage/thumbnails")

# 캡처 경로가 존재하지 않으면 생성
SCREENSHOTS_DIR.mkdir(parents=True, exist_ok=True)
THUMBNAILS_DIR.mkdir(parents=True, exist_ok=True)


class CaptureTool:
    """웹사이트 캡처 도구"""

    def __init__(self):
        """캡처 도구 초기화"""
        self.browser = None
        self.playwright = None

    async def __aenter__(self):
        """비동기 컨텍스트 매니저 진입"""
        self.playwright = await async_playwright().start()
        self.browser = await self.playwright.chromium.launch(headless=True)
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """비동기 컨텍스트 매니저 종료"""
        if self.browser:
            await self.browser.close()
        if self.playwright:
            await self.playwright.stop()

    async def capture_website(
        self,
        url: str,
        device_type: str,
        width: int = 1920,
        height: int = 1080,
        capture_full_page: bool = True,
        capture_dynamic_elements: bool = True,
        version: int = 1,
    ) -> Dict:
        """
        웹사이트 캡처 실행
        
        Args:
            url: 캡처할 웹사이트 URL
            device_type: 디바이스 유형 (desktop, tablet, mobile 등)
            width: 화면 너비
            height: 화면 높이
            capture_full_page: 전체 페이지 캡처 여부
            capture_dynamic_elements: 동적 요소 캡처 여부
            version: 캡처 버전
            
        Returns:
            캡처 결과 정보
        """
        try:
            # 날짜 기반 폴더 생성
            today = datetime.now().strftime("%Y-%m-%d")
            date_dir = SCREENSHOTS_DIR / today
            date_dir.mkdir(exist_ok=True)
            thumbs_date_dir = THUMBNAILS_DIR / today
            thumbs_date_dir.mkdir(exist_ok=True)

            # 파일 이름 생성
            domain = url.replace("http://", "").replace("https://", "").split("/")[0]
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{slugify(domain)}_{device_type}_{timestamp}_v{version}.png"
            thumb_filename = f"{slugify(domain)}_{device_type}_{timestamp}_v{version}_thumb.png"
            
            screenshot_path = date_dir / filename
            thumbnail_path = thumbs_date_dir / thumb_filename
            
            # 컨텍스트 및 페이지 생성
            context = await self.browser.new_context(
                viewport={"width": width, "height": height},
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            )
            
            # 동적 요소 처리를 위한 타임아웃 설정
            if capture_dynamic_elements:
                # 느린 네트워크와 스크립트 로딩을 고려한 타임아웃
                context.set_default_timeout(30000)  # 30초
            
            page = await context.new_page()
            
            # JavaScript 콘솔 로그 이벤트 핸들러
            page.on("console", lambda msg: logger.debug(f"Browser console: {msg.text}"))
            
            # 페이지 로드
            response = await page.goto(url, wait_until="networkidle")
            
            # 페이지 타이틀과 링크 추출
            title = await page.title()
            
            # 페이지 내 모든 링크 수집
            links = await page.evaluate("""() => {
                const links = Array.from(document.querySelectorAll('a[href]'));
                return links.map(link => link.href);
            }""")
            
            # 스크롤링 페이지 또는 동적 컨텐츠를 위한 대기
            if capture_dynamic_elements:
                # 페이지 하단까지 스크롤
                await self._scroll_page(page)
                
                # 이미지와 폰트 로딩 대기
                await page.wait_for_load_state("networkidle")
                
                # 추가 렌더링을 위한 짧은 대기
                await asyncio.sleep(2)
            
            # 스크린샷 찍기
            if capture_full_page:
                screenshot = await page.screenshot(
                    full_page=True, 
                    type="png",
                    path=str(screenshot_path)
                )
            else:
                screenshot = await page.screenshot(
                    full_page=False,
                    type="png",
                    path=str(screenshot_path)
                )
            
            # 썸네일 생성
            thumbnail = await self._create_thumbnail(screenshot)
            with open(thumbnail_path, "wb") as f:
                f.write(thumbnail)
            
            # 페이지 메타데이터 수집
            metadata = {
                "title": title,
                "url": url,
                "captureTime": datetime.now().isoformat(),
                "deviceType": device_type,
                "width": width,
                "height": height,
                "fullPage": capture_full_page,
                "links": links,
                "statusCode": response.status if response else None,
            }
            
            await context.close()
            
            return {
                "screenshot_path": str(screenshot_path),
                "thumbnail_path": str(thumbnail_path),
                "title": title,
                "links": links,
                "metadata": metadata
            }
            
        except Exception as e:
            logger.error(f"캡처 오류: {str(e)}")
            raise

    async def _scroll_page(self, page):
        """페이지를 천천히 스크롤하여 모든 레이지 로딩 요소 로드"""
        await page.evaluate("""async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 300;
                const scrollInterval = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    
                    if (totalHeight >= scrollHeight) {
                        clearInterval(scrollInterval);
                        window.scrollTo(0, 0);  // 맨 위로 스크롤 복귀
                        resolve();
                    }
                }, 200);
            });
        }""")

    async def _create_thumbnail(self, screenshot_bytes: bytes) -> bytes:
        """스크린샷에서 썸네일 생성"""
        image = Image.open(BytesIO(screenshot_bytes))
        
        # 이미지 비율 유지하며 크기 조정
        width, height = image.size
        max_size = 300
        
        if width > height:
            new_width = max_size
            new_height = int(height * (max_size / width))
        else:
            new_height = max_size
            new_width = int(width * (max_size / height))
            
        thumbnail = image.resize((new_width, new_height), Image.LANCZOS)
        
        # 바이트로 변환
        output = BytesIO()
        thumbnail.save(output, format="PNG", optimize=True)
        output.seek(0)
        
        return output.getvalue()


async def capture_website(
    url: str, 
    device_type: str,
    width: int = 1920,
    height: int = 1080,
    capture_full_page: bool = True,
    capture_dynamic_elements: bool = True,
    version: int = 1
) -> Dict:
    """웹사이트 캡처 실행 헬퍼 함수"""
    async with CaptureTool() as capture_tool:
        return await capture_tool.capture_website(
            url=url,
            device_type=device_type,
            width=width,
            height=height,
            capture_full_page=capture_full_page,
            capture_dynamic_elements=capture_dynamic_elements,
            version=version
        )