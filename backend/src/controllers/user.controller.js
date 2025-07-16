import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteCloudinaryImage, deleteLocalFile } from "../utils/deleteImage.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import jwt from "jsonwebtoken";
import mongoose, { isValidObjectId } from "mongoose";

const generateAccessAndRefreshTokens = async (userId) =>{
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({validateBeforeSave: false});
        return { accessToken, refreshToken };
    } catch(error){
        throw new ApiError(500, "Something went wrong while generating tokens.")
    }
}

const registerUser = asyncHandler(async (req,res) =>{
    const { fullName, DOB, email } = req.body;

    //validate required fields
    if([ fullName, DOB, email ].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }

    //check if email already exists
    const existedUser = await User.findOne({
        email,
    })
    if(existedUser){
        throw new ApiError(400, "User with this email already exists");
    }

    //create user with basic data
    const user = await User.create({
        fullName,
        DOB,
        email,
        isVerified: false,
    })

    if(!user || !user._id){
        throw new ApiError(400, "user not found");
    }

    //generate and store email verification token
    const emailVerificationToken = user.generateEmailVerificationToken();
    user.emailVerificationToken = emailVerificationToken;
    user.emailVerificationTokenExpiry = Date.now() + parseInt(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY);
    await user.save({ validateBeforeSave: false });

    await sendVerificationEmail(user.email, emailVerificationToken);

    return res
    .status(201)
    .json(new ApiResponse(201, {}, "User registered. Verification email sent."));
})

const verifyEmail = asyncHandler(async (req,res) =>{
    const { token } = req.body;

    if(!token){
        throw new ApiError(400, "Verification token is requiredd");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Token is invalid or expired");
    }

    const user = await User.findById(decodedToken._id);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    if(user.isVerified){
        return res.status(200).json(new ApiResponse(200, {}, "Email is already verified"));
    }

    if (user.emailVerificationToken !== token) {
        throw new ApiError(400, "Invalid or expired verification token");
    }

    if(user.emailVerificationTokenExpiry < Date.now()){
        throw new ApiError(400, "Verification token has expired");
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

export {
    registerUser,
    verifyEmail
}