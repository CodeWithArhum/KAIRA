from pydantic import BaseModel
from datetime import datetime, timezone

class ChatRequest(BaseModel):
    message: str
    conversation_id: str
    timestamp: str

class ChatResponse(BaseModel):
    message: str
    conversation_id: str
    timestamp: datetime = datetime.now(timezone.utc)
    success: bool = True
