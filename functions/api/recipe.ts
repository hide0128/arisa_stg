
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
// Path adjusted to import from root types.ts, assuming 'functions' and 'types.ts' are siblings to the project root (or src root).
import type { SearchCriteria, Recipe, GeminiRecipesResponse } from '../../types'; 

// Environment variable expected to be set in Cloudflare Pages settings
interface Env {
  GEMINI_API_KEY: string;
}

// Minimal type definitions for Cloudflare Pages Functions environment
interface EventContext<EnvType = any, ParamsType extends string = any, DataType extends Record<string, unknown> = Record<string, unknown>> {
  request: Request;
  env: EnvType;
  params: Readonly<ParamsType extends `${string}:${infer ParameterName}` ? Record<ParameterName, string> : Record<ParamsType, string>>;
  waitUntil: (promise: Promise<any>) => void;
  next: (input?: Request | string, init?: RequestInit) => Promise<Response>;
  data: DataType;
}

interface PagesFunction<
  EnvType = any,
  ParamsType extends string = any,
  DataType extends Record<string, unknown> = Record<string, unknown>
> {
  (context: EventContext<EnvType, ParamsType, DataType>): Response | Promise<Response>;
}


function parseJsonFromMarkdown(markdownString: string): GeminiRecipesResponse {
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    let jsonStr = markdownString.trim();
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.recipes)) {
        return parsed as GeminiRecipesResponse;
      }
      throw new Error("Parsed JSON does not match expected GeminiRecipesResponse structure.");
    } catch (e) {
      console.error("Failed to parse JSON from markdown in Function:", e, "Original string:", markdownString);
      throw new Error(`AIからの応答形式が正しくありません。JSONの解析に失敗しました: ${e instanceof Error ? e.message : String(e)}`);
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const apiKey = context.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'APIキーが設定されていません。管理者にお問い合わせください。' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      });
    }

    let criteria: SearchCriteria;
    try {
        criteria = await context.request.json();
    } catch (e) {
        return new Response(JSON.stringify({ error: 'リクエストの形式が正しくありません。JSONを確認してください。' }), {
            status: 400, // Bad Request
            headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        });
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
あなたは経験豊富なシェフであり、スマートなレシピ提案アシスタントです。
以下の条件に合う、創造的で美味しく、家庭で作りやすいレシピを3つ提案してください。

出力は必ずJSON形式で、以下の厳密な構造に従ってください:
\\\`\\\`\\\`json
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
        {"name": "パプリカ (赤・黄)", "quantity": "各1/2個"}
      ],
      "instructions": [
        "鶏むね肉は一口大に切り、塩胡椒、ハーブミックスを揉み込む。"
      ],
      "nutrition": {
        "protein": "35g",
        "fat": "15g",
        "carbs": "20g"
      },
      "tips": "レモン汁をかけるとさっぱりします。"
    }
  ]
}
\\\`\\\`\\\`

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

    const genAIResponse: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const responseText = genAIResponse.text;
    const parsedData: GeminiRecipesResponse = parseJsonFromMarkdown(responseText);

    return new Response(JSON.stringify(parsedData), {
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });

  } catch (error: any) {
    console.error('Error in Cloudflare Function (onRequestPost):', error); 

    let errorMessage = 'サーバー内部でエラーが発生しました。';
    let errorStack = '';

    if (error instanceof Error) {
        errorMessage = error.message;
        errorStack = error.stack || 'N/A'; 
        if (error.message.toLowerCase().includes("safety")) {
            errorMessage = "リクエスト内容が安全基準に違反しているため、レシピを生成できませんでした。入力内容を見直してください。";
        }
    } else if (typeof error === 'string') {
        errorMessage = error;
    } else if (error && typeof error.toString === 'function') {
        errorMessage = error.toString();
    }
    
    console.error(`Cloudflare Function Error Details: Message - "${errorMessage}", Stack - "${errorStack}"`);
    
    return new Response(JSON.stringify({ error: `APIリクエスト処理中にエラーが発生しました: ${errorMessage}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    });
  }
};
