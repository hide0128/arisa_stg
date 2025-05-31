
import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, TagIcon, StarIcon, FilledStarIcon } from './Icons';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewDetails, onToggleFavorite, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking favorite
    onToggleFavorite(recipe);
  };
  
  return (
    <div 
      onClick={() => onViewDetails(recipe)}
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 ease-in-out cursor-pointer flex flex-col h-full border border-blue-100 hover:border-blue-300"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onViewDetails(recipe); }}
      aria-label={`「${recipe.name}」の詳細を見る`}
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-blue-700 group-hover:text-blue-600 transition-colors">
            {recipe.name}
          </h3>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 text-gray-400 hover:text-yellow-500 rounded-full hover:bg-yellow-100 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-300"
            aria-label={isFavorite ? `「${recipe.name}」をお気に入りから削除` : `「${recipe.name}」をお気に入りに追加`}
            title={isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          >
            {isFavorite ? <FilledStarIcon className="w-6 h-6 text-yellow-400" /> : <StarIcon className="w-6 h-6" />}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">{recipe.description}</p>
        
        <div className="mt-auto space-y-2 text-sm text-gray-500">
          {recipe.cookingTimeMinutes && (
            <div className="flex items-center">
              <ClockIcon className="w-4 h-4 mr-1.5 text-blue-500 flex-shrink-0" />
              <span>約 {recipe.cookingTimeMinutes} 分</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center">
              <FireIcon className="w-4 h-4 mr-1.5 text-red-500 flex-shrink-0" />
              <span>約 {recipe.calories} kcal</span>
            </div>
          )}
          {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
            <div className="flex items-center">
              <TagIcon className="w-4 h-4 mr-1.5 text-sky-500 flex-shrink-0" />
              <span className="truncate" title={`主な材料: ${recipe.mainIngredients.join(', ')}`}>
                主な材料: {recipe.mainIngredients.join(', ')}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-blue-50 text-center border-t border-blue-100">
        <span className="text-sm font-medium text-blue-600 hover:underline">
          詳細を見る
        </span>
      </div>
    </div>
  );
};
