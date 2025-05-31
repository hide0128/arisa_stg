
import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onViewDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
}

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onViewDetails, onToggleFavorite, isFavorite }) => {
  if (recipes.length === 0) {
    return null; // Or a message like "No recipes found" - handled in App.tsx
  }

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {recipes.map(recipe => (
        <RecipeCard 
          key={recipe.id} 
          recipe={recipe} 
          onViewDetails={onViewDetails}
          onToggleFavorite={onToggleFavorite}
          isFavorite={isFavorite(recipe.id)}
        />
      ))}
    </div>
  );
};