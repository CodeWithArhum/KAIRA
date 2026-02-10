import httpx
import logging
from typing import Dict, Any
from ..config.settings import settings

logger = logging.getLogger(__name__)

class ChatService:
    @staticmethod
    async def forward_to_n8n(message: str, conversation_id: str, timestamp: str) -> Dict[str, Any]:
        payload = {
            "message": message,
            "conversation_id": conversation_id,
            "timestamp": timestamp
        }
        
        async with httpx.AsyncClient(timeout=60.0) as client:
            try:
                response = await client.post(
                    settings.N8N_WEBHOOK_URL,
                    json=payload,
                    headers={"Content-Type": "application/json"}
                )
                response.raise_for_status()
                
                n8n_data = response.json()
                
                # Handle list of items (common n8n output)
                if isinstance(n8n_data, list):
                    n8n_data = n8n_data[0] if n8n_data else {}

                return {
                    "message": (
                        n8n_data.get("output") or 
                        n8n_data.get("message") or 
                        n8n_data.get("response") or 
                        n8n_data.get("text") or
                        "I received your message, but the response was empty."
                    ),
                    "success": True
                }
            except Exception as e:
                logger.error(f"Error calling n8n webhook: {e}")
                return {
                    "message": f"Service error: {str(e)}",
                    "success": False
                }

chat_service = ChatService()
