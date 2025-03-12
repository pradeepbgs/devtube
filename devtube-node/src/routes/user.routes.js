import { Router } from "express";
import { 
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetail,
    updateUserAvatar,
    updateUserCoverImage,
    getWatchHistory,
    getUserChannelProfile
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";


const router = Router();

// secured routes

router.route('/change-password').post( verifyJwt , changeCurrentPassword);
router.route('/current-user').get( verifyJwt , getCurrentUser);
router.route('/update-account-details').patch(verifyJwt, 
    updateAccountDetail);
 
router.route('/avatar-change').patch(verifyJwt, upload.single('avatar'), 
updateUserAvatar);

router.route('/cover-change').patch(verifyJwt, upload.single('coverImage'),
updateUserCoverImage);

router.route('/c/:username').get(getUserChannelProfile);
router.route('/history').get(verifyJwt, getWatchHistory);


export default router;