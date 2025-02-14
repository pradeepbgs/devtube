import type { mongo } from "mongoose";
import { User } from "../model/user.model";

export class UserRepository{


    async FindExistingUser(email:string,username:string){
       return await User.findOne({ $or: [{ username }, { email }] });
    }

    async FindById(userid:mongo.ObjectId){
        return await User.findById(userid).select("-password -refreshToken");
    }

    async CreateUser(userData:any){
        const user = new User(userData);
        return await user.save();
    }
}