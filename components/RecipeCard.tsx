
import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, TagIcon, StarIcon, FilledStarIcon, UsersIcon } from './Icons';
import { motion, Variants } from 'framer-motion';

interface RecipeCardProps {
  recipe: Recipe;
  onViewDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
  animationVariants?: Variants; // For staggered list animation
}

const cardHoverVariants = {
  hover: { 
    scale: 1.03, 
    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
    borderColor: "rgba(59, 130, 246, 0.5)" // blue-500
  },
  tap: { scale: 0.98 }
};

const buttonVariants = {
  hover: { scale: 1.1 },
  tap: { scale: 0.9 }
};

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onViewDetails, onToggleFavorite, isFavorite, animationVariants }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    onToggleFavorite(recipe);
  };
  
  return (
    <motion.div 
      onClick={() => onViewDetails(recipe)}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 overflow-hidden cursor-pointer flex flex-col h-full border border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-sky-600 transition-all duration-300 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 focus-visible:ring-blue-400"
      variants={animationVariants || cardHoverVariants} // Use passed variants for list animation, else default hover
      whileHover={!animationVariants ? "hover" : undefined} // Only apply default hover if not part of list animation
      whileTap={!animationVariants ? "tap" : undefined}
      layout // Enable layout animations if content changes
    >
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-sky-400 truncate mr-2 flex-grow" title={recipe.name}>{recipe.name}</h3>
          <motion.button
            onClick={handleFavoriteClick}
            className="p-2 bg-white/80 dark:bg-slate-700/80 hover:bg-gray-100 dark:hover:bg-slate-600 rounded-full shadow-sm transition-colors flex-shrink-0 focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-400"
            aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            {isFavorite ? <FilledStarIcon className="w-6 h-6 text-sky-400 dark:text-yellow-400" /> : <StarIcon className="w-6 h-6 text-sky-400 dark:text-sky-500" />}
          </motion.button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 flex-grow leading-relaxed line-clamp-3" title={recipe.description}>{recipe.description}</p>
        
        <div className="mt-auto space-y-2 text-sm">
          {recipe.cookingTimeMinutes && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <ClockIcon className="w-4 h-4 mr-2 text-blue-500 dark:text-sky-500" />
              <span>調理時間: 約{recipe.cookingTimeMinutes}分</span>
            </div>
          )}
          {recipe.calories && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <FireIcon className="w-4 h-4 mr-2 text-red-500 dark:text-red-400" />
              <span>カロリー: 約{recipe.calories}kcal</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <UsersIcon className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />
              <span>約{recipe.servings}人前</span>
            </div>
          )}
          {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
            <div className="flex items-start text-gray-500 dark:text-gray-400">
              <TagIcon className="w-4 h-4 mr-2 mt-0.5 text-green-500 dark:text-green-400 flex-shrink-0" />
              <span className="line-clamp-2">主な材料: {recipe.mainIngredients.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
       <div className="p-5 pt-2 border-t border-blue-100 dark:border-slate-700 mt-auto">
         <motion.button 
            onClick={(e) => { e.stopPropagation(); onViewDetails(recipe);}}
            className="w-full mt-1 bg-blue-500 dark:bg-sky-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-sky-700 transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            詳細を見る
          </motion.button>
       </div>
    </motion.div>
  );
};
