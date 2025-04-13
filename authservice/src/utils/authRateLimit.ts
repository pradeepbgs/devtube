import type { ContextType } from "diesel-core";
import { redis } from "../service/redis";

export const authRateLimit = (
    action: "signup" | "login" | "otp" | "reset-password" | "request-reset" | "request-verification",
    maxAttempts = 5, 
    windowSec = 900) => {
    return async (ctx: ContextType) => {
        const {email,username,userId} = await ctx.body
        const email_identifier = ctx.query.email
        const userid_identifier = ctx.query.userid
        
        let keyField
        if (email) keyField = email
        else if (username) keyField = username
        else if (userId) keyField = userId
        else if (userid_identifier) keyField = userid_identifier
        else if (email_identifier) keyField = email_identifier

        if (!keyField) return ctx.json({ status: 400, message: "Missing email or username" }, 400);

        const key = `rl:${action}:${keyField.toLowerCase()}`;
        const blockedKey = `rl:block:${action}:${keyField.toLowerCase()}`;

        const isBlocked = await redis.exists(blockedKey);
        if (isBlocked) {
            return ctx.json({ status: 429, message: "Too many attempts. Try again later." }, 429);
        }

        const attempts = await redis.incr(key);
        if (attempts === 1) {
            await redis.expire(key, windowSec);
        }

        if (attempts > maxAttempts) {
            await redis.set(blockedKey, "true", "EX", 3600);
            return ctx.json({ status: 429, message: "Too many attempts. You are temporarily blocked." }, 429);
        }

    }
}
