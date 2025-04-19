'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface RecipeAnalysis {
  foodName: string;
  calories: number;
  proteins: number;
  fats: number;
  recipeName: string;
  ingredients: Array<{
    igredientName: string;
    igredientUnit?: string;
    quantity?: number;
  }>;
}

interface Ingredient {
  igredientName: string;
  igredientUnit?: string;
  quantity?: number;
}

const MEASUREMENT_UNITS = [
  { value: '', label: 'No unit' },
  { value: 'ud', label: 'Unidad (ud)' },
  { value: 'g', label: 'Gramos (g)' },
  { value: 'l', label: 'Litros (l)' },
];

export default function ScanPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<RecipeAnalysis | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // New state for form fields
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [moreDetails, setMoreDetails] = useState('');
  const [newIngredient, setNewIngredient] = useState({ name: '', unit: '', quantity: '' });

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = document.createElement('img');
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Calculate new dimensions while maintaining aspect ratio
          let width = img.width;
          let height = img.height;
          const maxDimension = 800;
          
          if (width > height && width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
          
          canvas.width = width;
          canvas.height = height;
          
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Compress the image
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl.split(',')[1]); // Remove the data URL prefix
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setAnalysis(null);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreviewUrl(previewUrl);

      // Compress the image
      const compressedBase64 = await compressImage(file);
      setSelectedImage(compressedBase64);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleProcessImage = async () => {
    if (!selectedImage) return;

    try {
      setError(null);
      setAnalysis(null);
      
      // Send to API
      setIsLoading(true);
      const response = await fetch('/api/recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageBase64: selectedImage,
          recipeName,
          recipeIngredients: ingredients,
          moreDetails,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }

      const data = await response.json();
      setAnalysis(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setPreviewUrl(null);
    setSelectedImage(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddIngredient = () => {
    if (newIngredient.name.trim()) {
      setIngredients([...ingredients, {
        igredientName: newIngredient.name.trim(),
        igredientUnit: newIngredient.unit || undefined,
        quantity: newIngredient.quantity ? parseFloat(newIngredient.quantity) : undefined
      }]);
      setNewIngredient({ name: '', unit: '', quantity: '' });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Scan Your Food
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-6">
          {/* Informative Message */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-blue-800 text-sm">
              <span className="font-semibold">Tip:</span> While only the photo is required, providing recipe details will help us give you a more accurate nutritional analysis.
            </p>
          </div>

          {/* Recipe Name Input */}
          <div>
            <label htmlFor="recipeName" className="block text-sm font-medium text-gray-800 mb-1">
              Recipe Name <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              id="recipeName"
              value={recipeName}
              onChange={(e) => setRecipeName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              placeholder="Enter recipe name"
            />
          </div>

          {/* Ingredients Input */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1">
              Ingredients <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 px-3 py-2 bg-gray-50 rounded-md text-gray-900">
                    {ingredient.igredientName}
                    {ingredient.quantity && ` (${ingredient.quantity}`}
                    {ingredient.igredientUnit && ` ${ingredient.igredientUnit}`}
                    {ingredient.quantity && ')'}
                  </span>
                  <button
                    onClick={() => handleRemoveIngredient(index)}
                    className="p-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newIngredient.name}
                  onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Ingredient name"
                />
                <input
                  type="number"
                  value={newIngredient.quantity}
                  onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })}
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="Quantity"
                  min="0"
                  step="0.1"
                />
                <select
                  value={newIngredient.unit}
                  onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })}
                  className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
                >
                  {MEASUREMENT_UNITS.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddIngredient}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Additional Details Input */}
          <div>
            <label htmlFor="moreDetails" className="block text-sm font-medium text-gray-800 mb-1">
              Additional Details <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <textarea
              id="moreDetails"
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              rows={3}
              placeholder="Enter any additional details about the recipe"
            />
          </div>

          {/* Image Upload and Preview Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                Take or Upload Photo
              </button>
              <p className="mt-2 text-sm text-gray-700">
                Supported formats: JPG, PNG
              </p>
            </div>

            {previewUrl && (
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={previewUrl}
                    alt="Food preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleRetake}
                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                  >
                    Retake Photo
                  </button>
                  {!analysis && (
                    <button
                      onClick={handleProcessImage}
                      className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Process Image
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600 font-medium">
                Analyzing your food...
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100">
                <h2 className="text-xl font-semibold mb-2 text-blue-800">
                  Analysis Results
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Food Name</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {analysis.foodName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Calories</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {analysis.calories} kcal
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Proteins</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {analysis.proteins}g
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fats</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {analysis.fats}g
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleRetake}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
                >
                  Scan Another
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  View Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
