import axios from "axios";

export interface ApifoxModel {
  code: string;
  data: Data;
  [property: string]: any;
}

export interface Data {
  avatarResult?: AvatarResult[];
  businessId: string;
  createTime: number;
  hasHsfw: boolean;
  resultUrl: string;
  status: number;
  taskId: string;
  type: string;
  updateTime: number;
  [property: string]: any;
}

export interface AvatarResult {
  images: Image[];
  templateId: string;
  [property: string]: any;
}

export interface Image {
  hasHsfw: boolean;
  id: string;
  url: string;
  [property: string]: any;
}

export const transformWithFotor = async (
  userImageUrl: string,
  prompt: string
): Promise<string> => {
  try {
    const submitResponse = await axios.post(
      "https://api-b.fotor.com/v1/aiart/img2img",
      {
        userImageUrl,
        content: prompt,
        templateId: "282ce369-a0d9-4996-b8dd-f1520766d50f",
        negativePrompt: "blurry, nude",
        strength: 0.8,
        format: "jpg",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FOTOR_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    if (
      submitResponse.data.code !== "000" ||
      submitResponse.data.msg !== "success"
    ) {
      throw new Error(
        `Fotor task submission failed: ${submitResponse.data.msg}`
      );
    }

    const taskId = submitResponse.data.data.taskId;

    const maxAttempts = 10;
    const pollInterval = 3000;
    let attempts = 0;

    while (attempts < maxAttempts) {
      const taskResponse = await axios.get(
        `https://api-b.fotor.com/v1/aiart/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.FOTOR_API_KEY}`,
          },
          timeout: 30000,
        }
      );

      const taskData: ApifoxModel = taskResponse.data;

      if (taskData.code !== "000") {
        throw new Error(`Fotor task polling failed: ${taskData.msg}`);
      }

      if (taskData.data.status === 1) {
        // Task completed
        if (taskData.data.hasHsfw) {
          throw new Error("Task completed but contains harmful content");
        }
        if (!taskData.data.resultUrl) {
          throw new Error("Task completed but no result URL provided");
        }
        return taskData.data.resultUrl;
      } else if (taskData.data.status === 2) {
        throw new Error("Task failed");
      }

      attempts++;
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error("Task did not complete within maximum attempts");
  } catch (error: any) {
    throw new Error(`Fotor API failed: ${error.message}`);
  }
};
