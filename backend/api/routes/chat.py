from ...config.rate_limit import limiter
from fastapi import APIRouter, HTTPException, Request
from ...models.chat import ChatRequest, ChatResponse
from ...services.chat_service import chat_service

router = APIRouter()

@router.post("/", response_model=ChatResponse)
@limiter.limit("5/minute")
async def chat_with_kaira(request: Request, chat_request: ChatRequest):
    result = await chat_service.forward_to_n8n(
        message=chat_request.message,
        conversation_id=chat_request.conversation_id,
        timestamp=chat_request.timestamp
    )
    
    if not result["success"]:
        raise HTTPException(status_code=502, detail=result["message"])
    
    return ChatResponse(
        message=result["message"],
        conversation_id=request.conversation_id,
        success=True
    )
