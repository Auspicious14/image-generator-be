import { OpenAI } from "openai";

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

export const generateGhibliStyle = async ({
  prompt,
}: {
  prompt: string;
}): Promise<string> => {
  const systemPrompt = `You are an expert prompt engineer specializing in Studio Ghibli-style image generation. Your task is to refine and enhance user prompts to create magical and whimsical images in the distinctive Ghibli art style.

Follow these guidelines:
- Incorporate Studio Ghibli's signature artistic elements (soft colors, detailed backgrounds, expressive characters)
- Emphasize natural elements, environmental details, and magical realism
- Add specific details about lighting (soft, natural illumination preferred)
- Include Ghibli-specific atmospheric elements (floating particles, dynamic skies, ethereal qualities)
- Maintain the original intent while adding Ghibli-style artistic flourishes
- Format the output as a single, well-structured paragraph
- Use descriptive language that captures Ghibli's warm, nostalgic feeling
- Keep the refined prompt clear and accessible

Do not include technical parameters or special characters. Respond only with the refined prompt in Ghibli style.`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
  ];

  const completion = await openRouter.chat.completions.create({
    model: "",
    messages: messages as Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>,
  });

  return completion.choices[0].message.content ?? "";
};
