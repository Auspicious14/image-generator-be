import axios from "axios";
import dotenv from "dotenv"

dotenv.config()

export const transformWithFotor = async (imageUrl: string, prompt: string): Promise<string> => {
  try {
    const response = await axios.post(
      "https://api.fotor.com/transform",
      {
        imageUrl,
        style: "studio_ghibli",
        prompt,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FOTOR_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );
    return response.data.imageUrl;
  } catch (error) {
    throw new Error(`Fotor API failed: ${error.message}`);
  }
};
