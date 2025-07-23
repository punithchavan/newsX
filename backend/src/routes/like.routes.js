import { Router } from "express";
import {
    toggleLikeTweet,
    toggleLikeComment,
    getLikesForTweet,
    getLikesForComment,
} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Tweet Likes
router.post("/tweet/:tweetId", verifyJWT, toggleLikeTweet);
router.get("/tweet/:tweetId", getLikesForTweet);

// Comment Likes
router.post("/comment/:commentId", verifyJWT, toggleLikeComment);
router.get("/comment/:commentId", getLikesForComment);

export default router;