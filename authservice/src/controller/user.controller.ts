import type { ContextType } from "diesel-core";
import { UserService } from "../service/user.service";


export class UserController {
    private userService: UserService;
    private static instance: UserController;
  
    constructor(userService: UserService) {
      this.userService = userService;
    }
    public static getInstance(userService:UserService): UserController {
      if (!UserController.instance) {
        UserController.instance = new UserController(userService);
      }
      return UserController.instance;
    }
  
    LoginUser = async (ctx: ContextType) => {
      return await this.userService.SignIn(ctx);
    };
  
    RegisterUser = async (ctx: ContextType) => {
      return await this.userService.SignUp(ctx);
    };

    UpdateUser = async (ctx:ContextType) => {
      return await this.userService.Update(ctx);
    }
    
    VeifyOTP = async (ctx:ContextType) => {
      return await this.userService.VerifyOTP(ctx);
    }

    GetUser = async (ctx:ContextType) => {
      return await this.userService.Get(ctx);
    }

    ServeResetPasswordForm = async(ctx:ContextType) => {
      return await this.userService.ServeResetPasswordForm(ctx)
    }
    RequestPasswordReset = async(ctx:ContextType) => {
      return await this.userService.RequestPasswordReset(ctx)
    }
    ResetPassword = async(ctx:ContextType) => {
      return await this.userService.ResetPassword(ctx)
    }
  }
  