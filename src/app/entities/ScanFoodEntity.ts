export interface ScanFoodEntity {
  id: string;
  foodName: string;
  calories: number;
  proteins: number;
  fats: number;
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FoodAnalysisRequest {
  imageBase64: string;
}

export interface FoodAnalysisResponse {
  foodName: string;
  calories: number;
  proteins: number;
  fats: number;
}
