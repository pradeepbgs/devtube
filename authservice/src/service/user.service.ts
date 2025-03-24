import type { ContextType } from "diesel-core";
import { UserRepository } from "../repository/user.repository";
import { type UserDocument } from "../model/user.model";
import type { Types } from "mongoose";
import { CleanUpResource } from "../utils/cleanup";
import { uploadOnCloudinary } from "../utils/cloduinary";

export class UserService {
    private userRepository: UserRepository;
    private static instance: UserService;

    constructor(repository: UserRepository) {
        this.userRepository = repository;
    }
    public static getInstance(repository: UserRepository): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(repository);
        }
        return UserService.instance;
    }



    /**
     * 🔹 User Update Service
     */
    Update = async (ctx: ContextType) => {
        try {

            const authUser: any = ctx.get('user')
            const { username, fullname } = await ctx.body
            const { avatar, coverImage } = ctx.req.files
            console.log("avatara file in service", avatar)
            const updatedData: Record<string, string> = {}

            if (username) updatedData.username = username
            if (fullname) updatedData.fullname = fullname

            const user: UserDocument | null = await this.userRepository.FindById(authUser?._id);
            if (!user || !user.isVerified) {
                console.log("User not found");
                return ctx.json({ status: 404, message: "User not found" }, 404);
            }

            if (avatar || coverImage) {
                console.log('is avatar and coverimage')
                const avatarResponse = await uploadOnCloudinary(avatar)
                const coverImageResponse = await uploadOnCloudinary(coverImage)
                console.log('avatar res', avatarResponse)
                if (avatarResponse || coverImageResponse) {
                    updatedData.avatar = avatarResponse?.secure_url
                    updatedData.coverImage = coverImageResponse?.secure_url
                }
            }

            await this.userRepository.UpdateUser(user._id as Types.ObjectId, updatedData)

            const updatedUser = await this.userRepository.FindById(user._id as Types.ObjectId);

            return ctx.json({ message: "User updated successfully", user: updatedUser }, 200);
        } catch (error) {
            console.log("Error while updating user", error);
            return ctx.json({ status: 500, message: "Something went wrong while updating user" }, 500);
        } finally {
            if (ctx.req.files) {
                CleanUpResource(ctx.req.files.avatar, ctx.req.files.coverImage)
            }
        }
    }


    /**
     * 🔹 User Delete Service
     */
    Delete = async (ctx: ContextType) => {
        try {
            const authUser: any = ctx.get('user')

            const user: UserDocument | null = await this.userRepository.FindById(authUser?._id);
            if (!user || !user.isVerified) {
                console.log("User not found");
                return ctx.json({ status: 404, message: "User not found" }, 404);
            }

            await this.userRepository.UpdateUser(user._id as Types.ObjectId, { isActive: false })

            return ctx.json({ message: "User deleted successfully" }, 200);
        } catch (error) {
            console.log("Error while deleting user", error);
            return ctx.json({ status: 500, message: "Something went wrong while deleting user" }, 500);
        }
    }

    /**
     * 🔹 User Get Service
     */
    Get = async (ctx: ContextType) => {
        try {
            const authUser: any = ctx.get('user')

            const user: UserDocument | null = await this.userRepository.FindById(authUser?._id);
            if (!user) {
                console.log("User not found");
                return ctx.json({ status: 404, message: "User not found" }, 404);
            }

            return ctx.json({ message: "User fetched successfully", user }, 200);
        } catch (error) {
            console.log("Error while fetching user", error);
            return ctx.json({ status: 500, message: "Something went wrong while fetching user" }, 500);
        }
    }

    
}
