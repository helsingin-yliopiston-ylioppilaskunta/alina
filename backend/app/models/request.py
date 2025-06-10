from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from app.models.org import Org
    from app.models.resource import Resource
    from app.models.date import Date


class RequestBase(SQLModel):
    org_id: int = Field(index=True, foreign_key="org.id")
    resource_id: int = Field(index=True, foreign_key="resource.id")
    contact_person: str = Field()
    contact_email: str = Field()
    contact_phone: str = Field()
    event: str = Field()
    description: str = Field()
    participants: str = Field()
    checked: bool = Field()


class Request(RequestBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    org: Optional["Org"] = Relationship(back_populates="requests")
    resource: Optional["Resource"] = Relationship(back_populates="requests")
    dates: list["Date"] = Relationship(back_populates="request")


class RequestPublic(RequestBase):
    id: int
    org: Optional["Org"]
    resource: Optional["Resource"]
    dates: list["Date"]


class RequestCreate(RequestBase):
    pass


class RequestUpdate(RequestBase):
    pass


from app.models.org import Org
from app.models.resource import Resource
from app.models.date import Date

_ = Request.model_rebuild()
_ = RequestPublic.model_rebuild()
