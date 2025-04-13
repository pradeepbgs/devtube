from fastapi import FastAPI
from .email_consumer import start_consumer_thread

app = FastAPI()

@app.on_event("startup")
async def startup_event():
    print("🔥 Starting up app...")
    try:
        start_consumer_thread()
        print("✅ RabbitMQ consumer launched")
    except Exception as e:
        print(f"❌ Error starting RabbitMQ consumer: {e}")


@app.get("/")
def index():
    return {"message": "Email service running"}

@app.get("/health")
def health():
    return {"message": "i'm a lady boy and healthy"}