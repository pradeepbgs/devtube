
import jwt from 'jsonwebtoken'
import { User } from '../model/user.model';
import type { ContextType } from 'diesel-core';


export const verifyJwt = async(ctx:ContextType) => {
    try {
        let token = await ctx.cookies?.accessToken || ctx.req?.headers.get("Authorization");
        if (!token) {
           return ctx.json({ message: "no access token found , Unauthorize request" },401);
        }

        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        const ACCESS_TOKEN_SECRET:any = process.env.ACCESS_TOKEN_SECRET
        const decodedToken = jwt.verify(token,ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Set req.user only if user is logged in
        if (!user) {
            return ctx.json({ message: "No User found, Unauthorized request" },401);
        }

       ctx.set("user", user);
        
    } catch (error) {
        // Log the error and continue without setting req.user
        console.error("Error verifying token:", error);
    }
}
