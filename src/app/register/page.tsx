'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Define the form data interface
interface RegisterFormData {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  height: number;
  physicalActivity: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
  goal: 'lose' | 'maintain' | 'gain';
}

// Define the initial form state
const initialFormData: RegisterFormData = {
  age: 0,
  gender: 'male',
  weight: 0,
  height: 0,
  physicalActivity: 'moderate',
  goal: 'maintain',
};

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields to numbers
    if (name === 'age' || name === 'weight' || name === 'height') {
      setFormData({
        ...formData,
        [name]: value === '' ? 0 : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
    
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      newErrors.age = 'Please enter a valid age (1-120)';
    }
    
    if (!formData.weight || formData.weight < 20 || formData.weight > 300) {
      newErrors.weight = 'Please enter a valid weight in kg (20-300)';
    }
    
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      newErrors.height = 'Please enter a valid height in cm (100-250)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const response = await fetch('/api/registerData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to register data');
      }
      
      // Successfully registered, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center p-6 border-b text-gray-900">User Registration</h1>
      
      {submitError && (
        <div className="mx-6 mb-4 p-3 bg-red-100 text-red-800 rounded-md">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4 p-6">
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-800 mb-1">
            Age
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age || ''}
            onChange={handleChange}
            placeholder="Enter your age"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-600 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
            min="1"
            max="120"
          />
          {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age}</p>}
        </div>
        
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-800 mb-1">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="weight" className="block text-sm font-medium text-gray-800 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formData.weight || ''}
            onChange={handleChange}
            placeholder="Enter your weight in kg"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-600 ${errors.weight ? 'border-red-500' : 'border-gray-300'}`}
            min="20"
            max="300"
            step="0.1"
          />
          {errors.weight && <p className="mt-1 text-sm text-red-600">{errors.weight}</p>}
        </div>
        
        <div>
          <label htmlFor="height" className="block text-sm font-medium text-gray-800 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            id="height"
            name="height"
            value={formData.height || ''}
            onChange={handleChange}
            placeholder="Enter your height in cm"
            className={`w-full px-3 py-2 border rounded-md text-gray-900 placeholder-gray-600 ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
            min="100"
            max="250"
          />
          {errors.height && <p className="mt-1 text-sm text-red-600">{errors.height}</p>}
        </div>
        
        <div>
          <label htmlFor="physicalActivity" className="block text-sm font-medium text-gray-800 mb-1">
            Physical Activity Level
          </label>
          <select
            id="physicalActivity"
            name="physicalActivity"
            value={formData.physicalActivity}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          >
            <option value="sedentary">Sedentary (little or no exercise)</option>
            <option value="light">Light (exercise 1-3 days/week)</option>
            <option value="moderate">Moderate (exercise 3-5 days/week)</option>
            <option value="very">Very Active (exercise 6-7 days/week)</option>
            <option value="extra">Extra Active (very active + physical job)</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-800 mb-1">
            Goal
          </label>
          <select
            id="goal"
            name="goal"
            value={formData.goal}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Register'}
        </button>
      </form>
    </div>
  );
}
