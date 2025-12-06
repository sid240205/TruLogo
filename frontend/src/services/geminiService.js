import { GoogleGenAI, SchemaType, Type } from "@google/genai";

// Use NEXT_PUBLIC_ prefix for client-side env vars in Next.js
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// In Next.js, might need to be careful about where this is called (client vs server).
// The user code was client-side (React components importing it).
// So we use NEXT_PUBLIC_ prefix.

const ai = new GoogleGenAI({ apiKey });

// Helper to convert file to Base64
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result;
            // Remove data URL prefix (e.g., "data:image/jpeg;base64,")
            const base64 = result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
};

export const analyzeLogoRisk = async (imageBase64, brandName, additionalContext) => {
    try {
        const model = 'gemini-2.5-flash';

        const prompt = `
      Act as a senior Trademark Examiner and IP Lawyer for the South East Asian (ASEAN) and Global market. 
      Analyze the provided logo image and the brand name "${brandName}".
      Context: ${additionalContext}

      Check for:
      1. Visual similarity to famous global or ASEAN brands (Indonesia, Vietnam, Thailand, Singapore, Malaysia).
      2. Use of prohibited symbols (National Emblems, Royal Insignia, ASEAN symbols, Red Cross, etc.).
      3. Offensive or sensitive imagery within Asian cultural contexts.
      4. Genericness (is it too simple to be trademarked?).

      Return a JSON object strictly adhering to this schema:
      {
        "riskScore": number (0-100),
        "riskLevel": "Low" | "Medium" | "High" | "Critical",
        "summary": "Short executive summary of findings",
        "flags": ["list", "of", "specific", "issues", "found"],
        "visualFeatures": ["list", "of", "key", "visual", "elements"],
        "similarTrademarks": [
           { "name": "Simulated Similar Brand", "similarityScore": number (0-100), "classId": "Class XX", "status": "Registered", "owner": "Company Name" }
        ],
        "recommendationSummary": "One sentence legal advice"
      }
    `;

        const response = await ai.models.generateContent({
            model,
            contents: {
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } },
                    { text: prompt }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        riskScore: { type: Type.NUMBER },
                        riskLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                        summary: { type: Type.STRING },
                        flags: { type: Type.ARRAY, items: { type: Type.STRING } },
                        visualFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
                        recommendationSummary: { type: Type.STRING },
                        similarTrademarks: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    similarityScore: { type: Type.NUMBER },
                                    classId: { type: Type.STRING },
                                    status: { type: Type.STRING },
                                    owner: { type: Type.STRING }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (response.text) {
            return JSON.parse(response.text);
        }
        throw new Error("No response text from Gemini");

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        // Fallback mock data if API fails or key is missing
        return {
            riskScore: 0,
            riskLevel: "Low",
            summary: "Could not perform AI analysis. Please check API Key.",
            flags: ["Analysis Failed"],
            visualFeatures: [],
            similarTrademarks: [],
            recommendationSummary: "Please retry."
        };
    }
};

export const generateSafeLogo = async (description, style) => {
    try {
        const prompt = `Create a professional logo for a South East Asian company with this description: ${description}. 
    Style: ${style}. 
    Ensure the logo is unique, distinctive, and avoids using generic clipart or restricted national symbols. 
    Design it to be trademark-safe. Elegant and modern aesthetic.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                imageConfig: {
                    aspectRatio: "1:1",
                    imageSize: "1K"
                }
            }
        });

        const images = [];
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    images.push(`data:image/png;base64,${part.inlineData.data}`);
                }
            }
        }
        return images;

    } catch (error) {
        console.error("Gemini Generation Error:", error);
        return [];
    }
};

export const getLegalAdvice = async (riskLevel, context) => {
    try {
        const prompt = `Provide detailed legal recommendations for a South East Asian (ASEAN) MSME trying to register a trademark. 
        The current risk level analyzed is: ${riskLevel}.
        Context/Issues found: ${context}.
        
        Provide output in Markdown format with sections:
        1. Immediate Actions
        2. Filing Suggestions (Mention ASEAN TMview or WIPO Madrid System where relevant)
        3. Risk Mitigation Strategy
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [{ text: prompt }]
            }
        });
        return response.text || "No advice generated.";
    } catch (e) {
        return "Unable to generate legal advice at this time.";
    }
}
