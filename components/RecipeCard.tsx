
import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, TagIcon, StarIcon, FilledStarIcon, UsersIcon } from './Icons'; // Added UsersIcon

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
    >
      {/* Image section removed */}
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-blue-700 truncate mr-2 flex-grow" title={recipe.name}>{recipe.name}</h3>
          <button
            onClick={handleFavoriteClick}
            className="p-1.5 bg-white/80 hover:bg-gray-100 rounded-full shadow-sm transition-colors flex-shrink-0"
            aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
          >
            {isFavorite ? <FilledStarIcon className="w-6 h-6 text-sky-400" /> : <StarIcon className="w-6 h-6 text-sky-400" />}
          </button>
        </div>
        <p className="text-gray-600 text-sm mb-3 flex-grow leading-relaxed line-clamp-3" title={recipe.description}>{recipe.description}</p>
        
        <div className="mt-auto space-y-2 text-sm">
          {recipe.cookingTimeMinutes && (
            <div className="flex items-center text-gray-500">
              <ClockIcon className="w-4 h-4 mr-2 text-blue-500" />
              <span>調理時間: 約{recipe.cookingTimeMinutes}分</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center text-gray-500">
              <FireIcon className="w-4 h-4 mr-2 text-red-500" />
              <span>カロリー: 約{recipe.calories}kcal</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center text-gray-500">
              <UsersIcon className="w-4 h-4 mr-2 text-indigo-500" />
              <span>約{recipe.servings}人前</span>
            </div>
          )}
          {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
            <div className="flex items-start text-gray-500">
              <TagIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" />
              <span className="line-clamp-2">主な材料: {recipe.mainIngredients.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
       <div className="p-5 pt-2 border-t border-blue-100 mt-auto">
         <button 
            onClick={(e) => { e.stopPropagation(); onViewDetails(recipe);}}
            className="w-full mt-1 bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors duration-150"
          >
            詳細を見る
          </button>
       </div>
    </div>
  );
};