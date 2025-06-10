from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.request import Request, RequestPublic, RequestCreate, RequestUpdate

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
