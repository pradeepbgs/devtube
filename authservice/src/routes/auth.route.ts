import {Diesel} from 'diesel-core'
import { UserRepository } from '../repository/user.repository'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/auth.service'
import { authRateLimit } from '../utils/authRateLimit'

const authRouter = new Diesel()

const userRepository = UserRepository.getInstance()
const authService = AuthService.getInstance(userRepository)
const authController = AuthController.getInstance(authService)

authRouter.post("/login", authRateLimit("login"), authController.LoginUser);
authRouter.post("/register", authRateLimit('signup') ,authController.RegisterUser);

authRouter.post("/verify-otp",authRateLimit("otp"), authController.VeifyOTP)
authRouter.get("/reset-password", authController.ServeResetPasswordForm)

authRouter.post("/reset-password", authRateLimit("reset-password"), authController.ResetPassword)
authRouter.post("/request-password-reset", authRateLimit("request-reset"), authController.RequestPasswordReset)
authRouter.post("/request-verification-otp",authRateLimit("request-verification"),authController.requestVerificationOtp)

// authRouter.post("/verify-otp", authController.verifyOtpAndActivateUser)


export {
    authRouter
}