import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const toggleLikeTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new ApiError(404, "Tweet not found");

    const existingLike = await Like.findOne({ tweet: tweetId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Tweet unliked"));
    } else {
        await Like.create({ tweet: tweetId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, {}, "Tweet liked"));
    }
})

const toggleLikeComment = asyncHandler(async (req,res)=>{
    const { commentId } = req.params;
    const userId = req.user._id;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const existingLike = await Like.findOne({ comment: commentId, likedBy: userId });

    if (existingLike) {
        await existingLike.deleteOne();
        return res.status(200).json(new ApiResponse(200, {}, "Comment unliked"));
    } else {
        await Like.create({ comment: commentId, likedBy: userId });
        return res.status(201).json(new ApiResponse(201, {}, "Comment liked"));
    }
})

const getLikesForTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const likes = await Like.find({ tweet: tweetId }).populate("likedBy", "username name profilePicture");

    return res.status(200).json(new ApiResponse(200, likes));
})

const getLikesForComment = asyncHandler(async (req,res)=>{
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    const likes = await Like.find({ comment: commentId }).populate("likedBy", "username name profilePicture");

    return res.status(200).json(new ApiResponse(200, likes));
})

export {
    toggleLikeTweet,
    toggleLikeComment,
    getLikesForTweet,
    getLikesForComment
}