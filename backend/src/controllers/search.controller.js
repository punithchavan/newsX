import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { SearchHistory } from "../models/searchHistory.model.js";
import { User } from "../models/user.model.js";

const addSearchQuery = asyncHandler(async (req,res)=>{
    const userId = req.user._id;
    const { query } = req.body;
    if(!query || query.trim().length === 0){
        throw new ApiError(400, "Search query is required");
    }
    const lastSearch = await SearchHistory.findOne({ user: userId}).sort({ createdAt: -1 });
    if(lastSearch?.query === query.trim()){
        return res
        .status(200)
        .json(200, {}, "Query already stored");
    }
    await SearchHistory.create({
        user: userId,
        query: query.trim()
    });
    return res
    .status(200)
    .json(new ApiResponse(201, {}, "Search query added to history"));
})

const getSearchHistory = asyncHandler(async (req,res) =>{
    const userId = req.user._id;
    const history = await SearchHistory.find({ user: userId }).sort({ createdAt: -1}).limit(10);
    return res
    .status(200)
    .json(new ApiResponse(200, history, "User search history"));
})

const clearSearchHistory = asyncHandler(async (req,res)=>{
    const userId = req.user._id;
    await SearchHistory.deleteMany({ user: userId});
    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Search history cleared"));
})

const searchUser = asyncHandler(async (req,res) =>{
    const { username } = req.query;
    if(!username || username.trim().length === 0){
        throw new ApiError(400, "Username is required");
    }

    const page = Number(req.query.page) || 1;
    const limit = 10;

    const users = await User.find({
        username: { $regex: username, $options: "i"},
        _id: { $ne: req.user._id}
    }).select("username name profileImage").skip((page-1)*limit).limit(limit);

    return res
    .status(200)
    .json(new ApiResponse(200, users, "Users fetched successfully"));
})

export {
    addSearchQuery,
    getSearchHistory,
    clearSearchHistory,
    searchUser
}