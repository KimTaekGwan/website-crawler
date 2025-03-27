import re
from urllib.parse import urlparse

def validate_url(url: str) -> bool:
    """URL 유효성 검사

    Args:
        url: 검사할 URL

    Returns:
        유효한 URL이면 True, 아니면 False
    """
    if not url:
        return False
    
    # URL 형식 검사
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False


def extract_domain(url: str) -> str:
    """URL에서 도메인 추출

    Args:
        url: 도메인을 추출할 URL

    Returns:
        추출된 도메인
    """
    try:
        parsed_url = urlparse(url)
        domain = parsed_url.netloc
        
        # www. 제거
        domain = re.sub(r'^www\.', '', domain)
        
        return domain
    except:
        # 실패 시 원본 반환
        return url


def normalize_url(url: str) -> str:
    """URL 정규화

    Args:
        url: 정규화할 URL

    Returns:
        정규화된 URL
    """
    # 스킴이 없으면 https:// 추가
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url
    
    # 마지막 슬래시 제거
    if url.endswith('/'):
        url = url[:-1]
    
    return url


def get_base_url(url: str) -> str:
    """URL에서 베이스 URL 추출 (경로 제외)

    Args:
        url: 베이스 URL을 추출할 URL

    Returns:
        베이스 URL (스킴 + 도메인)
    """
    try:
        parsed_url = urlparse(url)
        base_url = f"{parsed_url.scheme}://{parsed_url.netloc}"
        return base_url
    except:
        return url