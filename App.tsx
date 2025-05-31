
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { SearchForm } from './components/SearchForm';
import { RecipeList } from './components/RecipeList';
import { RecipeDetailModal } from './components/RecipeDetailModal';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoadingSpinner } from './components/LoadingSpinner';
import { FavoriteRecipesModal } from './components/FavoriteRecipesModal';
import type { SearchCriteria, Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import { useLocalStorage } from './hooks/useLocalStorage';
import {InfoIcon, StarIcon } from './components/Icons';
import { DEFAULT_SERVINGS, APP_NAME, DARK_MODE_KEY } from './constants';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(DARK_MODE_KEY, false);
  
  const recipeListRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    const criteriaWithDefaultServings = {
        ...criteria,
        servings: criteria.servings || DEFAULT_SERVINGS,
    };
    setSearchCriteria(criteriaWithDefaultServings);
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setShowWelcome(false);

    try {
      const fetchedRecipes = await generateRecipes(criteriaWithDefaultServings); 
      
      const recipesWithIds: Recipe[] = fetchedRecipes.map(apiRecipeData => {
          const recipeId = crypto.randomUUID();
          const completeRecipe: Recipe = {
            id: recipeId,
            name: apiRecipeData.name || "名称未設定のレシピ",
            description: apiRecipeData.description || "説明がありません",
            cookingTimeMinutes: apiRecipeData.cookingTimeMinutes || null,
            calories: apiRecipeData.calories || null,
            servings: apiRecipeData.servings || null,
            mainIngredients: apiRecipeData.mainIngredients || [],
            ingredients: apiRecipeData.ingredients || [],
            instructions: apiRecipeData.instructions || [],
            nutrition: apiRecipeData.nutrition || null,
            tips: apiRecipeData.tips || null,
          };
          return completeRecipe;
        });
      setRecipes(recipesWithIds);
    } catch (err) {
      console.error(err);
      setError('レシピの取得に失敗しました。しばらくしてからもう一度お試しください。');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleViewDetails = useCallback(async (recipe: Recipe) => {
    setSelectedRecipe(recipe); 
  }, []);


  const handleCloseModal = () => {
    setSelectedRecipe(null);
  };

  const toggleFavorite = useCallback((recipe: Recipe) => {
    setFavorites(prevFavorites => {
      const isFavorited = prevFavorites.some(fav => fav.id === recipe.id);
      if (isFavorited) {
        return prevFavorites.filter(fav => fav.id !== recipe.id);
      } else {
        return [...prevFavorites, recipe];
      }
    });
  }, [setFavorites]);

  const isRecipeFavorite = useCallback((recipeId: string) => {
    return favorites.some(fav => fav.id === recipeId);
  }, [favorites]);
  
  useEffect(() => {
    if (searchCriteria) {
      setShowWelcome(false);
    }
  }, [searchCriteria]);

  useEffect(() => {
    if (recipes.length > 0 && !isLoading && !showWelcome && recipeListRef.current && headerRef.current) {
      const timer = setTimeout(() => {
        if (recipeListRef.current && headerRef.current) { // Double check refs are still valid
          const headerHeight = headerRef.current.offsetHeight;
          const recipeListTop = recipeListRef.current.offsetTop;
          
          window.scrollTo({
            top: recipeListTop - headerHeight,
            behavior: 'smooth'
          });
        }
      }, 300); // Adjusted delay to allow for rendering and animation
      return () => clearTimeout(timer);
    }
  }, [recipes, isLoading, showWelcome]);

  const showMainLoadingSpinner = isLoading;

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-slate-900 transition-colors duration-300 ease-in-out">
      <Header 
        ref={headerRef}
        onShowFavorites={() => setIsFavoritesModalOpen(true)} 
        favoriteCount={favorites.length}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {showMainLoadingSpinner && <LoadingSpinner message="ガチャを回しています..." />}
        
        <AnimatePresence>
          {error && (
            <motion.div
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-6 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-700 text-red-700 dark:text-red-300 p-4 rounded-md shadow-md"
              role="alert"
            >
              <div className="flex">
                <div className="py-1"><InfoIcon className="h-6 w-6 text-red-500 dark:text-red-400 mr-3" /></div>
                <div>
                  <p className="font-bold">エラーが発生しました</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {showWelcome && !isLoading && !error && recipes.length === 0 && (
            <motion.div
              key="welcome"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="mt-10 text-center p-8 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-blue-200 dark:border-slate-700"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-sky-400 mb-4">{APP_NAME}へようこそ！</h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                今日の献立、何にしよう？「{APP_NAME}」で運命の一皿を見つけよう！<br/>
                気分や調理時間、何人前かなどを指定して、ガチャを回してレシピをゲット！
              </p>
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <StarIcon className="w-16 h-16 text-sky-400 dark:text-sky-500 mx-auto" />
              </motion.div>
            </motion.div>
          )}

          {!isLoading && !error && !showWelcome && recipes.length === 0 && searchCriteria && (
             <motion.div
                key="no-recipes"
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="mt-10 text-center p-8 bg-white dark:bg-slate-800 shadow-xl rounded-lg border border-blue-200 dark:border-slate-700"
              >
              <h2 className="text-2xl font-semibold text-blue-500 dark:text-sky-500 mb-4">レシピが見つかりませんでした</h2>
              <p className="text-gray-600 dark:text-gray-400">
                条件を変更して再度お試しください。
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {recipes.length > 0 && (
          <motion.div 
            ref={recipeListRef}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.3 }}
          >
            <RecipeList 
              recipes={recipes} 
              onViewDetails={handleViewDetails} 
              onToggleFavorite={toggleFavorite}
              isFavorite={isRecipeFavorite}
            />
          </motion.div>
        )}

        {searchCriteria && recipes.length > 0 && !isLoading && (
          <motion.div 
            className="mt-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <motion.button
              onClick={() => handleSearch(searchCriteria)}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 dark:bg-sky-600 dark:hover:bg-sky-700 transition duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-opacity-75 disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isLoading ? '検索中...' : '別のレシピをガチャる！'}
            </motion.button>
          </motion.div>
        )}
      </main>

      <AnimatePresence>
        {selectedRecipe && (
          <RecipeDetailModal 
            recipe={selectedRecipe} 
            onClose={handleCloseModal} 
            onToggleFavorite={toggleFavorite}
            isFavorite={isRecipeFavorite(selectedRecipe.id)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFavoritesModalOpen && (
          <FavoriteRecipesModal
            favorites={favorites}
            onClose={() => setIsFavoritesModalOpen(false)}
            onViewDetails={handleViewDetails}
            onToggleFavorite={toggleFavorite}
            isFavorite={isRecipeFavorite}
          />
        )}
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;
