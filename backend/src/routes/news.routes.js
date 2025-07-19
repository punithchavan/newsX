import { Router } from "express";
import { getNewsByHashtag } from "../controllers/news.controller.js";

const router = Router();

router.get("/:hashtag", getNewsByHashtag);

export default router;

