from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.org import Org, OrgPublic, OrgCreate, OrgUpdate

from typing import Annotated

router = APIRouter(
    prefix="/orgs",
    tags=["orgs"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=Sequence[OrgPublic])
async def read_orgs(session: SessionDep):
    orgs: Sequence[Org] = session.exec(select(Org)).all()

    return orgs


@router.get("/{org_id}", response_model=OrgPublic)
async def read_org(
    org_id: int,
    session: SessionDep,
):
    org: Org | None = session.get(Org, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Org not found")

    return org


@router.post("/", response_model=OrgPublic)
async def create_org(org: OrgCreate, session: SessionDep):
    db_org = Org.model_validate(org)
    session.add(db_org)
    session.commit()
    session.refresh(db_org)

    return db_org


@router.patch("/{org_id}", response_model=OrgPublic)
def update_org(org_id: int, org: OrgUpdate, session: SessionDep):
    org_db = session.get(Org, org_id)
    if not org_db:
        raise HTTPException(status_code=404, detail="Org not found")

    _ = org_data = org.model_dump(exclude_unset=True)
    _ = org_db.sqlmodel_update(org_data)

    session.add(org_db)
    session.commit()
    session.refresh(org_db)

    return org_db


@router.delete("/{org_id}")
async def delete_org(org_id: int, session: SessionDep):
    org = session.get(Org, org_id)
    if not org:
        raise HTTPException(status_code=404, detail="Org not found")

    session.delete(org)
    session.commit()

    return {"ok", True}
