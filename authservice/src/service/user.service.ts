import type { ContextType, CookieOptions } from "diesel-core";
import { UserRepository } from "../repository/user.repository";
import { type UserDocument } from "../model/user.model";
import type  {Types} from "mongoose";
import { publishMessage } from "./rabbitMQ/producer";
import { CleanUpResource } from "../utils/cleanup";

export class UserService {
    private userRepository: UserRepository;
    private static instance: UserService;

    constructor(repository: UserRepository) {
        this.userRepository = repository;
    }
    public static getInstance(repository:UserRepository): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService(repository);
        }
        return UserService.instance;
    }


    generateAccessAndRefreshToken = async (userId: Types.ObjectId) => {
        try {
            const user = await this.userRepository.FindById(userId);
            if (!user) {
                console.log("user not found")
                throw { status: 404, message: "User not found" };
            }

            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();

            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken };
        } catch (error) {
            console.log("error while generating refresh and access token", error)
            throw {
                status: 500,
                message: "Something went wrong while generating refresh and access token"
            }
        }
    }

    /**
     * 🔹 User SignUp Service
     */
    SignUp = async (ctx: ContextType) => {
        try {
            const { fullname, email, username, password} = await ctx.body;
            const { avatar, coverImage } = ctx.req.files;

            if (!fullname || !email || !username || !password) {
                console.log("all fields are required")
                if (avatar || coverImage) {
                    CleanUpResource(avatar,coverImage)
                }
                return ctx.json({ status: 400, message: "All fields are required" }, 400);
            }

            const existingUser: UserDocument | null = await this.userRepository.FindExistingUser(email, username);
            if (existingUser) {
                console.log("user already exists with this username or email")
                if (avatar || coverImage) {
                    CleanUpResource(avatar,coverImage)
                }
                return ctx.json({ status: 409, message: "User already exists with this username or email" }, 409)
            }

            const user: UserDocument = await this.userRepository.CreateUser({
                fullname,
                email,
                password,
                username: username.toLowerCase(),
            });

            if (!user) {
                console.log("user creation failed")
                if (avatar || coverImage) {
                    CleanUpResource(avatar,coverImage)
                }
                return ctx.json({ status: 500, message: "User creation failed" }, 500);
            }

            publishMessage({
                userId: user._id,
                avatar: avatar || null,
                coverImage: coverImage || null,
                action: "UPLOAD_IMAGES",
            });

            return ctx.json({ message: "User created successfully", user }, 201);
        } catch (error) {
            console.log("error while signing up", error)
            if (ctx.req.files) {
                CleanUpResource(ctx.req.files.avatar, ctx.req.files.coverImage)
            }
            return ctx.json({ status: 500, message: "Something went wrong while signing up" }, 500);
        } 
    }

    /**
     * 🔹 User SignIn Service
     */
    SignIn = async (ctx: ContextType) => {
        try {
            const { email, username, password } = await ctx.body;

            if (!email || !password) {
                console.log("email and password are required");
                return ctx.json({ status: 400, message: "Email and password are required" }, 400);
            }

            const user: UserDocument | null = await this.userRepository.FindExistingUser(email, username);
            if (!user) {
                console.log("user not found");
                return ctx.json({ status: 404, message: "User not found" }, 404);
            }

            const isPasswordCorrect = await user.isPasswordCorrect(password);
            if (!isPasswordCorrect) {
                console.log("invalid credentials");
                return ctx.json({ status: 401, message: "Invalid credentials" }, 401);
            }

            const { accessToken, refreshToken } = await this.generateAccessAndRefreshToken(user._id as Types.ObjectId);

            const loggedInUser = await this.userRepository.FindById(user._id as Types.ObjectId);

            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
            };

            ctx.setCookie("accessToken", accessToken, cookieOptions);
            ctx.setCookie("refreshToken", refreshToken, cookieOptions);

            return ctx.json({
                message: "User logged in successfully",
                user: loggedInUser,
                accessToken,
                refreshToken
            });
        } catch (error) {
            console.log("error while signing in", error);
            return ctx.json({ status: 500, message: "Something went wrong while signing in" }, 500);
        }
    };

}
