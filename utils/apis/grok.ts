import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

export const transformWithGrok = async (imageUrl: string, prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.x.ai/grok3/transform", 
      {
        imageUrl,
        prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROK_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
    return response.data.imageUrl; 
  } catch (error) {
    throw new Error(`Grok API failed: ${error.message}`);
  }
};
