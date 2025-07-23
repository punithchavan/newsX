import { Router } from "express";
import {
  createComment,
  getCommentsForTweet,
  updateComment,
  deleteComment,
} from "../controllers/comments.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createComment);
router.get("/:tweetId", getCommentsForTweet);
router.put("/:commentId", verifyJWT, updateComment);
router.delete("/:commentId", verifyJWT, deleteComment);

export default router;