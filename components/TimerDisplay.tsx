import React from 'react';
import { TimerStatus } from '../types';

interface TimerDisplayProps {
  remainingSeconds: number;
  totalSeconds: number;
  status: TimerStatus;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({ remainingSeconds, totalSeconds, status }) => {
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentage = totalSeconds > 0 ? (remainingSeconds / totalSeconds) * 100 : 0;
  
  // Determine color based on urgency
  let colorClass = "text-debate-dark";
  let ringColorClass = "stroke-debate-blue";
  
  if (remainingSeconds <= 30 && remainingSeconds > 10) {
    colorClass = "text-orange-600";
    ringColorClass = "stroke-orange-500";
  } else if (remainingSeconds <= 10) {
    colorClass = "text-red-600";
    ringColorClass = "stroke-red-600";
  }

  return (
    <div className="relative flex flex-col items-center justify-center my-8">
      {/* Outer Ring Decoration (mimicking the blue circle in poster) */}
      <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
        
        {/* Background Circle */}
        <div className="absolute inset-0 rounded-full bg-white shadow-xl border-4 border-gray-100"></div>
        
        {/* SVG Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform p-2">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="stroke-gray-200 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className={`fill-none transition-all duration-1000 ease-linear ${ringColorClass}`}
            strokeWidth="8"
            strokeDasharray="283%" /* 2 * PI * 45% approx */
            strokeDashoffset={`${283 - (283 * percentage) / 100}%`}
            strokeLinecap="round"
          />
        </svg>

        {/* Time Text */}
        <div className="relative z-10 flex flex-col items-center">
           <span className={`text-6xl md:text-8xl font-black tabular-nums tracking-tighter transition-colors duration-300 ${colorClass}`}>
            {formatTime(remainingSeconds)}
          </span>
          <span className="text-gray-400 font-medium text-sm mt-2 uppercase tracking-widest">
            {status === 'finished' ? 'Time Up' : 'Remaining'}
          </span>
        </div>
      </div>
    </div>
  );
};