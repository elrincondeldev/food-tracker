"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "../components/ProgressBar";
import WeeklySummary from "../components/WeeklySummary";
import Link from "next/link";

interface NutritionalData {
  dailyCalories: number;
  macronutrients: {
    proteins: number;
    carbs: number;
    fats: number;
  };
}

interface AnalysisData {
  date: string;
  totalCalories: number;
  totalProteins: number;
  totalFats: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [nutritionalData, setNutritionalData] =
    useState<NutritionalData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/registerData");

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();

        // Get the most recent user data
        if (data && data.length > 0) {
          const latestUser = data[data.length - 1];
          setNutritionalData(latestUser.nutritionalData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAnalysisData = async () => {
      try {
        const response = await fetch("/api/analysis");
        const data = await response.json();
        setAnalysisData(data.data || []);
      } catch (err) {
        console.error("Error fetching analysis data:", err);
      }
    };

    fetchUserData();
    fetchAnalysisData();
  }, []);

  // Format date to display as "Apr 18" instead of "2025-04-18"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate percentage of goal achieved
  const calculatePercentage = (actual: number, goal: number) => {
    return Math.min(Math.round((actual / goal) * 100), 100);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your nutritional data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <div className="p-4 bg-red-50 text-red-700 rounded-lg mb-4 border border-red-100">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
          <button
            onClick={() => router.push("/register")}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Back to Registration
          </button>
        </div>
      </div>
    );
  }

  if (!nutritionalData) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            No Data Available
          </h1>
          <p className="text-gray-600 mb-4 text-center">
            No nutritional data found. Please register first.
          </p>
          <button
            onClick={() => router.push("/register")}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-end mb-10">
        <Link
          href="/scan"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Scan food
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-lg mb-6 border border-gray-100">
        <h1 className="text-2xl font-bold mb-6 text-center p-6 border-b border-gray-100 text-gray-800">
          Your Nutritional Plan
        </h1>

        <div className="p-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl mb-6 border border-blue-100">
            <h2 className="text-xl font-semibold mb-2 text-blue-800">
              Daily Calories
            </h2>
            <p className="text-3xl font-bold text-blue-600">
              {nutritionalData.dailyCalories} kcal
            </p>
          </div>

          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Macronutrients
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl text-center border border-green-100">
              <p className="text-sm font-medium text-green-700">Proteins</p>
              <p className="text-2xl font-bold text-green-600">
                {nutritionalData.macronutrients.proteins}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl text-center border border-amber-100">
              <p className="text-sm font-medium text-amber-700">Carbs</p>
              <p className="text-2xl font-bold text-amber-600">
                {nutritionalData.macronutrients.carbs}g
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 p-4 rounded-xl text-center border border-red-100">
              <p className="text-sm font-medium text-red-700">Fats</p>
              <p className="text-2xl font-bold text-red-600">
                {nutritionalData.macronutrients.fats}g
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => router.push("/register")}
              className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors duration-200"
            >
              Update Registration
            </button>
          </div>
        </div>
      </div>

      {/* Weekly Summary Section */}
      {analysisData.length > 0 && (
        <div className="mb-6">
          <WeeklySummary
            data={analysisData}
            goals={{
              dailyCalories: nutritionalData.dailyCalories,
              macronutrients: {
                proteins: nutritionalData.macronutrients.proteins,
                fats: nutritionalData.macronutrients.fats,
              },
            }}
          />
        </div>
      )}

      {/* Daily Progress Section */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center p-6 border-b border-gray-100 text-gray-800">
          Daily Progress
        </h2>

        <div className="p-6">
          {analysisData.length === 0 ? (
            <div className="text-center py-8">
              <div className="mb-4 text-5xl">📊</div>
              <p className="text-gray-600 mb-2 text-lg font-medium">
                No data available for the past 7 days.
              </p>
              <p className="text-gray-500">
                Start tracking your meals to see your progress!
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Calories Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Calories
                </h3>
                <div className="space-y-4">
                  {analysisData.map((day) => (
                    <ProgressBar
                      key={day.date}
                      current={day.totalCalories}
                      goal={nutritionalData.dailyCalories}
                      unit="kcal"
                      date={formatDate(day.date)}
                      percentage={calculatePercentage(
                        day.totalCalories,
                        nutritionalData.dailyCalories
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Proteins Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Proteins
                </h3>
                <div className="space-y-4">
                  {analysisData.map((day) => (
                    <ProgressBar
                      key={day.date}
                      current={day.totalProteins}
                      goal={nutritionalData.macronutrients.proteins}
                      unit="g"
                      date={formatDate(day.date)}
                      percentage={calculatePercentage(
                        day.totalProteins,
                        nutritionalData.macronutrients.proteins
                      )}
                    />
                  ))}
                </div>
              </div>

              {/* Fats Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800">
                  Fats
                </h3>
                <div className="space-y-4">
                  {analysisData.map((day) => (
                    <ProgressBar
                      key={day.date}
                      current={day.totalFats}
                      goal={nutritionalData.macronutrients.fats}
                      unit="g"
                      date={formatDate(day.date)}
                      percentage={calculatePercentage(
                        day.totalFats,
                        nutritionalData.macronutrients.fats
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
