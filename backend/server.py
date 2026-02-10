from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from .config.settings import settings
from .config.database import db
from .config.constants import API_V1_STR
from .config.rate_limit import setup_rate_limiting
from .api.routes import api_router
from .api.middleware.error_handler import error_handling_middleware
from .api.middleware.security import SecurityHeadersMiddleware

# Initialize logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await db.connect_to_storage()
    logger.info(f"KAIRA_BACKEND_STARTED: Environment={settings.APP_ENV}")
    yield
    # Shutdown
    await db.close_storage_connection()

app = FastAPI(
    title=settings.APP_NAME,
    lifespan=lifespan,
    debug=settings.DEBUG
)

# Middleware
app.middleware("http")(error_handling_middleware)
app.add_middleware(SecurityHeadersMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting
setup_rate_limiting(app)

# API Routes
app.include_router(api_router, prefix=API_V1_STR)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=settings.DEBUG)