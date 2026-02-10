from fastapi import APIRouter
from .chat import router as chat_router
from .status import router as status_router

api_router = APIRouter()

api_router.include_router(chat_router, prefix="/chat", tags=["chat"])
api_router.include_router(status_router, prefix="/status", tags=["status"])

@api_router.get("/")
async def root():
    return {"message": "KAIRA API is operational"}
