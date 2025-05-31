
import React from 'react';
import type { Recipe } from '../types';
import { Modal } from './Modal';
import { ClockIcon, FireIcon, TagIcon, UsersIcon, SparklesIcon, XMarkIcon, StarIcon, FilledStarIcon, CheckCircleIcon, ChartPieIcon } from './Icons';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: boolean;
}

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
};

const DetailSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, icon, children, className }) => (
  <motion.div 
    className={`py-4 ${className}`}
    variants={sectionVariants}
    initial="hidden"
    animate="visible"
  >
    <h4 className="text-lg sm:text-xl font-semibold text-blue-700 dark:text-sky-400 mb-3 flex items-center">
      {icon && <span className="mr-2">{icon}</span>}
      {title}
    </h4>
    {children}
  </motion.div>
);

export const RecipeDetailModal: React.FC<RecipeDetailModalProps> = ({ recipe, onClose, onToggleFavorite, isFavorite }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(recipe);
  };

  return (
    <Modal isOpen={true} onClose={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl mx-auto max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-gray-200 dark:border-slate-700 flex justify-between items-start sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div>
            <h2 className="text-xl leading-tight sm:text-2xl md:text-3xl font-bold text-blue-600 dark:text-sky-400">{recipe.name}</h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">{recipe.description}</p>
          </div>
          <motion.button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-400"
            aria-label="閉じる"
            whileHover={{ scale: 1.2, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <XMarkIcon className="w-7 h-7" />
          </motion.button>
        </div>

        <div className="p-5 overflow-y-auto flex-grow">
          <motion.div 
            className="mb-6 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {recipe.cookingTimeMinutes && (
              <div className="flex items-center text-base sm:text-lg text-gray-700 dark:text-gray-300">
                <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-500 dark:text-sky-500" />
                <span>調理時間: 約 {recipe.cookingTimeMinutes} 分</span>
              </div>
            )}
            {recipe.calories && ( 
              <div className="flex items-center text-base sm:text-lg text-gray-700 dark:text-gray-300">
                <FireIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-red-500 dark:text-red-400" />
                <span>カロリー: 約 {recipe.calories} kcal</span>
              </div>
            )}
            {recipe.servings && (
              <div className="flex items-center text-base sm:text-lg text-gray-700 dark:text-gray-300">
                <UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-indigo-500 dark:text-indigo-400" />
                <span>分量: 約 {recipe.servings} 人前</span>
              </div>
            )}
            {recipe.mainIngredients && recipe.mainIngredients.length > 0 && (
              <div className="flex items-start text-base sm:text-lg text-gray-700 dark:text-gray-300">
                <TagIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-3 mt-1 text-green-500 dark:text-green-400 flex-shrink-0" />
                <div>
                  <span className="font-medium">主な材料:</span>
                  <ul className="list-disc list-inside ml-1 text-sm sm:text-base">
                    {recipe.mainIngredients.map(item => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
          
          <motion.button
            onClick={handleFavoriteClick}
            className={`w-full flex items-center justify-center px-6 py-3 mb-6 rounded-lg font-semibold text-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75
              ${isFavorite 
                ? 'bg-sky-400 hover:bg-sky-500 text-white shadow-md hover:shadow-lg dark:bg-yellow-500 dark:hover:bg-yellow-600 focus-visible:ring-sky-300 dark:focus-visible:ring-yellow-400' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 hover:border-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:text-gray-200 dark:border-slate-500 dark:hover:border-slate-400 focus-visible:ring-gray-400 dark:focus-visible:ring-slate-400'}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isFavorite ? <FilledStarIcon className="w-6 h-6 mr-2 text-white dark:text-slate-800" /> : <StarIcon className="w-6 h-6 mr-2 text-sky-500 dark:text-yellow-400" />}
            {isFavorite ? 'お気に入りから削除' : 'お気に入りに追加'}
          </motion.button>

          <DetailSection title="材料リスト" icon={<UsersIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 dark:text-sky-500" />} className="border-t border-gray-200 dark:border-slate-700 pt-6">
             {recipe.servings && <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">（約{recipe.servings}人前の材料）</p>}
            <ul className="space-y-1.5 list-none text-gray-700 dark:text-gray-300">
              {recipe.ingredients.map((item, index) => (
                <li key={index} className="ml-1 sm:ml-4 p-2 bg-blue-50/50 dark:bg-slate-700/50 rounded-md border border-blue-100 dark:border-slate-600 flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-800 dark:text-gray-200">{item.name}</span> <span className="font-medium text-blue-600 dark:text-sky-400">{item.quantity}</span>
                </li>
              ))}
            </ul>
          </DetailSection>

          <DetailSection title="作り方" icon={<SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500 dark:text-purple-400" />} className="border-t border-gray-200 dark:border-slate-700 pt-6">
            <ol className="space-y-3 text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              {recipe.instructions.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="bg-blue-500 dark:bg-sky-600 text-white rounded-full h-6 w-6 sm:h-7 sm:w-7 text-xs sm:text-sm flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 font-semibold">{index + 1}</span>
                  <p className="flex-1 leading-relaxed">{step}</p>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
              手順ごとにチェックしながら調理を進められます。
            </p>
          </DetailSection>

          {(recipe.nutrition && (recipe.nutrition.protein || recipe.nutrition.fat || recipe.nutrition.carbs)) && (
            <DetailSection title="栄養詳細 (推定)" icon={<ChartPieIcon className="w-5 h-5 sm:w-6 sm:h-6 text-teal-500 dark:text-teal-400" />} className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                {recipe.nutrition.protein && (
                  <div className="bg-blue-50 dark:bg-blue-900/30 p-2 sm:p-3 rounded-lg shadow-sm border border-blue-100 dark:border-blue-800 text-center">
                    <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1 text-xs sm:text-sm">タンパク質</p>
                    <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg">{recipe.nutrition.protein}</p>
                  </div>
                )}
                {recipe.nutrition.fat && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 p-2 sm:p-3 rounded-lg shadow-sm border border-yellow-100 dark:border-yellow-800 text-center">
                    <p className="font-semibold text-yellow-700 dark:text-yellow-300 mb-1 text-xs sm:text-sm">脂質</p>
                    <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg">{recipe.nutrition.fat}</p>
                  </div>
                )}
                {recipe.nutrition.carbs && (
                  <div className="bg-green-50 dark:bg-green-900/30 p-2 sm:p-3 rounded-lg shadow-sm border border-green-100 dark:border-green-800 text-center">
                    <p className="font-semibold text-green-700 dark:text-green-300 mb-1 text-xs sm:text-sm">炭水化物</p>
                    <p className="text-gray-700 dark:text-gray-200 text-base sm:text-lg">{recipe.nutrition.carbs}</p>
                  </div>
                )}
              </div>
            </DetailSection>
          )}

          {recipe.tips && (
            <DetailSection title="料理のコツ・アレンジ案" icon={<SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 dark:text-yellow-400" />} className="border-t border-gray-200 dark:border-slate-700 pt-6">
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-sky-50 dark:bg-sky-900/30 p-3 sm:p-4 rounded-md border border-sky-200 dark:border-sky-800 leading-relaxed text-sm sm:text-base">{recipe.tips}</p>
            </DetailSection>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-slate-700 text-center sticky bottom-0 bg-white dark:bg-slate-800 z-10">
          <motion.button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 dark:bg-sky-600 text-white font-semibold rounded-lg hover:bg-blue-600 dark:hover:bg-sky-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            閉じる
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};
