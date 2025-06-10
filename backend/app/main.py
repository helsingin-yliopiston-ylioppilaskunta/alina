from fastapi import FastAPI
from contextlib import asynccontextmanager

from .dependencies import create_db_and_tables
from .routers import orgs, resources, requests


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_db_and_tables()
    yield
    print("Shutting down")


app = FastAPI(root_path="/api", lifespan=lifespan)

app.include_router(orgs.router)
app.include_router(resources.router)
app.include_router(requests.router)
