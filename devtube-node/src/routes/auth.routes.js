import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    refreshAccessToken, 
    registerUser, 
    RequestPasswordReset, 
    requestVerificationOtp, 
    ResetPassword, 
    ServeResetPasswordForm, 
    VerifyOTP, 
    verifyOtpAndActivateUser } from "../controllers/auth.controller";
import { verifyJwt } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";

export const authRouter = Router();

authRouter.post('/register',upload.none(), registerUser)
authRouter.post('/login', loginUser)
authRouter.post('/logout', logoutUser)
authRouter.post("/reset-password",ResetPassword)
authRouter.get("/reset-password", ServeResetPasswordForm)
authRouter.post("/request-password-reset", RequestPasswordReset)
authRouter.post("/request-verification-otp",requestVerificationOtp)
authRouter.post("/verify-otp", VerifyOTP)
authRouter.post('/refresh-token',verifyJwt, refreshAccessToken);
