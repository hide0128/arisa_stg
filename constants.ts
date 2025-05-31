
import { MealType, CookingTime } from './types';

export const APP_NAME = "AIスマートレシピアシスタント";

export const MEAL_TYPE_BUTTON_OPTIONS: { value: MealType, label: string }[] = [
  { value: MealType.ANY, label: "指定なし" },
  { value: MealType.BREAKFAST, label: "朝食" },
  { value: MealType.LUNCH, label: "昼食" },
  { value: MealType.DINNER, label: "夕食" },
  { value: MealType.DESSERT, label: "デザート" },
];

export const COOKING_TIME_BUTTON_OPTIONS: { value: CookingTime, label: string }[] = [
  { value: CookingTime.ANY, label: "指定なし" },
  { value: CookingTime.UNDER_15, label: "15分以内" },
  { value: CookingTime.UNDER_30, label: "30分以内" },
  { value: CookingTime.UNDER_60, label: "60分以内" },
];

export const GEMINI_TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';
// export const GEMINI_IMAGE_MODEL = 'imagen-3.0-generate-002'; // Removed

// Placeholder for API Key - In a real app, this MUST be handled securely and not hardcoded.
// For this exercise, we assume process.env.API_KEY is set in the environment.
export const API_KEY = process.env.API_KEY;