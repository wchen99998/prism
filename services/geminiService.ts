import { GoogleGenAI, Type } from "@google/genai";
import { UploadedImage, AnalysisResponse, AspectRatio, ImageResolution, GenModel, PromptFormat } from "../types";

// Helper to get fresh AI instance
const getAI = (apiKey: string) => new GoogleGenAI({ apiKey });

/**
 * Analyzes images and/or text source using Gemini Flash 3.
 */
export const analyzeSource = async (
  images: UploadedImage[],
  sourceText: string,
  apiKey: string
): Promise<AnalysisResponse> => {
  const ai = getAI(apiKey);
  
  const parts: any[] = [];

  // Add text context if provided
  if (sourceText.trim()) {
    parts.push({ text: `User provided context/prompt for analysis: "${sourceText}"` });
  }

  // Add images if provided
  if (images && images.length > 0) {
    images.forEach((img) => {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType,
        },
      });
    });
  }

  const prompt = `
    Analyze the provided source material (which may be text, images, or both) in extreme detail.
    
    If text is provided, treat it as the core concept to visualize.
    If images are provided, analyze their visual attributes.
    If both, combine the text concept with the visual style/subject of the images.
    
    Output a JSON object with the following schema:
    - description: A detailed paragraph describing the concept or image.
    - subject: The main subject matter.
    - style: The artistic style or visual aesthetic.
    - composition: The framing and perspective.
    - lighting: The lighting conditions.
    - suggestedPrompt: A highly optimized text prompt that could be used to generate this visualization.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [...parts, { text: prompt }],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          description: { type: Type.STRING },
          subject: { type: Type.STRING },
          style: { type: Type.STRING },
          composition: { type: Type.STRING },
          lighting: { type: Type.STRING },
          suggestedPrompt: { type: Type.STRING },
        },
        required: ["description", "subject", "style", "composition", "lighting", "suggestedPrompt"],
      },
    },
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini.");
  
  return JSON.parse(text) as AnalysisResponse;
};

/**
 * Refines a prompt based on user inputs and previous context using Gemini Flash 3.
 */
export const refinePrompt = async (
  originalPrompt: string,
  modifiers: string,
  images: UploadedImage[],
  format: PromptFormat,
  apiKey: string
): Promise<string> => {
  const ai = getAI(apiKey);

  const parts: any[] = [];
  
  if (images && images.length > 0) {
    images.forEach((img) => {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType,
        },
      });
    });
  }

  let formatInstructions = "Write a descriptive natural language paragraph.";
  let config: any = {};

  if (format === PromptFormat.JSON) {
    formatInstructions = "Return a valid JSON object containing detailed keys for image generation such as 'subject', 'medium', 'style', 'lighting', 'color_palette', 'composition', and 'additional_details'.";
    config.responseMimeType = "application/json";
  } else if (format === PromptFormat.YAML) {
    formatInstructions = "Return a valid YAML object containing detailed keys for image generation such as 'subject', 'medium', 'style', 'lighting', 'color_palette', 'composition', and 'additional_details'. Do NOT use markdown code blocks.";
  }

  const prompt = `
    I have an image prompt: "${originalPrompt}".
    
    I want to refine this prompt with the following specific requirements/modifiers: 
    "${modifiers}"
    
    Based on the visual context of the attached images (if any) and the modifiers, write a new, high-quality prompt suitable for an image generation model. 
    
    FORMATTING REQUIREMENT: ${formatInstructions}

    Return ONLY the raw content.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [...parts, { text: prompt }],
    },
    config: config
  });

  let text = response.text || "";

  // Cleanup markdown fences if present (common with YAML or if JSON mode is loose)
  text = text.replace(/^```(json|yaml)?\n/g, '').replace(/\n```$/g, '');

  return text.trim();
};

/**
 * Internal helper to generate a single image.
 */
const generateSingleImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  model: GenModel,
  resolution: ImageResolution,
  referenceImages: UploadedImage[] | null,
  apiKey: string
): Promise<string> => {
  const ai = getAI(apiKey);
  const parts: any[] = [{ text: prompt }];

  if (referenceImages && referenceImages.length > 0) {
    referenceImages.forEach(img => {
      parts.push({
        inlineData: {
          data: img.data,
          mimeType: img.mimeType
        }
      });
    });
  }

  const imageConfig: any = {
    aspectRatio: aspectRatio,
  };

  // Only pass imageSize for Pro models
  if (model === GenModel.NANO_BANANA_PRO) {
    imageConfig.imageSize = resolution;
  }

  const response = await ai.models.generateContent({
    model,
    contents: { parts: parts },
    config: { imageConfig }
  });

  let base64Image = null;
  const candidate = response.candidates?.[0];
  
  if (candidate?.content?.parts) {
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.data) {
        base64Image = part.inlineData.data;
        break; 
      }
    }
  }

  if (!base64Image) {
    throw new Error("No image data returned from model.");
  }

  return `data:image/jpeg;base64,${base64Image}`;
};

/**
 * Generates multiple images using the specified model and count.
 */
export const generateImages = async (
  prompt: string,
  aspectRatio: AspectRatio,
  model: GenModel,
  resolution: ImageResolution,
  referenceImages: UploadedImage[] | null,
  count: number,
  apiKey: string
): Promise<string[]> => {
  // Create an array of promises to generate 'count' images in parallel
  const promises = Array.from({ length: count }, () => 
    generateSingleImage(prompt, aspectRatio, model, resolution, referenceImages, apiKey)
  );
  
  return Promise.all(promises);
};
