from sqlmodel import Field, SQLModel, Relationship

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.request import Request


class ResourceBase(SQLModel):
    name: str = Field(index=True)
    address: str = Field()


class Resource(ResourceBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    requests: list["Request"] = Relationship(back_populates="resource")


class ResourcePublic(ResourceBase):
    id: int


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(ResourceBase):
    pass


# _ = Resource.model_rebuild()
# _ = ResourcePublic.model_rebuild()
