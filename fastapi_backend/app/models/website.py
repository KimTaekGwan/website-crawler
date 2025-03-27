from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Website(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    url = Column(String, unique=True, index=True)
    domain = Column(String, index=True)
    
    # 관계 설정
    captures = relationship("Capture", back_populates="website")
    pages = relationship("Page", back_populates="website")
    website_tags = relationship("WebsiteTag", back_populates="website")
    

class WebsiteTag(Base):
    id = Column(Integer, primary_key=True, index=True)
    website_id = Column(Integer, ForeignKey("website.id", ondelete="CASCADE"))
    tag_id = Column(Integer, ForeignKey("tag.id", ondelete="CASCADE"))
    
    # 관계 설정
    website = relationship("Website", back_populates="website_tags")
    tag = relationship("Tag", back_populates="website_tags")