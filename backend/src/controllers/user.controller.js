import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteCloudinaryImage, deleteLocalFile } from "../utils/deleteImage.js";
import { sendVerificationEmail } from "../utils/sendVerificationEmail.js";
import jwt from "jsonwebtoken";
import { isValidObjectId } from "mongoose";

// Helper for access + refresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens.");
  }
};

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, DOB, email } = req.body;
  if ([fullName, DOB, email].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({ email: email.trim() });
  if (existedUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    fullName: fullName.trim(),
    DOB,
    email: email.trim(),
    isVerified: false,
  });

  if (!user || !user._id) {
    throw new ApiError(400, "User creation failed");
  }

  const emailVerificationToken = user.generateEmailVerificationToken();
  user.emailVerificationToken = emailVerificationToken;
  user.emailVerificationTokenExpiry = Date.now() + parseInt(process.env.EMAIL_VERIFICATION_TOKEN_EXPIRY);
  await user.save({ validateBeforeSave: false });

  await sendVerificationEmail(user.email, emailVerificationToken);

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "User registered. Verification email sent."));
});

// Verify Email
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, "Verification token is required");

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Token is invalid or expired");
  }

  const user = await User.findById(decodedToken._id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.isVerified) {
    return res.status(200).json(new ApiResponse(200, {}, "Email is already verified"));
  }

  if (user.emailVerificationToken !== token) {
    throw new ApiError(400, "Invalid or expired verification token");
  }

  if (user.emailVerificationTokenExpiry < Date.now()) {
    throw new ApiError(400, "Verification token has expired");
  }

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Email verified successfully"));
});

// Complete User Profile
const completeUserProfile = asyncHandler(async (req, res) => {
  const { username, password, bio } = req.body;
  const userId = req.user._id;

  if (!userId || !isValidObjectId(userId)) {
    throw new ApiError(404, "Wrong user ID");
  }

 if ([username, password, bio].some((field) => !field || field.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  const profilePictureLocalPath = req.files?.profilePicture?.[0]?.path;
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "profilePicture is missing");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  if (!profilePicture?.secure_url || !profilePicture?.public_id) {
    throw new ApiError(400, "Failed to upload profile picture");
  }

  if (user.isVerified) {
    user.username = username.trim();
    user.password = password;
    user.bio = bio.trim();
    user.profilePicture = {
      url: profilePicture.secure_url,
      public_id: profilePicture.public_id,
    };
  }

  await user.save();
  const updatedUser = await User.findById(userId).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

  return res.status(200).json(new ApiResponse(200, updatedUser, "User profile completed successfully"));
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if ([email, username].every((field) => !field?.trim())) {
    throw new ApiError(400, "Email or username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) throw new ApiError(404, "User not found");
  if (!user.isVerified) throw new ApiError(403, "Please verify your email first.");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid user credentials");

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

// Logout
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $unset: { refreshToken: 1 },
  });

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// Refresh Token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken || req.header['authorization']?.replace("Bearer ", "");
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id);
    if (!user) throw new ApiError(404, "User not found");

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is invalid or reused");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken }, "Access token refreshed successfully"));
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid refresh token");
  }
});

// Change Password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Get Current User
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "Current user fetched successfully"));
});

// Update Account Details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullName, email, DOB, bio } = req.body;
  if ([fullName, email, DOB, bio].some((field) => !field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName: fullName.trim(),
      email: email.trim(),
      DOB,
      bio: bio.trim(),
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, user, "Account details updated successfully"));
});

// Update Profile Picture
const updateProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;
  if (!profilePictureLocalPath) {
    throw new ApiError(400, "Profile picture file is missing");
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);
  deleteLocalFile(profilePictureLocalPath);

  if (!profilePicture?.secure_url || !profilePicture?.public_id) {
    throw new ApiError(400, "Avatar upload failed");
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.profilePicture?.public_id) {
    await deleteCloudinaryImage(user.profilePicture.public_id);
  }

  user.profilePicture = {
    url: profilePicture.secure_url,
    public_id: profilePicture.public_id,
  };

  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select("-password -refreshToken");

  return res.status(200).json(new ApiResponse(200, updatedUser, "Profile picture updated successfully"));
});

export {
  registerUser,
  verifyEmail,
  completeUserProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateProfilePicture,
};
 