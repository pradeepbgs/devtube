import pika
import json
import os
import threading
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from pydantic import EmailStr
from dotenv import load_dotenv

load_dotenv()

# RabbitMQ setup
RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'emailQueue'

# FastAPI-Mail Config
conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv('MAIL_USERNAME', 'exvillager@example.com'),
    MAIL_PASSWORD=os.getenv('MAIL_PASSWORD'),
    MAIL_FROM=os.getenv('MAIL_FROM', 'exvillager@example.com'),
    MAIL_PORT=587,
    MAIL_SERVER="smtp.gmail.com",
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False
)

async def send_email(subject: str, recipient: EmailStr, html_body: str):
    message = MessageSchema(
        subject=subject,
        recipients=[recipient],
        body=html_body,
        subtype="html",
    )
    fm = FastMail(conf)
    await fm.send_message(message)
    print(f"✉️ Email sent to {recipient}")

def callback(ch, method, properties, body):
    import asyncio
    try:
        data = json.loads(body)
        if 'email' not in data or 'action' not in data:
            print("⚠ Missing required fields in message")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        recipient_email = data['email']
        otp = data.get('otp')
        action = data['action']
        reset_link = data.get('resetLink')

        subject, html = generate_email_content(action, otp, recipient_email, reset_link)
        asyncio.run(send_email(subject, recipient_email, html))
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print("❌ Error:", e)

def consume_rabbitmq():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        print("🐇 RabbitMQ Consumer started...")

        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print("❌ RabbitMQ Error:", e)

def generate_email_content(action, otp=None, recipient_email=None, reset_link=None):
    if action == "SIGNUP":
        if not otp:
            raise ValueError("OTP is required for SIGNUP action")
        subject = "🔐 Verify Your Email - Signup OTP"
        html = f"""
        <html><body style="text-align:center;">
        <h2>Welcome to DevTube! 🎉</h2>
        <p>Your OTP is:</p>
        <h3>{otp}</h3>
        <p>Valid for 5 minutes.</p>
        <br><p>- DevTube Team 🚀</p>
        </body></html>
        """
    elif action == "VERIFICATION":
        if not otp:
            raise ValueError("OTP is required for VERIFICATION action")
        subject = "🎉 Account Verification Email!"
        html = f"""
        <html><body style="text-align:center;">
        <h2>Welcome to DevTube! 🎉</h2>
        <p>Your OTP is:</p>
        <h3>{otp}</h3>
        <p>Valid for 5 minutes.</p>
        <br><p>- DevTube Team 🚀</p>
        </body></html>
        """
    elif action == "PASSWORD_RESET":
        if not reset_link:
            raise ValueError("Reset link is required for PASSWORD_RESET")
        subject = "🔑 Reset Your Password"
        html = f"""
        <html><body style="text-align:center;">
        <h2>Password Reset</h2>
        <p>Click below to reset:</p>
        <a href="{reset_link}" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none;">Reset Password</a>
        <br><p>- DevTube Team 🚀</p>
        </body></html>
        """
    else:
        raise ValueError("Invalid action type")
    
    return subject, html

def start_consumer_thread():
    thread = threading.Thread(target=consume_rabbitmq)
    thread.daemon = True
    thread.start()
