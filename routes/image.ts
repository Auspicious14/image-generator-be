import express from "express";
import { getImages, generateImage } from "../controllers/image";
import { authenticateToken } from "../middlewares/auth";
const router = express.Router();

router.get("/images", authenticateToken, getImages);
router.post("/generate/image", authenticateToken, generateImage);

export default router;
