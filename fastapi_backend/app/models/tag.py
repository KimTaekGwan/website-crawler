from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class Tag(Base):
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    color = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    
    # 관계 설정
    website_tags = relationship("WebsiteTag", back_populates="tag")
    page_tags = relationship("PageTag", back_populates="tag")