import {Diesel} from 'diesel-core'
import { UserRepository } from '../repository/user.repository'
import { AuthController } from '../controller/auth.controller'
import { AuthService } from '../service/auth.service'

const authRouter = new Diesel()

const userRepository = UserRepository.getInstance()
const authService = AuthService.getInstance(userRepository)
const authController = AuthController.getInstance(authService)

authRouter.post("/login", authController.LoginUser);
authRouter.post("/register", authController.RegisterUser);
authRouter.post("/verify-otp",authController.VeifyOTP)
authRouter.get("/reset-password", authController.ServeResetPasswordForm)
authRouter.post("/reset-password", authController.ResetPassword)
authRouter.post("/request-password-reset", authController.RequestPasswordReset)
authRouter.post("/request-verification-otp",authController.requestVerificationOtp)
authRouter.post("/verify-otp", authController.verifyOtpAndActivateUser)


export {
    authRouter
}