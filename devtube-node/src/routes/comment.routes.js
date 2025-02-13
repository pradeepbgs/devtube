import { Router } from "express";
import {
  addComment,
  deleteComment,
  getVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router();

// router.use(verifyJwt); // Apply verifyJWT middleware to all routes in this file

router.route("/:videoId")
      .get(getVideoComments)
      .post(verifyJwt,addComment);
router.route("/c/:commentId")
        .delete(verifyJwt,deleteComment)
        .patch(verifyJwt,updateComment);

export default router;
