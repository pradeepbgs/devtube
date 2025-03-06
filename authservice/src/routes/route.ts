import {Diesel} from 'diesel-core'
import { UserRepository } from '../repository/user.repository'
import { UserService } from '../service/user.service'
import { UserController } from '../controller/user.controller'

const router = new Diesel()

const userRepository = UserRepository.getInstance()
const userService = UserService.getInstance(userRepository)
const userController = UserController.getInstance(userService)

router.post("/login", userController.LoginUser);
router.post("/register", userController.RegisterUser);
router.put("/update", userController.UpdateUser);
router.post("/verify-otp",userController.VeifyOTP)
router.get("/user", userController.GetUser)
router.post("/reset-password", userController.ResetPassword)
router.get("/reset-password", userController.ServeResetPasswordForm)
router.post("/request-password-reset", userController.RequestPasswordReset)
router.post("/request-verification-otp",userController.requestVerificationOtp)
router.post("/verify-otp", userController.verifyOtpAndActivateUser)


export default router