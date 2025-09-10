export interface Ingredient {
  name: string;
  quantity?: string;
}

export interface NutritionInfo {
  protein: number; // grams
  carbohydrates: number; // grams
  fat: number; // grams
}

export interface MealHistoryItem {
  _id: string;
  mealName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  ingredients: Ingredient[];
  totalCalories: number;
  nutrition: NutritionInfo;
  mealDate: string;
  mealTime: string;
  servingSize: string;
  preparationTime: number;
  cookingMethod: string;
  notes: string;
  tags: string[];
  imageUrl: string;
  rating: number | null;
  isGenerated: boolean;
  generatedRecipe: string;
  createdAt: string;
  updatedAt: string;
}

export interface MealData {
  _id?: string;
  mealName: string;
  ingredients: Array<Ingredient>;
  totalCalories: number;
  nutrition?: NutritionInfo;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other' | null;
  mealDate: string;
  mealTime: string;
  servingSize: string;
  preparationTime: number;
  cookingMethod: string;
  notes: string;
  tags: string[];
  rating: number | null;
  isGenerated: boolean;
}