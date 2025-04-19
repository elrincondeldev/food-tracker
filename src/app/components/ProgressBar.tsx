'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  goal: number;
  unit: string;
  date: string;
  percentage: number;
}

export default function ProgressBar({
  current,
  goal,
  unit,
  date,
  percentage,
}: ProgressBarProps) {
  // Get color based on percentage
  const getColorClass = () => {
    if (percentage < 80) return 'bg-gradient-to-r from-red-400 to-red-500';
    if (percentage < 100) return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
    return 'bg-gradient-to-r from-green-400 to-green-500';
  };

  // Get status text
  const getStatusText = () => {
    if (current < goal) {
      return `${goal - current} ${unit} under`;
    } else if (current > goal) {
      return `${current - goal} ${unit} over`;
    }
    return 'Goal reached!';
  };

  // Get status text color
  const getStatusTextColor = () => {
    if (current < goal) return 'text-red-600';
    if (current > goal) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-2 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">{date}</span>
        <span className="text-sm font-semibold text-gray-800">
          {current} / {goal} {unit}
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3 shadow-inner">
        <div
          className={`${getColorClass()} h-3 rounded-full transition-all duration-500 ease-in-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs">
        <span className="font-medium text-gray-600">{percentage}% of goal</span>
        <span className={`font-semibold ${getStatusTextColor()}`}>{getStatusText()}</span>
      </div>
    </div>
  );
} 