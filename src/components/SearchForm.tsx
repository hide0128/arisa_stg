
import React, { useState, useCallback } from 'react';
import type { SearchCriteria } from '../types';
import { MealType, CookingTime } from '../types';
import { MEAL_TYPE_BUTTON_OPTIONS, COOKING_TIME_BUTTON_OPTIONS } from '../constants';
import { SearchIcon } from './Icons';

interface SearchFormProps {
  onSearch: (criteria: SearchCriteria) => void;
  isLoading: boolean;
}

const initialCriteria: SearchCriteria = {
  mealType: MealType.ANY,
  cookingTime: CookingTime.ANY,
};

export const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading }) => {
  const [criteria, setCriteria] = useState<SearchCriteria>(initialCriteria);

  const handleMealTypeChange = useCallback((mealType: MealType) => {
    setCriteria(prev => ({ ...prev, mealType }));
  }, []);

  const handleCookingTimeChange = useCallback((cookingTime: CookingTime) => {
    setCriteria(prev => ({ ...prev, cookingTime }));
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(criteria);
  };

  const FormSection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <div className="mb-6 p-4 border border-orange-200 rounded-lg bg-white/50 shadow-sm">
      <h3 className="text-lg font-semibold text-orange-700 mb-3">{title}</h3>
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
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ease-in-out
            ${selectedValue === option.value 
              ? 'bg-orange-500 text-white border-orange-500 shadow-md' 
              : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-300 hover:border-orange-400'}`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white shadow-xl rounded-lg border border-orange-300">
      <FormSection title="食事の種類">
        <span id="mealType-label" className="sr-only">食事の種類を選択</span>
        {renderButtonSelector(MEAL_TYPE_BUTTON_OPTIONS, criteria.mealType, handleMealTypeChange, 'mealType')}
      </FormSection>

      <FormSection title="調理時間">
        <span id="cookingTime-label" className="sr-only">調理時間を選択</span>
        {renderButtonSelector(COOKING_TIME_BUTTON_OPTIONS, criteria.cookingTime, handleCookingTimeChange, 'cookingTime')}
      </FormSection>
      
      <div className="text-center pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-base md:text-lg rounded-lg shadow-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-150 ease-in-out focus:outline-none focus:ring-4 focus:ring-orange-300 focus:ring-opacity-75 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center"
          aria-label="AIにレシピを提案してもらう"
        >
          <SearchIcon className="h-6 w-6 mr-2" />
          {isLoading ? 'AIが検索中...' : 'AIにレシピを提案してもらう'}
        </button>
      </div>
    </form>
  );
};
