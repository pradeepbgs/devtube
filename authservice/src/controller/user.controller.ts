import type { ContextType } from "diesel-core";
import { UserService } from "../service/user.service";


export class UserController {
  private userService: UserService;
  private static instance: UserController;

  constructor(userService: UserService) {
    this.userService = userService;
  }
  public static getInstance(userService: UserService): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController(userService);
    }
    return UserController.instance;
  }


  UpdateUser = async (ctx: ContextType) => {
    return await this.userService.Update(ctx);
  }



  GetUser = async (ctx: ContextType) => {
    return await this.userService.Get(ctx);
  }

}
