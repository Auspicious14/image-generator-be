import express from "express";
import { getImages, generateImage, transformImage } from "../controllers/image";
import { authenticateToken } from "../middlewares/auth";
const router = express.Router();

router.get("/images", authenticateToken, getImages);
router.post("/generate/image", authenticateToken, generateImage);
router.post("/generate/transform-image", authenticateToken, transformImage);

export default router;
