import React, { useState, useCallback } from 'react';
import type { SearchCriteria } from '../types';
import { MealType, CookingTime } from '../types';
import { MEAL_TYPE_BUTTON_OPTIONS, COOKING_TIME_BUTTON_OPTIONS, DEFAULT_SERVINGS, MIN_SERVINGS, MAX_SERVINGS } from '../constants';
import { SearchIcon, UsersIcon, ClockIcon, ListIcon, PlusIcon, MinusIcon } from './Icons'; 

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

const initialCriteria: SearchCriteria = {
  mealType: MealType.ANY,
  cookingTime: CookingTime.ANY,
  servings: DEFAULT_SERVINGS,
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
    // Ensure servings is set, defaulting to DEFAULT_SERVINGS if somehow undefined
    const servingsToSearch = criteria.servings === undefined ? DEFAULT_SERVINGS : criteria.servings;
    onSearch({ ...criteria, servings: servingsToSearch });
  };

  const FormSection: React.FC<{title: string; children: React.ReactNode, icon?: React.ReactNode}> = ({ title, children, icon }) => (
    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-white/50 shadow-sm">
      <h3 className="text-base sm:text-lg font-semibold text-blue-700 mb-3 flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        {title}
      </h3>
      {children}
    </div>
  );

  const renderButtonSelector = <T extends string,>(
    options: {value: T, label: string}[],
    selectedValue: T,
    onChange: (value: T) => void,
    groupName: string
  ) => (
    <div className="flex flex-wrap gap-2 justify-center" role="radiogroup" aria-labelledby={`${groupName}-label`}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selectedValue === option.value}
          onClick={() => onChange(option.value)}
          className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ease-in-out min-h-[2.5rem] flex items-center justify-center
            ${selectedValue === option.value 
              ? 'bg-blue-500 text-white border-blue-500 shadow-md' 
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-4 sm:p-6 bg-white shadow-xl rounded-lg border border-blue-300">
      <FormSection title="食事の種類" icon={<ListIcon className="w-5 h-5 text-blue-700" />}>
        <span id="mealType-label" className="sr-only">食事の種類を選択</span>
        {renderButtonSelector(MEAL_TYPE_BUTTON_OPTIONS, criteria.mealType, handleMealTypeChange, 'mealType')}
      </FormSection>

      <FormSection title="調理時間" icon={<ClockIcon className="w-5 h-5 text-blue-700" />}>
        <span id="cookingTime-label" className="sr-only">調理時間を選択</span>
        {renderButtonSelector(COOKING_TIME_BUTTON_OPTIONS, criteria.cookingTime, handleCookingTimeChange, 'cookingTime')}
      </FormSection>

      <FormSection title="何人前？" icon={<UsersIcon className="w-5 h-5 text-blue-700" />}>
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center space-x-2">
            <button
              type="button"
              onClick={handleDecrementServings}
              disabled={isLoading || (criteria.servings !== undefined && criteria.servings <= MIN_SERVINGS)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="人数を1減らす"
            >
              <MinusIcon className="w-6 h-6" />
            </button>
            <span
              className="text-xl font-semibold text-blue-700 w-16 h-10 flex items-center justify-center bg-gray-50 border border-gray-300 rounded-md"
              aria-live="polite"
              aria-atomic="true"
              id="servings-value"
            >
              {criteria.servings || DEFAULT_SERVINGS}
            </span>
            <button
              type="button"
              onClick={handleIncrementServings}
              disabled={isLoading || (criteria.servings !== undefined && criteria.servings >= MAX_SERVINGS)}
              className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="人数を1増やす"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
          <p id="servings-description" className="text-sm text-gray-500 mt-2 text-center">({MIN_SERVINGS}〜{MAX_SERVINGS}人)</p>
        </div>
      </FormSection>
      
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-sky-500 text-white font-bold text-lg rounded-lg shadow-lg hover:from-blue-600 hover:to-sky-600 transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="ガチャを回してレシピを提案してもらう"
        >
          <SearchIcon className="h-6 w-6 mr-2" />
          {isLoading ? 'ガチャ回転中...' : 'ガチャを回す！'}
        </button>
      </div>
    </form>
  );
};