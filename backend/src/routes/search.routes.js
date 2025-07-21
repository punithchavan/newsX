import { Router } from "express";
import { addSearchQuery, getSearchHistory, clearSearchHistory, searchUser} from "../controllers/search.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/query", addSearchQuery);
router.get("/history", getSearchHistory);
router.delete("/history", clearSearchHistory);
router.get("/user", searchUser);

export default router;