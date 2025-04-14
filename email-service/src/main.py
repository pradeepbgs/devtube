from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi.responses import JSONResponse
from .email_consumer import start_consumer_thread

limiter = Limiter(key_func=get_remote_address)

app = FastAPI()
app.state.limiter = limiter

@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Rate limit exceeded"},
    )

@app.on_event("startup")
async def startup_event():
    print("🔥 Starting up app...")
    try:
        start_consumer_thread()
        print("✅ RabbitMQ consumer launched")
    except Exception as e:
        print(f"❌ Error starting RabbitMQ consumer: {e}")


@app.get("/")
@limiter.limit("100/minute")
def index(request: Request):
    return {"message": "Email service running"}

@app.get("/health")
@limiter.limit("100/minute")
def health(request: Request):
    return {"message": "i'm a lady boy and healthy"}
