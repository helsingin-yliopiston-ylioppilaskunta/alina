from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.date import Date, DatePublic, DateCreate, DateUpdate

from typing import Annotated

router = APIRouter(
    prefix="/dates",
    tags=["dates"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=Sequence[DatePublic])
async def read_dates(session: SessionDep):
    dates: Sequence[Date] = session.exec(select(Date)).all()

    return dates


@router.get("/{date_id}", response_model=DatePublic)
async def read_date(
    date_id: int,
    session: SessionDep,
):
    date: Date | None = session.get(Date, date_id)
    if not date:
        raise HTTPException(status_code=404, detail="Date not found")

    return date


@router.post("/", response_model=DatePublic)
async def create_date(date: DateCreate, session: SessionDep):
    db_date = Date.model_validate(date)
    session.add(db_date)
    session.commit()
    session.refresh(db_date)

    return db_date


@router.patch("/{date_id}", response_model=DatePublic)
def update_date(date_id: int, date: DateUpdate, session: SessionDep):
    date_db = session.get(Date, date_id)
    if not date_db:
        raise HTTPException(status_code=404, detail="Date not found")

    _ = date_data = date.model_dump(exclude_unset=True)
    _ = date_db.sqlmodel_update(date_data)

    session.add(date_db)
    session.commit()
    session.refresh(date_db)

    return date_db


@router.delete("/{date_id}")
async def delete_date(date_id: int, session: SessionDep):
    date = session.get(Date, date_id)
    if not date:
        raise HTTPException(status_code=404, detail="Date not found")

    session.delete(date)
    session.commit()

    return {"ok", True}
