import pika
import json
from django.core.mail import send_mail
import os
import threading

RABBITMQ_HOST = 'localhost'
QUEUE_NAME = 'emailQueue'


def consume_rabbitmq():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST))
        channel = connection.channel()
        channel.queue_declare(queue=QUEUE_NAME, durable=True)
        print("is consumer working")

        channel.basic_consume(queue=QUEUE_NAME, on_message_callback=callback)
        channel.start_consuming()
    except Exception as e:
        print(e)

def callback(ch, method, properties, body):
    try:
        data = json.loads(body)
        if 'email' not in data or 'otp' not in data or 'action' not in data:
            print("⚠ Missing required fields in message")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            return
        
        recipient_email = data['email']
        otp = data['otp']
        action = data['action']
        email_subject, email_body = generate_email_content(action, otp)
        
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email=os.getenv('EMAIL_HOST_USER'),
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        ch.basic_ack(delivery_tag=method.delivery_tag)
    except Exception as e:
        print(e)


def generate_email_content(action, otp):
    """Generate subject and message based on action type."""
    if action == "SIGNUP":
        subject = "🔐 Verify Your Email - Signup OTP"
        message = f"""
        Welcome to Our Platform! 🎉

        Your OTP for email verification is: **{otp}**

        This OTP is valid for **5 minutes**. If you did not request this, please ignore.

        Best Regards,  
        The DevTeam 🚀
        """
    elif action == "PASSWORD_RESET":
        subject = "🔑 Reset Your Password"
        message = f"""
        We received a request to reset your password.  

        Your OTP for password reset is: **{otp}**  

        This OTP will expire in **5 minutes**. If you did not request this, ignore this email.

        Need help? Contact our support.  

        Regards,  
        The DevTeam
        """
    else:
        subject = "🔔 Notification"
        message = f"Here is your requested OTP: {otp}."

    return subject, message

def start_consumer_thread():
    consumer_thread = threading.Thread(target=consume_rabbitmq)
    consumer_thread.daemon = True
    consumer_thread.start()
