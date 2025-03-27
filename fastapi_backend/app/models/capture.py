from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Float, ARRAY, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class Capture(Base):
    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("website.id", ondelete="CASCADE"))
    status = Column(String, default="pending")  # pending, in_progress, complete, failed
    progress = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error = Column(Text, nullable=True)
    device_types = Column(ARRAY(String), nullable=False)
    capture_full_page = Column(Boolean, default=True)
    capture_dynamic_elements = Column(Boolean, default=False)
    
    # 관계 설정
    website = relationship("Website", back_populates="captures")
    pages = relationship("Page", back_populates="capture")
    screenshots = relationship("Screenshot", back_populates="capture")