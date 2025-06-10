from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.request import Request


class OrgBase(SQLModel):
    name: str = Field(index=True)


class Org(OrgBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    requests: list["Request"] = Relationship(back_populates="org")


class OrgPublic(OrgBase):
    id: int


class OrgCreate(OrgBase):
    pass


class OrgUpdate(OrgBase):
    pass


# _ = Org.model_rebuild()
# _ = OrgPublic.model_rebuild()
