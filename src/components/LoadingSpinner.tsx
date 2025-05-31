
import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "読み込み中...", size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 border-4',
    md: 'w-12 h-12 border-[6px]',
    lg: 'w-16 h-16 border-8',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-[100]">
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} border-orange-500 border-t-transparent`}
      ></div>
      {message && <p className="mt-4 text-white text-lg font-semibold">{message}</p>}
    </div>
  );
};
    