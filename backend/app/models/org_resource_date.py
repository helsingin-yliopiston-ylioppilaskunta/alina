from sqlmodel import SQLModel

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.date import DatePublic

class OrgResourceDate(SQLModel):
    org_id: int
    org_name: str
    resource_id: int
    resource_name: str
    dates: list["DatePublic"]

from app.models.date import Date, DatePublic

_ = Date.model_rebuild()
_ = DatePublic.model_rebuild()
