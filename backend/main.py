from typing import Annotated

from collections.abc import Sequence

from sqlmodel import Field, Session, SQLModel, create_engine, select
from fastapi import FastAPI, Depends, HTTPException, Query


class OrganisationBase(SQLModel):
    name: str = Field(index=True)


class Organisation(OrganisationBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class OrganisationPublic(OrganisationBase):
    id: int


class OrganisationCreate(OrganisationBase):
    pass


class OrganisationUpdate(OrganisationBase):
    pass


sqlite_file_name = "alina.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args)


def create_db_and_tables():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

app = FastAPI(root_path="/api")


@app.on_event("startup")
def on_startup():
    create_db_and_tables()


@app.get("/organisations/", response_model=Sequence[OrganisationPublic])
async def read_orgs(session: SessionDep):
    orgs: Sequence[Organisation] = session.exec(select(Organisation)).all()

    return orgs


@app.get("/organisations/{org_id}", response_model=OrganisationPublic)
async def read_org(
    org_id: int,
    session: SessionDep,
):
    org: Organisation | None = session.get(Organisation, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")

    return org


@app.post("/organisations/", response_model=OrganisationPublic)
async def create_org(org: OrganisationCreate, session: SessionDep):
    db_org = Organisation.model_validate(org)
    session.add(db_org)
    session.commit()
    session.refresh(db_org)

    return db_org


@app.patch("/organisations/{org_id}", response_model=OrganisationPublic)
def update_org(org_id: int, org: OrganisationUpdate, session: SessionDep):
    org_db = session.get(Organisation, org_id)
    if not org_db:
        raise HTTPException(status_code=404, detail="Organisation not found")

    _ = org_data = org.model_dump(exclude_unset=True)
    _ = org_db.sqlmodel_update(org_data)

    session.add(org_db)
    session.commit()
    session.refresh(org_db)

    return org_db


@app.delete("/organisations/{org_id}")
async def delete_org(org_id: int, session: SessionDep):
    org = session.get(Organisation, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Organisation not found")

    session.delete(org)
    session.commit()

    return {"ok", True}
