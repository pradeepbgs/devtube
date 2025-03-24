import type { ContextType } from "diesel-core";
import type { AuthService } from "../service/auth.service";


export class AuthController {
    private authService: AuthService;
    private static instance: AuthController;

    constructor(authService: AuthService) {
        this.authService = authService;
    }
    public static getInstance(authService: AuthService): AuthController {
        if (!AuthController.instance) {
            AuthController.instance = new AuthController(authService);
        }
        return AuthController.instance;
    }


    LoginUser = async (ctx: ContextType) => {
        return await this.authService.SignIn(ctx);
    };

    RegisterUser = async (ctx: ContextType) => {
        return await this.authService.SignUp(ctx);
    };
    LogoutUser = async (ctx: ContextType) => {
        return await this.authService.Logout(ctx);
    }

    VeifyOTP = async (ctx: ContextType) => {
        return await this.authService.VerifyOTP(ctx);
    }


    ServeResetPasswordForm = async (ctx: ContextType) => {
        return await this.authService.ServeResetPasswordForm(ctx)
    }
    RequestPasswordReset = async (ctx: ContextType) => {
        return await this.authService.RequestPasswordReset(ctx)
    }
    ResetPassword = async (ctx: ContextType) => {
        return await this.authService.ResetPassword(ctx)
    }
    requestVerificationOtp = async (ctx: ContextType) => {
        return await this.authService.requestVerificationOtp(ctx)
    }

    verifyOtpAndActivateUser = async (ctx: ContextType) => {
        return await this.authService.verifyOtpAndActivateUser(ctx);
    }
}