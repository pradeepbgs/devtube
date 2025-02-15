import type { mongo, Types } from "mongoose";
import { User } from "../model/user.model";

export class UserRepository{
    private static instance:UserRepository

    constructor(){}

    public static getInstance(): UserRepository{
        if(!UserRepository.instance){
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    async FindExistingUser(email:string,username:string){
       return await User.findOne({ $or: [{ username }, { email }] });
    }

    async FindById(userId:Types.ObjectId){
        return await User.findById(userId).select("-password -refreshToken");
    }

    async CreateUser(userData:any){
        const user = new User(userData);
        return await user.save();
    }

    async UpdateUser(userid:Types.ObjectId, userData:any){
        try {
            return await User.findByIdAndUpdate(userid, userData, { new: true }).select("-password -refreshToken");
        } catch (error) {
            console.error("Error updating user:", error);
            throw error;
        }
    }
}