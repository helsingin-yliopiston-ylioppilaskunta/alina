
from fastapi import APIRouter, Depends, HTTPException

from sqlmodel import Session, delete

from ..dependencies import get_session

from app.models.org import Org
from app.models.date import Date
from app.models.request import Request

from typing import Annotated

router = APIRouter(
    prefix="/cleanup",
    tags=["cleanup"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.delete("/")
async def cleanup_db(session: SessionDep):
    session.exec(delete(Date))
    session.exec(delete(Request))
    session.exec(delete(Org))

    session.commit()
    return {"status": "ok", "message": "all tables cleared"}

