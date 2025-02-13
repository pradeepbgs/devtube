import { Router } from "express";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

router.use(verifyJwt)
/// subscription 

router.route('/c/:channelId')
        .get(getSubscribedChannels)
       .post( toggleSubscription);
       

router.route('/u/:channelId').get(getUserChannelSubscribers)


export default router;