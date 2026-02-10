from fastapi import APIRouter, HTTPException
from typing import List
from ...models.status import StatusCheck, StatusCheckCreate
from ...config.database import db
from datetime import datetime

router = APIRouter()

@router.post("/", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    if db.db is None:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    status_obj = StatusCheck(client_name=input.client_name)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.db.status_checks.insert_one(doc)
    return status_obj

@router.get("/", response_model=List[StatusCheck])
async def get_status_checks():
    if db.db is None:
        raise HTTPException(status_code=503, detail="Database not initialized")
    
    status_docs = await db.db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    for doc in status_docs:
        if isinstance(doc['timestamp'], str):
            doc['timestamp'] = datetime.fromisoformat(doc['timestamp'])
            
    return status_docs
