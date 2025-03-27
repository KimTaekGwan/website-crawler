# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base
from app.models.user import User
from app.models.tag import Tag
from app.models.website import Website, WebsiteTag
from app.models.capture import Capture
from app.models.page import Page, PageTag
from app.models.screenshot import Screenshot
from app.models.device_profile import DeviceProfile