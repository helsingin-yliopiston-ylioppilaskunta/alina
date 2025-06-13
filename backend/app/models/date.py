from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from app.models.request import Request, RequestPublic


class DateBase(SQLModel):
    request_id: int = Field(index=True, foreign_key="request.id")
    date: str = Field()
    allocated: bool = Field()


class Date(DateBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    request: Optional["Request"] = Relationship(back_populates="dates")


class DatePublic(DateBase):
    id: int
    request: Optional["RequestPublic"]


class DateCreate(DateBase):
    pass


class DateUpdate(DateBase):
    pass


from app.models.request import Request, RequestPublic

_ = Date.model_rebuild()
_ = DatePublic.model_rebuild()
