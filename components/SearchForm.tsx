
import React, { useState, useCallback } from 'react';
import type { SearchCriteria } from '../types';
import { MealType, CookingTime } from '../types';
import { MEAL_TYPE_BUTTON_OPTIONS, COOKING_TIME_BUTTON_OPTIONS, DEFAULT_SERVINGS, MIN_SERVINGS, MAX_SERVINGS } from '../constants';
import { SearchIcon, UsersIcon, ClockIcon, ListIcon, PlusIcon, MinusIcon } from './Icons'; 
import { motion } from 'framer-motion';

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

const initialCriteria: SearchCriteria = {
  mealType: MealType.ANY,
  cookingTime: CookingTime.ANY,
  servings: DEFAULT_SERVINGS,
};

const formVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const sectionVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};


export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [criteria, setCriteria] = useState<SearchCriteria>(initialCriteria);

  const handleMealTypeChange = useCallback((mealType: MealType) => {
    setCriteria(prev => ({ ...prev, mealType }));
  }, []);

  const handleCookingTimeChange = useCallback((cookingTime: CookingTime) => {
    setCriteria(prev => ({ ...prev, cookingTime }));
  }, []);

  const handleDecrementServings = useCallback(() => {
    setCriteria(prev => ({
      ...prev,
      servings: Math.max(MIN_SERVINGS, (prev.servings || DEFAULT_SERVINGS) - 1),
    }));
  }, []);
  
  const handleIncrementServings = useCallback(() => {
    setCriteria(prev => ({
      ...prev,
      servings: Math.min(MAX_SERVINGS, (prev.servings || DEFAULT_SERVINGS) + 1),
    }));
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const servingsToSearch = criteria.servings === undefined ? DEFAULT_SERVINGS : criteria.servings;
    onSearch({ ...criteria, servings: servingsToSearch });
  };

  const FormSection: React.FC<{title: string; children: React.ReactNode, icon?: React.ReactNode}> = ({ title, children, icon }) => (
    <motion.div 
      className="mb-6 p-4 border border-blue-200 dark:border-slate-700 rounded-lg bg-white/50 dark:bg-slate-800/30 shadow-sm"
      variants={sectionVariants}
      whileHover="hover"
    >
      <h3 className="text-base sm:text-lg font-semibold text-blue-700 dark:text-sky-400 mb-3 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      {children}
    </motion.div>
  );

  const renderButtonSelector = <T extends string,>(
    options: {value: T, label: string}[],
    selectedValue: T,
    onChange: (value: T) => void,
    groupName: string
  ) => (
    <div className="flex flex-wrap gap-2 justify-center" role="radiogroup" aria-labelledby={`${groupName}-label`}>
      {options.map(option => (
        <motion.button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selectedValue === option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ease-in-out min-h-[2.5rem] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800 focus-visible:ring-blue-400
            ${selectedValue === option.value 
              ? 'bg-blue-500 dark:bg-sky-600 text-white border-blue-500 dark:border-sky-600 shadow-md' 
              : 'bg-blue-50 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-slate-600 text-blue-700 dark:text-sky-200 border-blue-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-slate-500'}`}
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          {option.label}
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8 p-4 sm:p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-blue-300 dark:border-slate-700"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <FormSection title="食事の種類" icon={<ListIcon className="w-5 h-5 text-blue-700 dark:text-sky-400" />}>
        <span id="mealType-label" className="sr-only">食事の種類を選択</span>
        {renderButtonSelector(MEAL_TYPE_BUTTON_OPTIONS, criteria.mealType, handleMealTypeChange, 'mealType')}
      </FormSection>

      <FormSection title="調理時間" icon={<ClockIcon className="w-5 h-5 text-blue-700 dark:text-sky-400" />}>
        <span id="cookingTime-label" className="sr-only">調理時間を選択</span>
        {renderButtonSelector(COOKING_TIME_BUTTON_OPTIONS, criteria.cookingTime, handleCookingTimeChange, 'cookingTime')}
      </FormSection>

      <FormSection title="何人前？" icon={<UsersIcon className="w-5 h-5 text-blue-700 dark:text-sky-400" />}>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2">
            <motion.button
              type="button"
              onClick={handleDecrementServings}
              disabled={isLoading || (criteria.servings !== undefined && criteria.servings <= MIN_SERVINGS)}
              className="p-2 rounded-lg bg-blue-500 dark:bg-sky-600 text-white hover:bg-blue-600 dark:hover:bg-sky-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="人数を1減らす"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <MinusIcon className="w-6 h-6" />
            </motion.button>
            <span
              className="text-xl font-semibold text-blue-700 dark:text-sky-300 w-16 h-10 flex items-center justify-center bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 rounded-md"
              aria-live="polite"
              aria-atomic="true"
              id="servings-value"
            >
              {criteria.servings || DEFAULT_SERVINGS}
            </span>
            <motion.button
              type="button"
              onClick={handleIncrementServings}
              disabled={isLoading || (criteria.servings !== undefined && criteria.servings >= MAX_SERVINGS)}
              className="p-2 rounded-lg bg-blue-500 dark:bg-sky-600 text-white hover:bg-blue-600 dark:hover:bg-sky-700 disabled:bg-gray-300 dark:disabled:bg-slate-600 disabled:text-gray-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="人数を1増やす"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <PlusIcon className="w-6 h-6" />
            </motion.button>
          </div>
          <p id="servings-description" className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">({MIN_SERVINGS}〜{MAX_SERVINGS}人)</p>
        </div>
      </FormSection>
      
      <div className="text-center pt-4">
        <motion.button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:from-blue-600 hover:to-sky-600 dark:from-sky-600 dark:to-blue-600 dark:hover:from-sky-700 dark:hover:to-blue-700 transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 dark:focus-visible:ring-sky-500 focus-visible:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="ガチャを回してレシピを提案してもらう"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
        >
          <SearchIcon className="h-6 w-6 mr-2" />
          {isLoading ? 'ガチャ回転中...' : 'ガチャを回す！'}
        </motion.button>
      </div>
    </motion.form>
  );
};
