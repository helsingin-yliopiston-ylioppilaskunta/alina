from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from pydantic import BaseModel
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.request import Request, RequestPublic, RequestCreate, RequestUpdate

from app.models.org import Org
from app.models.date import Date

from typing import Annotated

router = APIRouter(
    prefix="/requests",
    tags=["requests"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=Sequence[RequestPublic])
async def read_requests(session: SessionDep):
    requests: Sequence[Request] = session.exec(select(Request)).all()

    return requests


@router.get("/{request_id}", response_model=RequestPublic)
async def read_request(
    request_id: int,
    session: SessionDep,
):
    request: Request | None = session.get(Request, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    return request


@router.post("/", response_model=RequestPublic)
async def create_request(request: RequestCreate, session: SessionDep):
    db_request = Request.model_validate(request)
    session.add(db_request)
    session.commit()
    session.refresh(db_request)

    return db_request


@router.patch("/{request_id}", response_model=RequestPublic)
def update_request(request_id: int, request: RequestUpdate, session: SessionDep):
    request_db = session.get(Request, request_id)
    if not request_db:
        raise HTTPException(status_code=404, detail="Request not found")

    _ = request_data = request.model_dump(exclude_unset=True)
    _ = request_db.sqlmodel_update(request_data)

    session.add(request_db)
    session.commit()
    session.refresh(request_db)

    return request_db


@router.delete("/{request_id}")
async def delete_request(request_id: int, session: SessionDep):
    request = session.get(Request, request_id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")

    session.delete(request)
    session.commit()

    return {"ok", True}


class ApplicationRow(BaseModel):
    org_name: str
    alina_dates: list[str]
    sivistys_dates: list[str]
    contact_person: str
    contact_email: str
    contact_phone: str
    event: str
    description: str
    participants: str
    checked: bool


@router.post("/batch")
async def batch_upload(data: list[ApplicationRow], session: SessionDep):
    for entry in data:
        org = session.exec(select(Org).where(Org.name == entry.org_name)).first()
        if not org:
            org = Org(name=entry.org_name)
            session.add(org)
            session.commit()
            session.refresh(org)

        for resource_id in [1, 2]:
            req = Request(
                org_id=org.id or 1,
                resource_id=resource_id,
                contact_person=entry.contact_person,
                contact_email=entry.contact_email,
                contact_phone=entry.contact_phone,
                event=entry.event,
                description=entry.description,
                participants=entry.participants,
                checked=entry.checked,
            )

            session.add(req)
            session.commit()
            session.refresh(req)

            dates = []
            if resource_id == 1:
                dates = entry.alina_dates
            else:
                dates = entry.sivistys_dates

            for d in dates:
                date_obj = Date(request_id=req.id, date=d, allocated=False)
                session.add(date_obj)

        session.commit()

        return {"status": "success"}
