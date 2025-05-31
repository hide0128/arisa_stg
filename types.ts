
export interface IngredientItem {
  name: string;
  quantity: string;
}

export interface NutritionInfo {
  protein?: string | null;
  fat?: string | null;
  carbs?: string | null;
}

export interface Recipe {
  id: string; 
  name: string;
  description: string;
  cookingTimeMinutes: number | null;
  calories: number | null;
  mainIngredients: string[];
  // imageUrl?: string | null; // Removed image URL
  ingredients: IngredientItem[];
  instructions: string[];
  nutrition?: NutritionInfo | null;
  tips?: string | null;
}

// Type expected from Gemini API after parsing
export interface GeminiRecipesResponse {
  recipes: Omit<Recipe, 'id'>[]; // Gemini won't return id, and imageUrl is removed
}

export enum MealType {
  ANY = "指定なし",
  BREAKFAST = "朝食",
  LUNCH = "昼食",
  DINNER = "夕食",
  DESSERT = "デザート",
  SNACK = "おやつ", // Kept in enum in case of future use, but not in current form
}

export enum Cuisine { // Kept in enum for potential future use or if API still uses it implicitly
  ANY = "指定なし",
  JAPANESE = "和食",
  WESTERN = "洋食",
  CHINESE = "中華",
  ITALIAN = "イタリアン",
  ETHNIC = "エスニック",
  KOREAN = "韓国料理",
  FRENCH = "フランス料理",
  INDIAN = "インド料理",
  MEXICAN = "メキシコ料理",
  OTHER = "その他・自由入力",
}

export enum CookingTime {
  ANY = "指定なし",
  UNDER_15 = "15分以内",
  UNDER_30 = "30分以内",
  UNDER_60 = "60分以内",
  OVER_60 = "じっくり(60分以上)", // Kept in enum for potential future use
}

export enum Allergen { // Kept in enum for potential future use
  EGG = "卵",
  DAIRY = "乳製品",
  WHEAT = "小麦",
  SHRIMP = "えび",
  CRAB = "かに",
  BUCKWHEAT = "そば",
  PEANUTS = "落花生",
}

export enum HealthPurposeTag { // Kept in enum for potential future use
  HEALTHY = "ヘルシー",
  DIET = "ダイエット向け",
  KIDS = "子供向け",
  EASY = "簡単",
  BUDGET = "節約",
  VEGETARIAN = "ベジタリアン",
  VEGAN = "ヴィーガン",
  LOW_CARB = "低糖質",
  HIGH_PROTEIN = "高タンパク",
}

export interface SearchCriteria {
  mealType: MealType;
  cookingTime: CookingTime;
}