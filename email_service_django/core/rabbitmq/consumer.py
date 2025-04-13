import pika
import json
from django.core.mail import EmailMultiAlternatives
import os
import threading

RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'emailQueue'


def consume_rabbitmq():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        print("Consumer started...")

        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print(e)

def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        if 'email' not in data or 'action' not in data:
            print("⚠ Missing required fields in message")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        recipient_email = data['email']
        otp = data.get('otp')
        action = data['action']
        sender = os.getenv('EMAIL_HOST_USER')
        reset_link = data.get('resetLink')
        email_subject, html_message = generate_email_content(action, otp,recipient_email, reset_link)
        email =EmailMultiAlternatives(
            subject=email_subject,
            body="This is an HTML email. If you're seeing this, your email client does not support HTML.",
            from_email=sender,
            to=[recipient_email]
        )
        email.attach_alternative(html_message, "text/html")
        email.send()
        print(f"✉️ Email sent to {recipient_email} for {action}")
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(e)


def generate_email_content(action, otp=None, recipient_email=None, reset_link=None):
    """Generate subject and HTML content based on action type."""
    if action == "SIGNUP":
        if not otp:
            raise ValueError("OTP is required for SIGNUP action")
        subject = "🔐 Verify Your Email - Signup OTP"
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #333;">Welcome to DevTube! 🎉</h2>
            <p>Your OTP for email verification is:</p>
            <h3 style="color: #007bff;">{otp}</h3>
            <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore.</p>
            <br>
            <p>Best Regards,<br><strong>The DevTube Team 🚀</strong></p>
        </body>
        </html>
        """

    elif action == "VERIFICATION":
        if not otp:
            raise ValueError("OTP is required for VERIFICATION action")
        subject = "🎉 Account Verification Email!"
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #333;">Welcome to DevTube! 🎉</h2>
            <p>Your OTP for account verification is:</p>
            <h3 style="color: #007bff;">{otp}</h3>
            <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore.</p>
            <br>
            <p>Best Regards,<br><strong>The DevTube Team 🚀</strong></p>
        </body>
        </html>
        """

    elif action == "PASSWORD_RESET":
        if not reset_link:
            raise ValueError("Reset link is required for PASSWORD_RESET action")
        subject = "🔑 Reset Your Password"
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; text-align: center;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Click the button below to reset your password:</p>
            <a href="{reset_link}" 
               style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
               Reset Password
            </a>
            <p>If you didn't request this, please ignore this email.</p>
            <br>
            <p>Regards,<br><strong>The DevTube Team 🚀</strong></p>
        </body>
        </html>
        """
    else:
        raise ValueError("Invalid action type")
    return subject, html_message


def start_consumer_thread():
    consumer_thread = threading.Thread(target=consume_rabbitmq)
    consumer_thread.daemon = True
    consumer_thread.start()
