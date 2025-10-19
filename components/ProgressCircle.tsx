'use client';

interface ProgressCircleProps {
  current: number;
  goal: number;
  label: string;
}

export default function ProgressCircle({
  current,
  goal,
  label,
}: ProgressCircleProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage <= 50) return 'text-green-600';
    if (percentage <= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={`${getColor()} transition-all duration-500`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>
            {current}
          </span>
          <span className="text-sm text-gray-500">/ {goal} ml</span>
        </div>
      </div>
      <p className="mt-4 text-gray-700 font-medium">{label}</p>
      <p className="text-sm text-gray-500">{percentage.toFixed(0)}% of daily goal</p>
    </div>
  );
}
