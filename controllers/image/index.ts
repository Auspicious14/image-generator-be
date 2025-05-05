import { Request, Response } from "express";
import { imageModel } from "../../models/image";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.API_URL;
export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const params = {
    model: "turbo",
    height: "1024",
    width: "1024",
    seed: 42,
    nologo: true,
    enhance: true,
  };
  try {
    const imageUrl = `${url}${encodeURIComponent(prompt)}?model=${
      params.model
    }&width=${params.width}&height=${params.height}&seed=${
      params.seed
    }&nologo=${params.nologo}&enhance=${params.enhance}`;

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
  try {
    const images = await imageModel
      .find({
        $or: [
          { userId: (req as any).user.id },
          { sessionId: (req as any).sessionID },
        ],
      })
      .sort({ createdAt: -1 });
    res.status(201).json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
