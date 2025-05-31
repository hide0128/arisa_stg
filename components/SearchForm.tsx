
import React, { useState, useCallback } from 'react';
import type { SearchCriteria } from '../types';
import { MealType, CookingTime } from '../types';
import { MEAL_TYPE_BUTTON_OPTIONS, COOKING_TIME_BUTTON_OPTIONS, DEFAULT_SERVINGS, MIN_SERVINGS, MAX_SERVINGS } from '../constants';
import { SearchIcon, UsersIcon, ClockIcon, ListIcon } from './Icons'; 

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

  const handleServingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= MIN_SERVINGS && value <= MAX_SERVINGS) {
      setCriteria(prev => ({ ...prev, servings: value }));
    } else if (e.target.value === "") { 
        setCriteria(prev => ({ ...prev, servings: undefined }));
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ ...criteria, servings: criteria.servings || DEFAULT_SERVINGS });
  };

  const FormSection: React.FC<{title: string; children: React.ReactNode, icon?: React.ReactNode}> = ({ title, children, icon }) => (
    <div className="mb-6 p-4 border border-blue-200 rounded-lg bg-white/50 shadow-sm">
      <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center">
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
          className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors duration-150 ease-in-out
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
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white shadow-xl rounded-lg border border-blue-300">
      <FormSection title="食事の種類" icon={<ListIcon className="w-5 h-5 text-blue-700" />}>
        <span id="mealType-label" className="sr-only">食事の種類を選択</span>
        {renderButtonSelector(MEAL_TYPE_BUTTON_OPTIONS, criteria.mealType, handleMealTypeChange, 'mealType')}
      </FormSection>

      <FormSection title="調理時間" icon={<ClockIcon className="w-5 h-5 text-blue-700" />}>
        <span id="cookingTime-label" className="sr-only">調理時間を選択</span>
        {renderButtonSelector(COOKING_TIME_BUTTON_OPTIONS, criteria.cookingTime, handleCookingTimeChange, 'cookingTime')}
      </FormSection>

      <FormSection title="何人前？" icon={<UsersIcon className="w-5 h-5 text-blue-700" />}>
        <div className="flex items-center justify-center space-x-3">
          <label htmlFor="servings-input" className="text-gray-700 font-medium">人数:</label>
          <input
            type="number"
            id="servings-input"
            name="servings"
            value={criteria.servings === undefined ? '' : criteria.servings}
            onChange={handleServingsChange}
            min={MIN_SERVINGS}
            max={MAX_SERVINGS}
            className="w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-gray-700 bg-white"
            aria-describedby="servings-description"
          />
           <span id="servings-description" className="text-sm text-gray-500">({MIN_SERVINGS}〜{MAX_SERVINGS}人)</span>
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
