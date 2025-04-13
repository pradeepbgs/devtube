import {Diesel} from 'diesel-core'
import { UserRepository } from '../repository/user.repository'
import { UserService } from '../service/user.service'
import { UserController } from '../controller/user.controller'
import { fileSaveMiddleware } from '../middleware/saveFile'

const userRouter = new Diesel()

const userRepository = UserRepository.getInstance()
const userService = UserService.getInstance(userRepository)
const userController = UserController.getInstance(userService)


userRouter.put("/update",fileSaveMiddleware , userController.UpdateUser)
userRouter.get("/user", userController.GetUser)



export {
    userRouter
}