"use client";

import React from "react";

interface WeeklySummaryProps {
  data: {
    date: string;
    totalCalories: number;
    totalProteins: number;
    totalFats: number;
  }[];
  goals: {
    dailyCalories: number;
    macronutrients: {
      proteins: number;
      fats: number;
    };
  };
}

export default function WeeklySummary({ data, goals }: WeeklySummaryProps) {
  // Calculate average percentage for the week
  const calculateAveragePercentage = (values: number[], goal: number) => {
    if (values.length === 0) return 0;
    const sum = values.reduce((acc, val) => acc + (val / goal) * 100, 0);
    return Math.round(sum / values.length);
  };

  // Get color based on percentage
  const getColorClass = (percentage: number) => {
    if (percentage < 80) return "bg-red-500";
    if (percentage < 100) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Format date to display as "Apr 18" instead of "2025-04-18"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate average values for the week
  const caloriesValues = data.map((day) => day.totalCalories);
  const proteinsValues = data.map((day) => day.totalProteins);
  const fatsValues = data.map((day) => day.totalFats);

  const avgCaloriesPercentage = calculateAveragePercentage(
    caloriesValues,
    goals.dailyCalories
  );
  const avgProteinsPercentage = calculateAveragePercentage(
    proteinsValues,
    goals.macronutrients.proteins
  );
  const avgFatsPercentage = calculateAveragePercentage(
    fatsValues,
    goals.macronutrients.fats
  );

  // Calculate average daily values
  const avgCalories =
    data.length > 0
      ? Math.round(caloriesValues.reduce((a, b) => a + b, 0) / data.length)
      : 0;

  const avgProteins =
    data.length > 0
      ? Math.round(proteinsValues.reduce((a, b) => a + b, 0) / data.length)
      : 0;

  const avgFats =
    data.length > 0
      ? Math.round(fatsValues.reduce((a, b) => a + b, 0) / data.length)
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center p-6 border-b border-gray-100 text-gray-800">
        Weekly Summary
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Calories Summary */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-blue-600">Calories</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-blue-600">
              {avgCalories}
            </span>
            <span className="text-sm text-gray-600">
              / {goals.dailyCalories} kcal
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`${getColorClass(
                avgCaloriesPercentage
              )} h-2.5 rounded-full`}
              style={{ width: `${avgCaloriesPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {avgCaloriesPercentage}% of daily goal on average
          </p>
        </div>

        {/* Proteins Summary */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-green-600">Proteins</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-green-600">
              {avgProteins}
            </span>
            <span className="text-sm text-gray-600">
              / {goals.macronutrients.proteins}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`${getColorClass(
                avgProteinsPercentage
              )} h-2.5 rounded-full`}
              style={{ width: `${avgProteinsPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {avgProteinsPercentage}% of daily goal on average
          </p>
        </div>

        {/* Fats Summary */}
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2 text-red-600">Fats</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold text-red-600">{avgFats}</span>
            <span className="text-sm text-gray-600">
              / {goals.macronutrients.fats}g
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div
              className={`${getColorClass(
                avgFatsPercentage
              )} h-2.5 rounded-full`}
              style={{ width: `${avgFatsPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            {avgFatsPercentage}% of daily goal on average
          </p>
        </div>
      </div>

      {/* Daily Breakdown */}
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4 text-gray-800">Daily Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Calories
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Proteins
                </th>
                <th
                  scope="col"
                  className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Fats
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((day) => (
                <tr key={day.date}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(day.date)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {day.totalCalories} / {goals.dailyCalories}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {day.totalProteins} / {goals.macronutrients.proteins}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {day.totalFats} / {goals.macronutrients.fats}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
