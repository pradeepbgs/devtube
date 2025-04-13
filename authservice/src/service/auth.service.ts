import type { Types } from "mongoose";
import type { UserRepository } from "../repository/user.repository";
import type { ContextType, CookieOptions } from "diesel-core";
import { redis } from "./redis";
import { sendToEmailQueue } from "./rabbitMQ/producer";
import { CleanUpResource } from "../utils/cleanup";
import type { UserDocument } from "../model/user.model";
import { getHashedPassword } from "../utils/service";


export class AuthService {

     private userRepository: UserRepository;
        private static instance: AuthService;
    
        constructor(repository: UserRepository) {
            this.userRepository = repository;
        }
        public static getInstance(repository: UserRepository): AuthService {
            if (!AuthService.instance) {
                AuthService.instance = new AuthService(repository);
            }
            return AuthService.instance;
        }


            generateOTP = (): string => {
                return Math.floor(100000 + Math.random() * 900000).toString();
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
                    const { fullname, email, username, password } = await ctx.body;
        
                    if (!fullname || !email || !username || !password) {
                        console.log("all fields are required")
                        return ctx.json({ status: 400, message: "All fields are required" }, 400);
                    }
        
                    const existingUser: UserDocument | null = await this.userRepository.FindExistingUser(email, username);
        
                    if (existingUser && existingUser.isVerified) {
                        console.log("user already exists with this username or email")
                        return ctx.json({ status: 409, message: "User already exists with this username or email" }, 409)
                    }
        
                    let user: UserDocument;
        
                    if (existingUser && !existingUser.isVerified) {
                        let hashedPassword = await getHashedPassword(password)
                        user= this.userRepository.UpdateUser(existingUser._id as Types.ObjectId, {
                            fullname,
                            email,
                            password: hashedPassword,
                            username: username.toLowerCase(),
                        });
                    } else {
                        user = await this.userRepository.CreateUser({
                            fullname,
                            email,
                            password,
                            username: username.toLowerCase(),
                        });
                    }
        
                    if (!user) {
                        console.log("user creation failed")
                        return ctx.json({ status: 500, message: "User creation failed" }, 500);
                    }
        
                    const otp = this.generateOTP()
                    await redis.setex(`otp:${email}`, 300, otp)
        
                    sendToEmailQueue({
                        // userId: user._id,
                        email: email,
                        // fullname: user.fullname,
                        otp,
                        action: "SIGNUP",
                    })
        
                    // publishMessage({
                    //     userId: user._id,
                    //     avatar: avatar || null,
                    //     coverImage: coverImage || null,
                    //     action: "UPLOAD_IMAGES",
                    // });
        
                    return ctx.json({ message: "OTP sent to email." }, 201);
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
        
                    if (!(email || username) || !password) {
                        console.log("email and password are required");
                        return ctx.json({ status: 400, message: "Email and password are required" }, 400);
                    }
        
                    const user: UserDocument | null = await this.userRepository.FindExistingUser(email, username);
                    if (!user) {
                        console.log("user not found");
                        return ctx.json({ status: 404, message: "User not found" }, 404);
                    }
        
                    if (!user.isVerified) {
                        return ctx.json({ message: "Account not verified. Please check your email." }, 403);
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
            }
        
            /**
             * 🔹 User Logout Service
             */
            Logout = async (ctx: ContextType) => {
                try {
                    const authUser: any = ctx.get('user')
        
                    await this.userRepository.UpdateUser(authUser?._id, { refreshToken: undefined })
        
                    const cookieOptions: CookieOptions = {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                    };
        
                    ctx.setCookie("accessToken", "", { ...cookieOptions, expires: new Date(0) });
                    ctx.setCookie("refreshToken", "", { ...cookieOptions, expires: new Date(0) });
        
                    return ctx.json({ message: "User logged out successfully" }, 200);
                } catch (error) {
                    console.log("error while logging out", error);
                    return ctx.json({ status: 500, message: "Something went wrong while logging out" }, 500);
                }
            }

            requestVerificationOtp = async (ctx: ContextType) => {
                    const body = await ctx.body
                    if (!body)
                        return ctx.json({ status: 400, message: "Email is required" }, 400);
                    try {
                        const email = body.email
                        if (!email)
                            return ctx.json({ status: 404, message: "email required" }, 404)
            
                        const user = await this.userRepository.FindByEmail(email)
                        if (!user)
                            return ctx.json({ status: 404, message: "user not found" }, 404)
                        if (user.isVerified)
                            return ctx.json({ status: 400, message: "user already verified" }, 400)
                        const otp = this.generateOTP()
                        await redis.setex(`otp:${email}`, 300, otp)
                        sendToEmailQueue({
                            email,
                            otp,
                            action: "VERIFICATION",
                        })
                        console.log("OTP sent successfully for ",email);
                        return ctx.json({ status: 200, message: "OTP sent successfully" }, 200);
                    } catch (error) {
                        console.error("Error in requestVerificationOtp:", error);
                        return ctx.json({ status: 500, message: "Internal Server Error" }, 500);
                    }
                }
            
                verifyOtpAndActivateUser = async (ctx: ContextType) => {
                    try {
                        const body = await ctx.body;
                        if (!body) {
                            return ctx.json({ status: 400, message: "Email and OTP are required" }, 400);
                        }
                
                        const { email, otp } = body;
                        if (!email || !otp) {
                            return ctx.json({ status: 400, message: "Email and OTP are required" }, 400);
                        }
                
                        const user = await this.userRepository.FindByEmail(email);
                        if (!user) {
                            return ctx.json({ status: 404, message: "User not found" }, 404);
                        }
                
                        if (user.isVerified) {
                            return ctx.json({ status: 400, message: "User is already verified" }, 400);
                        }
                
                        const storedOtp = await redis.get(`otp:${email}`);
                        if (!storedOtp) {
                            return ctx.json({ status: 400, message: "OTP expired or invalid" }, 400);
                        }
                
                        if (storedOtp !== otp) {
                            return ctx.json({ status: 400, message: "Invalid OTP" }, 400);
                        }
                
                        user.isVerified = true;
                        await user.save();
                
                        await redis.del(`otp:${email}`);
                
                        return ctx.json({ status: 200, message: "User verified successfully" }, 200);
                    } catch (error) {
                        console.error("Error in verifyOtpAndActivateUser:", error);
                        return ctx.json({ status: 500, message: "Internal Server Error" }, 500);
                    }
                }
                
            
                /**
                 * 🔹 Verify OTP Service
                 */
            
                VerifyOTP = async (ctx: ContextType) => {
                    try {
                        const { email, otp } = await ctx.body;
            
                        const storedOTP = await redis.get(`otp:${email}`);
                        if (!storedOTP || storedOTP !== otp) {
                            return ctx.json({ status: 400, message: "OTP expired or incorrect" }, 400);
                        }
                        const user: UserDocument | null = await this.userRepository.FindByEmail(email)
            
                        if (!user)
                            return ctx.json({ status: 404, message: "User not found" }, 404);
            
                        if (user.isVerified)
                            return ctx.json({ status: 400, message: "User is already verified" }, 400)
            
                        await this.userRepository.UpdateUser(user._id as Types.ObjectId, { isVerified: true });
            
                        await redis.del(`otp:${email}`);
                        return ctx.json({ message: "OTP verified successfully" }, 200);
                    } catch (error) {
                        return ctx.json({ status: 500, message: "Something went wrong while verifying user OTP" }, 500);
                    }
                }
            
                RequestPasswordReset = async (ctx: ContextType) => {
                    try {
                        const { email } = await ctx.body;
            
                        if (!email)
                            return ctx.json({ status: 400, message: "Email is required" }, 400);
            
                        const user = await this.userRepository.FindByEmail(email)
                        if (!user)
                            return ctx.json({ status: 400, message: "User not found" }, 400);
            
                        if (!user.isVerified)
                            return ctx.json({ status: 400, message: "User is not verified" }, 400);
            
                        const token = crypto.randomUUID();
                        await redis.setex(`reset:${token}`, 300, email);
            
                        const resetLink = process.env.AUTH_SERVICE_URI + `/api/v1/user/reset-password?token=${token}`
                        sendToEmailQueue({
                            email,
                            resetLink,
                            action: "PASSWORD_RESET",
                        })
                        return ctx.json({ message: "Password reset link sent to email" }, 200);
                    } catch (error) {
                        console.error("Reset Password Error:", error);
                        return ctx.json({ status: 500, message: "Something went wrong while resetting password" }, 500)
                    }
                }
            
                ServeResetPasswordForm = async (ctx: ContextType) => {
                    try {
                        const token = ctx.query.token?.trim();
                        if (!token)
                            return ctx.json({ status: 400, message: "Token is required" }, 400);
            
                        const email = await redis.get(`reset:${token}`);
                        if (!email) {
                            return ctx.json({ status: 400, message: "Token is expired or invalid" }, 400);
                        }
            
                        ctx.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
                        ctx.setHeader("Content-Type", "text/html");
                        return ctx.ejs('./src/views/reset-password-form.ejs', { token: token })
            
                    } catch (error) {
                        console.error("Reset Password Error:", error);
                        return ctx.json({ status: 500, message: "Something went wrong while resetting password" }, 500)
                    }
                }
            
                ResetPassword = async (ctx: ContextType) => {
                    const body = await ctx.body
                    if (!body)
                        return ctx.json({ status: 400, message: "Body is required" }, 400);
                    try {
                        const { token, newPassword } = body
                        if (!token || !newPassword)
                            return ctx.json({ status: 400, message: "Token and new password required" }, 400);
            
                        const email = await redis.get(`reset:${token}`);
                        if (!email)
                            return ctx.json({ status: 400, message: "Token is expired or invalid" }, 400);
            
                        const user = await this.userRepository.FindByEmail(email);
                        if (!user)
                            return ctx.json({ status: 400, message: "User not found" }, 400);
            
            
                        if (!user.isVerified)
                            return ctx.json({ status: 400, message: "User is not verified" }, 400);
            
                        // our user model has logic so it will be hashed before saving into db
                        user.password = newPassword
                        await user.save();
                        await redis.del(`reset:${token}`);
                        const file = await Bun.file('./src/views/password-reset-successful.html')
                        return new Response(file, {
                            headers: { "Content-Type": "text/html; charset=utf-8" },
                        });
            
                    } catch (error) {
                        console.error("Reset Password Error:", error);
                        return ctx.json({ status: 500, message: "Something went wrong while resetting password" }, 500)
                    }
                }
}