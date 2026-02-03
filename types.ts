
export interface FoodItem {
  name: string;
  weight: number; // in grams
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
  micros: {
    sodium: string;
    sugar: string;
  };
  isHighOil: boolean;
}

export interface NutritionReport {
  items: FoodItem[];
  totalCalories: number;
  healthSuitability: string;
  suggestions: string[];
}

export interface UserProfile {
  condition: 'none' | 'diabetes' | 'pcos' | 'hypertension' | 'weight-loss';
  dailyGoalCalories: number;
  dailyGoalProtein: number;
}
