import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

export const notRestrictedAuthMiddlewares = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req.header("Authorization");
        
        if (!token) {
            // No token provided, continue without setting req.user
            return next();
        }

        // Remove "Bearer " from the token if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Set req.user only if user is logged in
        if (user) {
            req.user = user;
        }else{
            req.user = null
        }
        
        next();
    } catch (error) {
        // Log the error and continue without setting req.user
        console.error("Error verifying token:", error);
        next();
    }
});
