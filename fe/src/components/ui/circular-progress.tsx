import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    className?: string;
    showValue?: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
    value,
    size = 120,
    strokeWidth = 8,
    className,
    showValue = true,
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    // Color based on value
    const getColor = (val: number) => {
        if (val >= 80) return '#22c55e'; // green
        if (val >= 60) return '#008DDA'; // blue
        if (val >= 40) return '#f59e0b'; // orange
        return '#ef4444'; // red
    };

    const color = getColor(value);

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={color}
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            {showValue && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold" style={{ color }}>
                        {value.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500">/ 100</span>
                </div>
            )}
        </div>
    );
};

