import { GoogleGenAI } from "@google/genai";
import config from "../config/config.js";

const ai = new GoogleGenAI({
  apiKey: config.GEMINI_API_KEY,
});

// hard timeout wrapper
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("AI timeout")), ms)
    ),
  ]);
}

export async function generateCaption(file) {
  try {
    const base64Image = Buffer.from(file.buffer).toString("base64");

    const contents = [
      {
        inlineData: {
          mimeType: file.mimetype,
          data: base64Image,
        },
      },
      {
        text: "Generate a short Instagram caption with emojis and hashtags.",
      },
    ];

    const aiPromise = ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents,
      config: {
        systemInstruction: `
Generate a short Instagram caption.
Use simple words, emojis and hashtags.
        `,
      },
    });

    // ⏱️ max 6 seconds wait
    const response = await withTimeout(aiPromise, 6000);

    const caption =
      response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return caption || "A moment worth sharing ✨";

  } catch (error) {
    console.log("AI SERVICE ERROR:", error.message);
    return "A moment worth sharing ✨";
  }
}
