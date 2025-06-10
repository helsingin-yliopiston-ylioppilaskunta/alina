from sqlmodel import Field, SQLModel


class ResourceBase(SQLModel):
    name: str = Field(index=True)
    address: str = Field()


class Resource(ResourceBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ResourcePublic(ResourceBase):
    id: int


class ResourceCreate(ResourceBase):
    pass


class ResourceUpdate(ResourceBase):
    pass
