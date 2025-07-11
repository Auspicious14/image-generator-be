/* import { Request, Response } from "express";
import { imageModel } from "../../models/image";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.API_URL;
export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const params = {
    model: "flux",
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
        $or: [{ userId: (req as any).user.id }],
      })
      .sort({ createdAt: -1 });
    res.status(201).json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};
*/

import { Request, Response } from "express";
import { imageModel } from "../../models/image";
import { userModel } from "../../models/user";
import dotenv from "dotenv";
import { mapFiles, IFile } from "../../middlewares/files";
import { isSameDay } from "../../utils/date";
import { transformationApis } from "../../utils/apis";
import axios from "axios";

dotenv.config();

const url = process.env.API_URL;
export const generateImage = async (req: Request, res: Response) => {
  const { prompt } = req.body;
  const params = {
    model: "flux",
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
    });
    res.status(201).json({ success: true, data: image });
  } catch (error: any) {
    res.json({ success: false, error: error.message });
  }
};

/* export const transformImage = async (req: Request, res: Response) => {
  try {
    const { image, prompt: customPrompt }: { image: IFile; prompt: string } =
      req.body;
    if (!image || !image.uri || !image.name || !image.type) {
      res.status(400).json({
        success: false,
        message: "Image object with uri, name, and type is required",
      });
      return;
    }

    const user = await userModel.findById((req as any).user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    if (!isSameDay(today, lastReset)) {
      user.generationCount = 0;
      user.lastResetDate = new Date(today.setUTCHours(0, 0, 0, 0));
      await user.save();
    }

    if (user.generationCount >= 5) {
      res.status(403).json({
        success: false,
        message: "Daily limit of 5 transformations reached",
      });
      return;
    }

    const imageUrl = await mapFiles([image]);

    const prompt =
      customPrompt ||
      "Transform this image into a Studio Ghibli-style illustration with soft pastel colors, dreamy backgrounds, and whimsical details in the style of My Neighbor Totoro.";

    for (const apiFunc of transformationApis) {
      try {
        const transformedImageUrl = await apiFunc(imageUrl[0].uri, prompt);
        const image = await imageModel.create({
          prompt,
          imageUrl: transformedImageUrl,
          userId: (req as any).user.id,
        });

        user.generationCount += 1;
        await user.save();

        res.status(201).json({ success: true, data: image });
        return;
      } catch (error: any) {
        console.error(`Error with ${apiFunc.name}:`, error.message);
        // Continue to next API
      }
    }

    res.status(500).json({
      success: false,
      message: "All APIs failed to transform the image",
    });
    return;
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
};

*/

export const transformImage = async (req: Request, res: Response) => {
  try {
    const { image, prompt: customPrompt }: { image: IFile; prompt: string } =
      req.body;
    if (!image || !image.uri || !image.name || !image.type) {
      res.status(400).json({
        success: false,
        message: "Image object with uri, name, and type is required",
      });
      return;
    }

    const user = await userModel.findById((req as any).user.id);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }

    const today = new Date();
    const lastReset = new Date(user.lastResetDate);

    if (!isSameDay(today, lastReset)) {
      user.generationCount = 0;
      user.lastResetDate = new Date(today.setUTCHours(0, 0, 0, 0));
      await user.save();
    }

    if (user.generationCount >= 5) {
      res.status(403).json({
        success: false,
        message: "Daily limit of 5 transformations reached",
      });
      return;
    }

    const imageUrl = await mapFiles([image]);
    const prompt =
      customPrompt ||
      "Transform this image into a Studio Ghibli-style anime art, soft pastel colors, dreamy backgrounds, whimsical details in the style of My Neighbor Totoro";

    try {
      const colabApiUrl = "https://37c2a7dc838c.ngrok-free.app/generate";
      const formData = new FormData();
      formData.append("file", imageUrl[0].uri);
      formData.append("prompt", prompt);

      const response = await axios.post(colabApiUrl, formData, {
        responseType: "arraybuffer",
      });

      const transformedImageBase64 = Buffer.from(response.data).toString(
        "base64"
      );
      const transformedImageData = {
        uri: `data:image/jpeg;base64,${transformedImageBase64}`,
        name: `transformed_${image.name}`,
        type: "image/jpeg",
      };
      const transformedImageUrl = await mapFiles([transformedImageData]);

      const imageRecord = await imageModel.create({
        prompt,
        imageUrl: imageUrl[0].uri,
        transformedImageUrl: transformedImageUrl[0].uri,
        userId: (req as any).user.id,
      });

      user.generationCount += 1;
      await user.save();

      res.status(201).json({ success: true, data: imageRecord });
      return;
    } catch (error: any) {
      console.error("Error with Stable Diffusion API:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to transform image with Stable Diffusion",
      });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
    return;
  }
};

export const getImages = async (req: Request, res: Response) => {
  try {
    const images = await imageModel
      .find({
        $or: [{ userId: (req as any).user.id }],
      })
      .sort({ createdAt: -1 });
    res.status(201).json({ success: true, data: images });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
