
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import type { SearchCriteria, Recipe, GeminiRecipesResponse } from '../types';
import { API_KEY, GEMINI_TEXT_MODEL, DEFAULT_SERVINGS } from '../constants';

if (!API_KEY) {
  throw new Error("API_KEY is not defined. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "料理名" },
        description: { type: Type.STRING, description: "キャッチーな説明文" },
        cookingTimeMinutes: { type: Type.INTEGER, description: "調理時間（分）" },
        calories: { type: Type.INTEGER, description: "カロリー (kcal)" },
        servings: { type: Type.INTEGER, description: "何人前か" },
        mainIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "主な材料のリスト"
        },
        ingredients: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "材料名" },
                    quantity: { type: Type.STRING, description: "分量" },
                },
                required: ["name", "quantity"],
            },
            description: "材料のリスト"
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "作り方の手順リスト"
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                protein: { type: Type.STRING, description: "タンパク質" },
                fat: { type: Type.STRING, description: "脂質" },
                carbs: { type: Type.STRING, description: "炭水化物" },
            },
        },
        tips: {
            type: Type.STRING,
            description: "料理のコツやアレンジ案",
        },
    },
    required: ["name", "description", "cookingTimeMinutes", "calories", "servings", "mainIngredients", "ingredients", "instructions"],
};

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        recipes: {
            type: Type.ARRAY,
            description: "提案された3つのレシピのリスト。必ず3つ提案してください。",
            items: recipeSchema,
        },
    },
    required: ["recipes"],
};

export const generateRecipes = async (criteria: SearchCriteria): Promise<Omit<Recipe, 'id'>[]> => {
  const servings = criteria.servings || DEFAULT_SERVINGS;
  const prompt = `
あなたは経験豊富なシェフであり、スマートなレシピ提案アシスタントです。
以下の条件に合う、創造的で美味しく、家庭で作りやすいレシピを3つ提案してください。
レシピの材料は指定された人数分（今回は${servings}人前）に調整してください。

ユーザーの条件:
- 食事の種類: ${criteria.mealType}
- 調理時間: ${criteria.cookingTime}
- 人数: ${servings}人前
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, // For more creative and varied recipes
      }
    });

    const responseText = response.text;
    let parsedData: GeminiRecipesResponse;
    try {
        parsedData = JSON.parse(responseText);
    } catch (e) {
        console.error("Failed to parse JSON from response:", e, "Original string:", responseText);
        throw new Error("AIからの応答形式が正しくありません。JSONの解析に失敗しました。");
    }
    
    if (!parsedData.recipes || !Array.isArray(parsedData.recipes)) {
      console.error("Invalid recipes format from API:", parsedData);
      throw new Error("AIからのレシピデータ形式が正しくありません。");
    }
    
    // Ensure mainIngredients, ingredients, and instructions are always arrays
    const validatedRecipes = parsedData.recipes.map(recipe => ({
      ...recipe,
      mainIngredients: Array.isArray(recipe.mainIngredients) ? recipe.mainIngredients : [],
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : [],
      servings: typeof recipe.servings === 'number' ? recipe.servings : servings, // Ensure servings is a number
    }));
    
    return validatedRecipes;

  } catch (error) {
    console.error('Error generating recipes from Gemini:', error);
    if (error instanceof Error && error.message.includes("SAFETY")) {
         throw new Error("リクエスト内容が安全基準に違反しているため、レシピを生成できませんでした。入力内容を見直してください。");
    }
    throw new Error(`Gemini APIとの通信に失敗しました: ${error instanceof Error ? error.message : String(error)}`);
  }
};
