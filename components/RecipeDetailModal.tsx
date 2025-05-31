
import React from 'react';
import type { Recipe } from '../types';
import { Modal } from './Modal';
import { ClockIcon, FireIcon, TagIcon, UsersIcon, SparklesIcon, XMarkIcon, StarIcon, FilledStarIcon, CheckCircleIcon, ChartPieIcon } from './Icons';


interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

const DetailSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <div className={`py-4 ${className}`}>
    <h4 className="text-xl font-semibold text-blue-700 mb-3 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h4>
    {children}
  </div>
);

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose, onToggleFavorite, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-200 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-3xl font-bold text-blue-600">{recipe.name}</h2>
            <p className="text-gray-600 mt-1">{recipe.description}</p>
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
          <div className="mb-6 space-y-3">
            {recipe.cookingTimeMinutes && (
              <div className="flex items-center text-lg text-gray-700">
                <ClockIcon className="w-6 h-6 mr-3 text-blue-500" />
                <span>調理時間: 約 {recipe.cookingTimeMinutes} 分</span>
              </div>
            )}
            {recipe.calories && ( 
              <div className="flex items-center text-lg text-gray-700">
                <FireIcon className="w-6 h-6 mr-3 text-red-500" />
                <span>カロリー: 約 {recipe.calories} kcal</span>
              </div>
            )}
            {recipe.servings && ( // Display servings
              <div className="flex items-center text-lg text-gray-700">
                <UsersIcon className="w-6 h-6 mr-3 text-purple-500" />
                <span>対象人数: {recipe.servings}</span>
              </div>
            )}
            {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
              <div className="flex items-start text-lg text-gray-700">
                <TagIcon className="w-6 h-6 mr-3 mt-1 text-green-500 flex-shrink-0" />
                <div>
                  <span className="font-medium">主な材料:</span>
                  <ul className="list-disc list-inside ml-1 text-base">
                    {recipe.mainIngredients.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={handleFavoriteClick}
            className={`w-full flex items-center justify-center px-6 py-3 mb-6 rounded-lg font-semibold text-lg transition-colors duration-150
              ${isFavorite 
                ? 'bg-sky-400 hover:bg-sky-500 text-white shadow-md hover:shadow-lg' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 hover:border-gray-400'}`}
          >
            {isFavorite ? <FilledStarIcon className="w-6 h-6 mr-2 text-white" /> : <StarIcon className="w-6 h-6 mr-2 text-sky-500" />}
            {isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          </button>


          <DetailSection title="材料リスト" icon={<UsersIcon className="w-6 h-6 text-blue-500" />} className="border-t border-gray-200 pt-6">
            <ul className="space-y-1.5 list-none text-gray-700">
              {recipe.ingredients.map((item, index) => (
                <li key={index} className="ml-4 p-2 bg-blue-50/50 rounded-md border border-blue-100 flex justify-between items-center">
                  <span className="text-gray-800">{item.name}</span> <span className="font-medium text-blue-600">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="作り方" icon={<SparklesIcon className="w-6 h-6 text-purple-500" />} className="border-t border-gray-200 pt-6">
            <ol className="space-y-3 text-gray-700">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-500 text-white rounded-full h-7 w-7 text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-semibold">{index + 1}</span>
                  <p className="flex-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-gray-500 flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
              手順ごとにチェックしながら調理を進められます。
            </p>
          </DetailSection>

          {(recipe.nutrition && (recipe.nutrition.protein || recipe.nutrition.fat || recipe.nutrition.carbs)) && (
            <DetailSection title="栄養詳細 (推定)" icon={<ChartPieIcon className="w-6 h-6 text-teal-500" />} className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {recipe.nutrition.protein && (
                  <div className="bg-blue-50 p-3 rounded-lg shadow-sm border border-blue-100 text-center">
                    <p className="font-semibold text-blue-700 mb-1">タンパク質</p>
                    <p className="text-gray-700 text-lg">{recipe.nutrition.protein}</p>
                  </div>
                )}
                {recipe.nutrition.fat && (
                  <div className="bg-yellow-50 p-3 rounded-lg shadow-sm border border-yellow-100 text-center">
                    <p className="font-semibold text-yellow-700 mb-1">脂質</p>
                    <p className="text-gray-700 text-lg">{recipe.nutrition.fat}</p>
                  </div>
                )}
                {recipe.nutrition.carbs && (
                  <div className="bg-green-50 p-3 rounded-lg shadow-sm border border-green-100 text-center">
                    <p className="font-semibold text-green-700 mb-1">炭水化物</p>
                    <p className="text-gray-700 text-lg">{recipe.nutrition.carbs}</p>
                  </div>
                )}
              </div>
            </DetailSection>
          )}

          {recipe.tips && (
            <DetailSection title="料理のコツ・アレンジ案" icon={<SparklesIcon className="w-6 h-6 text-yellow-500" />} className="border-t border-gray-200 pt-6">
              <p className="text-gray-700 whitespace-pre-line bg-sky-50 p-4 rounded-md border border-sky-200 leading-relaxed">{recipe.tips}</p>
            </DetailSection>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 text-center sticky bottom-0 bg-white z-10">
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