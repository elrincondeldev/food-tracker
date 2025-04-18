export interface AccuracyFoodGptRequest {
  imageBase64: string;
  recipeName: string;
  recipeIngredients: recipeIngredients[];
  moreDetails?: string;
}

interface recipeIngredients {
  igredientName: string;
  igredientUnit?: ingredientUnit;
}

enum ingredientUnit {
  "ud",
  "kg",
  "l",
}
