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
} from "../controllers/user.controller.js";

const router = Router();

//publi routes
router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);

//protected routes
router.use(verifyJWT);

router.post("/complete-profile", upload.fields([{ name: "profilePicture", maxCount: 1}]), completeUserProfile);
router.post("/logout", logoutUser);
router.get("/me", getCurrentUser);
router.post("/change-password", changeCurrentPassword);
router.put("/update", updateAccountDetails);
router.put("/update-profile-picture", upload.single("profilePicture"), updateProfilePicture);

export default router;