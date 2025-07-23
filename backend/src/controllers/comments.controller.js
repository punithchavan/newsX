import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";

const createComment = asyncHandler(async (req,res)=>{
    const { tweetId, content } = req.body;

    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400, "tweetId is invalid");
    }

    if(!content || content.trim()=== ""){
        throw new ApiError(400, "content is required"); 
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    const comment = await Comment.create({
        tweet: tweetId,
        content,
        owner: req.user._id
    });

    tweet.commentsCount +=1;
    await tweet.save();

    return res
    .status(200)
    .json(new ApiResponse(201, comment, "Comment created successfully"));
})

const getCommentsForTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id");
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    const options = { page, limit };
    const result = await Comment.getPaginatedForTweet(tweetId, options);

    return res
    .status(200)
    .json(new ApiResponse(200, result, "Comments fetched successfully"));
})

const updateComment = asyncHandler(async (req,res)=>{
  const { commentId } = req.params;
  const { content } = req.body;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to update this comment");
  }

  comment.content = content || comment.content;
  await comment.save();

  return res
  .status(200)
  .json(new ApiResponse(200, comment, "Comment updated successfully"));
})

const deleteComment = asyncHandler(async (req,res)=>{
  const { commentId } = req.params;

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  if (comment.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not authorized to delete this comment");
  }

  await comment.deleteOne();

  await Tweet.findByIdAndUpdate(comment.tweet, {
    $inc: { commentsCount: -1 }
  });

  return res
  .status(200)
  .json(new ApiResponse(200, {}, "Comment deleted successfully"));
})

export {
    createComment,
    getCommentsForTweet,
    updateComment,
    deleteComment
}