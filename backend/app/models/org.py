from sqlmodel import Field, SQLModel


class OrgBase(SQLModel):
    name: str = Field(index=True)


class Org(OrgBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class OrgPublic(OrgBase):
    id: int


class OrgCreate(OrgBase):
    pass


class OrgUpdate(OrgBase):
    pass
