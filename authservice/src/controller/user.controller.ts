import type { ContextType } from "diesel-core";
import { UserService } from "../service/user.service";


export class UserController {
    private userService: UserService;
  
    constructor(userService: UserService) {
      this.userService = userService;
    }
  
    LoginUser = async (ctx: ContextType) => {
      return await this.userService.SignIn(ctx);
    };
  
    RegisterUser = async (ctx: ContextType) => {
      return await this.userService.SignUp(ctx);
    };
  }
  