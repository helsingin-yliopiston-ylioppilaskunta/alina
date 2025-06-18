from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select, SQLModel
from sqlalchemy.sql import func
from sqlalchemy.orm import aliased

from ..dependencies import get_session

from app.models.org import Org, OrgPublic, OrgCreate, OrgUpdate
from app.models.date import Date, DatePublic
from app.models.request import Request, RequestPublic

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

class OrgAllocation(SQLModel):
    org: OrgPublic
    date: DatePublic | None

@router.get("/with-allocations/{resource_id}", response_model=list[OrgAllocation])
async def get_orgs_with_allocations(resource_id: int, session: SessionDep):
    DateAlias = aliased(Date)

    subquery = (
        select(func.min(DateAlias.id))
        .join(Request, DateAlias.request_id == Request.id)
        .where(
            Request.org_id == Org.id,
            Request.resource_id == resource_id,
            DateAlias.allocated == True
        )
        .correlate(Org)
        .scalar_subquery()
    )

    query = (
        select(Org, Date)
        .outerjoin(Date, Date.id == subquery)
        .join(Request)
        .where(Request.resource_id == resource_id)
        .group_by(Org.id, Date.id)
    )

    rows = session.exec(query).all()

    return [
        OrgAllocation(
            org=OrgPublic.model_validate(org),
            date=DatePublic.model_validate(date) if date else None
        )
        for (org, date) in rows
    ]
