from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.date import Date, DatePublic
from app.models.request import Request
from app.models.org_resource_date import OrgResourceDate

from typing import Annotated

router = APIRouter(
    prefix="/resource-dates",
    tags=["resource-dates"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/{resource_id}", response_model=Sequence[OrgResourceDate])
async def get_orgs_with_dates_for_resource(resource_id: int, session: SessionDep):
    query = select(Request).where(Request.resource_id == resource_id)
    requests = session.exec(query).all()

    if not requests:
        raise HTTPException(
            status_code=404, detail="No requests found for this resource"
        )

    response = []
    for request in requests:
        if not request.dates:
            continue

        if request.org and request.resource:
            org_resource_date = OrgResourceDate(
                org_id=request.org.id,
                org_name=request.org.name,
                resource_id=request.resource.id,
                resource_name=request.resource.name,
                dates=[
                    DatePublic(
                        id=date.id,
                        request_id=date.request_id,
                        date=date.date,
                        allocated=date.allocated,
                        request=date.request,
                    )
                    for date in request.dates
                ],
            )

            response.append(org_resource_date)

    return response
