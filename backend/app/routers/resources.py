from fastapi import APIRouter, Depends, HTTPException

from collections.abc import Sequence
from sqlmodel import Session, select

from ..dependencies import get_session

from app.models.resource import Resource, ResourcePublic, ResourceCreate, ResourceUpdate

from typing import Annotated

router = APIRouter(
    prefix="/resources",
    tags=["resources"],
    dependencies=[Depends(get_session)],
)

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/", response_model=Sequence[ResourcePublic])
async def read_resources(session: SessionDep):
    resources: Sequence[Resource] = session.exec(select(Resource)).all()

    return resources


@router.get("/{resource_id}", response_model=ResourcePublic)
async def read_resource(
    resource_id: int,
    session: SessionDep,
):
    resource: Resource | None = session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    return resource


@router.post("/", response_model=ResourcePublic)
async def create_resource(resource: ResourceCreate, session: SessionDep):
    db_resource = Resource.model_validate(resource)
    session.add(db_resource)
    session.commit()
    session.refresh(db_resource)

    return db_resource


@router.patch("/{resource_id}", response_model=ResourcePublic)
def update_resource(resource_id: int, resource: ResourceUpdate, session: SessionDep):
    resource_db = session.get(Resource, resource_id)
    if not resource_db:
        raise HTTPException(status_code=404, detail="Resource not found")

    _ = resource_data = resource.model_dump(exclude_unset=True)
    _ = resource_db.sqlmodel_update(resource_data)

    session.add(resource_db)
    session.commit()
    session.refresh(resource_db)

    return resource_db


@router.delete("/{resource_id}")
async def delete_resource(resource_id: int, session: SessionDep):
    resource = session.get(Resource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")

    session.delete(resource)
    session.commit()

    return {"ok", True}
