import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req, res) =>{
    const { content, hashTags } = req.body;
    const userId = req.user._id;

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required");
    }

    if(!hashTags || hashTags.trim() === ""){
        throw new ApiError(400, "Hashtags are required");
    }

    let tags = [];
    if(hashTags){
        tags = hashTags.split(",").map(tag => tag.trim().replace(/^#/, '')).filter(tag => tag.length>0);
    }

    if(tags.length === 0){
        throw new ApiError(400, "At least one hashtag is required");
    }

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found")
    }

    let media = null;

    const mediaLocalPath = req.files?.media[0]?.path;
    if(mediaLocalPath) {
        media = await uploadOnCloudinary(mediaLocalPath);

        if(!media || !media.url){
            throw new ApiError(400, "Media upload failed");
        }
    }

    const tweet = await Tweet.create({
        content,
        owner: user._id,
        media: media?.url || null,
        hashTags: tags
    })

    return res
    .status(201)
    .json(new ApiResponse(201, "Tweet created successfully", tweet))

})

const getUserTweets = asyncHandler(async (req,res)=>{
    const userId = req.user._id;
    if(!userId || !isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404, "User not found");
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const tweets = await Tweet.find({
        owner: user._id
    }).sort({ createdAt: -1}).skip((page-1)*limit).limit(limit).populate("owner", "username name profilePicture");

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req,res)=>{
    const { content, hashTags } = req.body;
    const { tweetId } = req.params;
    const userId = req.user._id;

    if(!content || content.trim() === ""){
        throw new ApiError(400, "Content is required");
    }

    if(!hashTags || hashTags.trim() === ""){
        throw new ApiError(400, "Hashtags are required");
    }

    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id");
    }

    let tags = [];
    if(hashTags){
        tags = hashTags.split(",").map(tag => tag.trim().replace(/^#/, '')).filter(tag => tag.length>0);
    }

    const tweet = await Tweet.findOne({
        _id: tweetId,
        owner: userId
    });

    if(!tweet){
        throw new ApiError(404, "Tweet not found or not authorized");
    }

    tweet.content = content;
    tweet.hashTags = tags;

    await tweet.save();

    return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet updated succesfully"));
})

const getAllTweets = asyncHandler(async (req,res)=>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page -1)*limit;

    const tweets = await Tweet.find({}).sort({createdAt:-1}).skip(skip).limit(limit).populate("owner", "username profilePicture");

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "All tweets are fetched"));
})

const getTweetsByHashtag = asyncHandler(async (req,res)=>{
    const hashtag = req.params.tag.toLowerCase();
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page-1)*limit;

    const tweets = await Tweet.find({ hashTags: hashtag }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate("owner", "username profileImage");

    res.status(200).json(new ApiResponse(200, tweets, `Tweets with hashtag #${hashtag}`));
})

const deleteTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.params;
    const userId = req.user._id;

    if(!tweetId || !isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet Id");
    }

    const tweet = await Tweet.findByIdAndDelete({
        _id: tweetId,
        owner: userId
    })

    if(!tweet){
        throw new ApiError(404, "Tweet not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    getAllTweets,
    getTweetsByHashtag,
    deleteTweet
}
