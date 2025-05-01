import { Request, Response } from "express";
import { imageModel } from "../../models/image";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.API_URL;
export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  try {
    const imageUrl = `${url}${encodeURIComponent(prompt)}`;

    const image = await imageModel.create({
      prompt,
      imageUrl,
      userId: (req as any).user?.id,
      sessionId: (req as any).sessionID,
    });
    res.status(201).json({ success: true, data: image });
  } catch (error) {
    res.json({ success: false, error });
  }
};

export const getImages = async (req: Request, res: Response) => {
  const images = await imageModel
    .find({
      $or: [
        { userId: (req as any).user.id },
        { sessionId: (req as any).sessionID },
      ],
    })
    .sort({ createdAt: -1 });
  res.json(images);
};
