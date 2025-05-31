
import React from 'react';
import { APP_NAME } from '../constants';
import { StarIcon, SparklesIcon } from './Icons';

interface HeaderProps {
  onShowFavorites: () => void;
  favoriteCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onShowFavorites, favoriteCount }) => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-8 w-8 text-sky-300" />
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{APP_NAME}</h1>
        </div>
        <button
          onClick={onShowFavorites}
          className="relative flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors duration-150"
          aria-label="お気に入りを表示"
        >
          <StarIcon className="h-6 w-6 text-sky-300" />
          <span className="ml-2 hidden sm:inline">お気に入り</span>
          {favoriteCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {favoriteCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
