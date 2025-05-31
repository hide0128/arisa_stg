
import React from 'react';
import type { Recipe } from '../types';
import { Modal } from './Modal';
import { RecipeCard } from './RecipeCard';
import { XMarkIcon, StarIcon } from './Icons';

interface FavoriteRecipesModalProps {
  favorites: Recipe[];
  onClose: () => void;
  onViewDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
}

export const FavoriteRecipesModal: React.FC<FavoriteRecipesModalProps> = ({
  favorites,
  onClose,
  onViewDetails,
  onToggleFavorite,
  isFavorite,
}) => {
  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-blue-50 rounded-lg shadow-xl w-full max-w-4xl mx-auto max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-blue-200 flex justify-between items-center sticky top-0 bg-blue-50 z-10">
          <div className="flex items-center">
            <StarIcon className="w-8 h-8 text-sky-400 mr-3" />
            <h2 className="text-2xl font-bold text-blue-600">お気に入りレシピ ({favorites.length})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            aria-label="閉じる"
          >
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          {favorites.length === 0 ? (
            <div className="text-center py-10">
              <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">お気に入りのレシピはまだありません。</p>
              <p className="text-gray-400 mt-2">気になるレシピを見つけたら星マークをタップしてお気に入りに追加しましょう！</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {favorites.map(recipe => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onViewDetails={onViewDetails}
                  onToggleFavorite={onToggleFavorite}
                  isFavorite={isFavorite(recipe.id)}
                />
              ))}
            </div>
          )}
        </div>
        <div className="p-4 border-t border-blue-200 text-center sticky bottom-0 bg-blue-50 z-10">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
};