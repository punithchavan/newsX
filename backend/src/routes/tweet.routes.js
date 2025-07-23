import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  getUserTweets,
  updateTweet,
  getAllTweets,
  getTweetsByHashtag,
  deleteTweet,
} from "../controllers/tweet.controller.js";

const router = Router();

router.post("/", verifyJWT, upload.fields([{ name: "media", maxCount: 1}]), createTweet);
router.get("/user", verifyJWT, getUserTweets);
router.put("/:tweetId", verifyJWT, updateTweet);
router.delete("/tweetId", verifyJWT, deleteTweet);
router.get("/", getAllTweets);
router.get("/hashtags/:tag", getTweetsByHashtag);

export default router;