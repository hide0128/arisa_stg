
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { SearchCriteria, Recipe, GeminiRecipesResponse } from '../types';
import { API_KEY, GEMINI_TEXT_MODEL } from '../constants'; // Removed GEMINI_IMAGE_MODEL

if (!API_KEY) {
  throw new Error("API_KEY is not defined. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

function parseJsonFromMarkdown(markdownString: string): any {
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = markdownString.match(fenceRegex);
  let jsonStr = markdownString.trim();
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON from markdown:", e, "Original string:", markdownString);
    throw new Error("AIからの応答形式が正しくありません。JSONの解析に失敗しました。");
  }
}


export const generateRecipes = async (criteria: SearchCriteria): Promise<Omit<Recipe, 'id'>[]> => {
  const prompt = `
あなたは経験豊富なシェフであり、スマートなレシピ提案アシスタントです。
以下の条件に合う、創造的で美味しく、家庭で作りやすいレシピを3つ提案してください。

出力は必ずJSON形式で、以下の厳密な構造に従ってください:
\`\`\`json
{
  "recipes": [
    {
      "name": "料理名 (例: 鶏むね肉と彩り野菜のハーブグリル)",
      "description": "キャッチーな説明文 (例: ヘルシーで満足感たっぷり！ハーブの香りが食欲をそそる一品です。)",
      "cookingTimeMinutes": 30,
      "calories": 450,
      "mainIngredients": ["鶏むね肉", "パプリカ", "ズッキーニ"],
      "ingredients": [
        {"name": "鶏むね肉", "quantity": "200g"},
        {"name": "パプリカ (赤・黄)", "quantity": "各1/2個"},
        {"name": "ズッキーニ", "quantity": "1/2本"},
        {"name": "オリーブオイル", "quantity": "大さじ1"},
        {"name": "乾燥ハーブミックス（オレガノ、バジルなど）", "quantity": "小さじ1"},
        {"name": "塩", "quantity": "少々"},
        {"name": "黒こしょう", "quantity": "少々"}
      ],
      "instructions": [
        "鶏むね肉は一口大に切り、塩胡椒、ハーブミックスを揉み込む。",
        "パプリカ、ズッキーニは乱切りにする。",
        "フライパンにオリーブオイルを熱し、鶏肉を中火で焼く。焼き色がついたら野菜を加えて炒め合わせる。",
        "全体に火が通ったら完成。"
      ],
      "nutrition": {
        "protein": "35g",
        "fat": "15g",
        "carbs": "20g"
      },
      "tips": "レモン汁をかけるとさっぱりします。お好みの野菜を追加しても美味しいです。"
    }
  ]
}
\`\`\`

ユーザーの条件:
- 主な食材: 指定なし
- 食事の種類: ${criteria.mealType}
- 料理ジャンル: 指定なし
- 調理時間: ${criteria.cookingTime}
- アレルギー対応 (これらの食材は使用しないでください): 特になし
- 健康・目的別タグ: 特になし
- その他キーワード: 特になし

注意事項:
- 各レシピはユニークで、多様性のある提案を心がけてください。
- 材料リストは具体的な分量を含めてください。
- 手順は具体的で分かりやすく、ステップバイステップで記述してください。
- 栄養情報は推定値で構いません。不明な場合はnullまたは項目自体を省略してください。
- アレルギー対応の指示は厳守してください。
- 提案するレシピは必ず3つにしてください。
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_TEXT_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json", // Request JSON output
        temperature: 0.7, // For some creativity
      }
    });

    const responseText = response.text;
    const parsedData: GeminiRecipesResponse = parseJsonFromMarkdown(responseText);
    
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

// Removed generateImageForRecipe function
/*
export const generateImageForRecipe = async (recipeName: string): Promise<string | null> => {
  // ... implementation removed ...
};
*/