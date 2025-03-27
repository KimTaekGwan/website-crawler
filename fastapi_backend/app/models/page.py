from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime

from app.db.base_class import Base


class Page(Base):
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, index=True)
    title = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    website_id = Column(Integer, ForeignKey("website.id", ondelete="CASCADE"))
    capture_id = Column(Integer, ForeignKey("capture.id", ondelete="CASCADE"))
    
    # 관계 설정
    website = relationship("Website", back_populates="pages")
    capture = relationship("Capture", back_populates="pages")
    screenshots = relationship("Screenshot", back_populates="page")
    page_tags = relationship("PageTag", back_populates="page")


class PageTag(Base):
    id = Column(Integer, primary_key=True, index=True)
    page_id = Column(Integer, ForeignKey("page.id", ondelete="CASCADE"))
    tag_id = Column(Integer, ForeignKey("tag.id", ondelete="CASCADE"))
    
    # 관계 설정
    page = relationship("Page", back_populates="page_tags")
    tag = relationship("Tag", back_populates="page_tags")