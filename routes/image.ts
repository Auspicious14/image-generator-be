import express from "express";
import { getImages, generateImage } from "../controllers/image";
import { authenticateToken } from "../middlewares/auth";
const router = express.Router();

router.get("/image", authenticateToken, getImages);
router.post("/generate/image", generateImage);

export default router;
