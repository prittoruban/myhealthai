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
    if (percentage <= 50) return 'text-[#f70776]';
    if (percentage <= 80) return 'text-yellow-400';
    return 'text-red-400';
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
            className="text-gray-700"
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
            className={`${getColor()} transition-all duration-500 drop-shadow-[0_0_8px_currentColor]`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getColor()}`}>
            {current}
          </span>
          <span className="text-sm text-gray-400">/ {goal} ml</span>
        </div>
      </div>
      <p className="mt-4 text-white font-medium">{label}</p>
      <p className="text-sm text-gray-400">{percentage.toFixed(0)}% of daily goal</p>
    </div>
  );
}
