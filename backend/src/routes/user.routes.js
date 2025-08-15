import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
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
  testUser,
  searchUsers
} from "../controllers/user.controller.js";

const router = Router();

//publi routes
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

router.get("/test", testUser);




//protected routes
router.post("/complete-profile", verifyJWT, upload.fields([{ name: "profilePicture", maxCount: 1}]), completeUserProfile);
router.post("/logout", verifyJWT, logoutUser);
router.get("/me", verifyJWT, getCurrentUser);
router.get("/search-user",verifyJWT,searchUsers);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.put("/update", verifyJWT, updateAccountDetails);
router.put("/update-profile-picture", verifyJWT, upload.single("profilePicture"), updateProfilePicture);

export default router;