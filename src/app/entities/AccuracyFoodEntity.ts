export interface AccuracyFoodGptRequest {
  imageBase64: string;
  recipeName: string;
  recipeIngredients: recipeIngredients[];
  moreDetails?: string;
}

interface recipeIngredients {
  igredientName: string;
  igredientUnit?: ingredientUnit;
  quantity?: number;
}

enum ingredientUnit {
  "ud",
  "g",
  "l",
}
