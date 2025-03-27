from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class Screenshot(Base):
    id = Column(Integer, primary_key=True, index=True)
    path = Column(String, nullable=False)  # 저장 경로
    thumbnail_path = Column(String, nullable=False)  # 썸네일 경로
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    version = Column(Integer, default=1)
    device_type = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    metadata = Column(JSON, nullable=True)
    page_id = Column(Integer, ForeignKey("page.id", ondelete="CASCADE"))
    capture_id = Column(Integer, ForeignKey("capture.id", ondelete="CASCADE"))
    
    # 관계 설정
    page = relationship("Page", back_populates="screenshots")
    capture = relationship("Capture", back_populates="screenshots")