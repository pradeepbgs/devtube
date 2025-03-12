import * as nodemailer from 'nodemailer'

export default class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USER ?? 'pradeepkumarbgs62019@gmail.com',
                pass: process.env.MAIL_PASS ?? ''
            }
        });

        this.hostEmail = process.env.MAIL_USER;
    }

    generateEmailContent (action, otp = null, resetLink = null) {
        let subject, htmlMessage;

        switch (action) {
            case "SIGNUP":
                if (!otp) throw new Error("OTP is required for SIGNUP action");

                subject = "🔐 Verify Your Email - Signup OTP";
                htmlMessage = `
                <html>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                    <h2 style="color: #333;">Welcome to DevTube! 🎉</h2>
                    <p>Your OTP for email verification is:</p>
                    <h3 style="color: #007bff;">${otp}</h3>
                    <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore.</p>
                    <br>
                    <p>Best Regards,<br><strong>The DevTube Team 🚀</strong></p>
                </body>
                </html>`;
                break;

            case "VERIFICATION":
                if (!otp) throw new Error("OTP is required for VERIFICATION action");

                subject = "🎉 Account Verification Email!";
                htmlMessage = `
                <html>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                    <h2 style="color: #333;">Welcome to DevTube! 🎉</h2>
                    <p>Your OTP for account verification is:</p>
                    <h3 style="color: #007bff;">${otp}</h3>
                    <p>This OTP is valid for <strong>5 minutes</strong>. If you did not request this, please ignore.</p>
                    <br>
                    <p>Best Regards,<br><strong>The DevTube Team 🚀</strong></p>
                </body>
                </html>`;
                break;

            case "PASSWORD_RESET":
                if (!resetLink) throw new Error("Reset link is required for PASSWORD_RESET action");

                subject = "🔑 Reset Your Password";
                htmlMessage = `
                <html>
                <body style="font-family: Arial, sans-serif; text-align: center;">
                    <h2 style="color: #333;">Password Reset Request</h2>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetLink}" 
                       style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                       Reset Password
                    </a>
                    <p>If you didn't request this, please ignore this email.</p>
                    <br>
                    <p>Regards,<br><strong>The DevTube Team 🚀</strong></p>
                </body>
                </html>`;
                break;

            default:
                throw new Error("Invalid action type");
        }

        return { subject, htmlMessage };
    }


    async sendOtp(action, email, otp) {
        if (action !== 'SIGNUP' && action !== 'VERIFICATION')
            throw new Error("Invalid action type, Only SIGNUP & VERIFICATION supported");

        if (!email)
            throw new Error("Email is required");
        const body = this.generateEmailContent(action, otp);
        const info = await this.transporter.sendMail({
            from: this.hostEmail,
            to: email,
            subject: body.subject,
            html: body.htmlMessage
        })
        console.log("Email sent: %s", info.messageId);
    }

    sendPasswordResetEmail(action = 'PASSWORD_RESET', email, resetLink) {
        if (action !== 'PASSWORD_RESET')
            throw new Error("Invalid action type, Only PASSWORD_RESET supported");

        if (!email)
            throw new Error("Email is required");

        if (!resetLink)
            throw new Error("Reset link is required");

        const body = this.generateEmailContent(action, null, resetLink);
        const info = this.transporter.sendMail({
            from: this.hostEmail,
            to: email,
            subject: body.subject,
            html: body.htmlMessage
        })
    }
}
