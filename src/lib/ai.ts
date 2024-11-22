import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const hasApiKey = Boolean(API_KEY);

const genAI = new GoogleGenerativeAI(API_KEY || 'dummy-key');

interface AiResponse {
  tags: string[];
  folders: string[];
  organization: string[];
}

const DEFAULT_RESPONSE: AiResponse = {
  tags: [],
  folders: [],
  organization: []
};

export async function generateSuggestions(content: string): Promise<AiResponse> {
  if (!hasApiKey) {
    throw new Error('Please add your Gemini API key to the .env file to enable AI features.');
  }

  if (!content.trim()) {
    throw new Error('Please add some content to your note before analyzing.');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `As an AI assistant, analyze this note content and suggest organization improvements.
    
    Note content: "${content.slice(0, 1000)}"
    
    Provide suggestions in this exact JSON format:
    {
      "tags": ["tag1", "tag2", "tag3"],
      "folders": ["folder"],
      "organization": ["tip1", "tip2"]
    }

    Requirements:
    1. Tags: Provide 3 relevant, concise tags
    2. Folders: Suggest 1 descriptive folder name
    3. Organization: Give 2 actionable tips for better organization
    4. Keep all suggestions brief and specific
    5. Ensure the response is valid JSON
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      // Extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', text);
        return DEFAULT_RESPONSE;
      }

      const jsonStr = jsonMatch[0].trim();
      const parsed = JSON.parse(jsonStr);
      
      // Validate the response structure
      if (!parsed || typeof parsed !== 'object') {
        console.error('Invalid response structure:', parsed);
        return DEFAULT_RESPONSE;
      }

      // Ensure all required fields exist and are arrays
      const validatedResponse: AiResponse = {
        tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 3).map(tag => String(tag).trim()) : [],
        folders: Array.isArray(parsed.folders) ? parsed.folders.slice(0, 1).map(folder => String(folder).trim()) : [],
        organization: Array.isArray(parsed.organization) ? parsed.organization.slice(0, 2).map(tip => String(tip).trim()) : []
      };

      // Check if we have any valid suggestions
      if (validatedResponse.tags.length === 0 && 
          validatedResponse.folders.length === 0 && 
          validatedResponse.organization.length === 0) {
        console.warn('No valid suggestions found in response');
        return DEFAULT_RESPONSE;
      }

      return validatedResponse;
    } catch (parseError) {
      console.error('Failed to parse AI response:', text, parseError);
      return DEFAULT_RESPONSE;
    }
  } catch (error) {
    console.error('AI generation error:', error);
    throw new Error('Failed to generate suggestions. Please try again later.');
  }
}