
// import { GoogleGenAI, GenerateContentResponse } from "@google/genai"; // No longer directly used here
import type { SearchCriteria, Recipe, GeminiRecipesResponse } from '../types';
// import { GEMINI_TEXT_MODEL } from '../constants'; // API_KEY and GEMINI_TEXT_MODEL are used in Function

// Direct API client initialization is removed from the frontend.
// if (!API_KEY) {
//   throw new Error("API_KEY is not defined. Please set the API_KEY environment variable.");
// }
// const ai = new GoogleGenAI({ apiKey: API_KEY });


// This function can remain if the Cloudflare function might return markdown-wrapped JSON,
// but if the function ensures it sends "application/json" and a clean JSON object,
// this might not be strictly necessary on the client-side for parsing the function's response.
// However, it's good for robustness if the function's response structure is uncertain.
function parseJsonFromApiResponse(responseBody: any): GeminiRecipesResponse {
  if (typeof responseBody === 'object' && responseBody !== null && responseBody.recipes) {
    return responseBody as GeminiRecipesResponse; // Already an object, likely JSON parsed by fetch
  }
  if (typeof responseBody === 'string') {
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = responseBody.match(fenceRegex);
    let jsonStr = responseBody.trim();
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      return JSON.parse(jsonStr) as GeminiRecipesResponse;
    } catch (e) {
      console.error("Failed to parse JSON from function response string:", e, "Original string:", responseBody);
      throw new Error("AI Functionからの応答形式が正しくありません。JSONの解析に失敗しました。");
    }
  }
  console.error("Unexpected response format from function:", responseBody);
  throw new Error("AI Functionから予期しない形式の応答がありました。");
}


export const generateRecipes = async (criteria: SearchCriteria): Promise<Omit<Recipe, 'id'>[]> => {
  try {
    const response = await fetch('/api/recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(criteria),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // If response is not JSON, use status text or a generic message
        errorData = { error: `APIリクエスト失敗: ${response.status} ${response.statusText}` };
      }
      console.error('Error from /api/recipe function:', errorData);
      throw new Error(errorData?.error || `レシピの取得に失敗しました (ステータス: ${response.status})`);
    }

    const responseData = await response.json(); // Expecting JSON response from the Function

    // The function should ideally return a clean JSON object.
    // If it might return a string (e.g., markdown wrapped), parse it.
    // For now, assume the function returns a direct JSON object.
    const parsedData: GeminiRecipesResponse = responseData;
    
    if (!parsedData.recipes || !Array.isArray(parsedData.recipes)) {
      console.error("Invalid recipes format from API Function:", parsedData);
      throw new Error("AI Functionからのレシピデータ形式が正しくありません。");
    }
    
    const validatedRecipes = parsedData.recipes.map(recipe => ({
      ...recipe,
      mainIngredients: Array.isArray(recipe.mainIngredients) ? recipe.mainIngredients : [],
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
    }));
    
    return validatedRecipes;

  } catch (error) {
    console.error('Error generating recipes via Cloudflare Function:', error);
    // Check for specific error messages if needed, e.g. safety violation
    if (error instanceof Error && error.message.toLowerCase().includes("safety")) {
         throw new Error("リクエスト内容が安全基準に違反しているため、レシピを生成できませんでした。入力内容を見直してください。");
    }
    throw new Error(`サーバーとの通信に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
};