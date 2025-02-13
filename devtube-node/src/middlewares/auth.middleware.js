import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {apiError} from "../utils/apiError.js";
import jwt from "jsonwebtoken"

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        let token = req.cookies?.accessToken || req?.header("Authorization");
        if (!token) {
           return res.status(401).json({ message: "no access token found , Unauthorize request" });
            throw new apiError("no access token found, Unauthorize request");
        }

        // if (token) {
        //     res.status(401).json({ message: "Please login to get access token" });
        // }

        // Remove "Bearer " from the token if present
        if (token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        // Set req.user only if user is logged in
        if (!user) {
            res.status(401).json({ message: "No User found, Unauthorized request" });
            throw new apiError("No User found, Unauthorized request");
        }

        req.user = user
        
        next();
    } catch (error) {
        // Log the error and continue without setting req.user
        console.error("Error verifying token:", error);
        next();
    }
});
