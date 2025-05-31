
import React, { useState, useCallback, useEffect } from 'react';
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

const App: React.FC = () => {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<Recipe[]>('favoriteRecipes', []);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

  const handleSearch = useCallback(async (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setIsLoading(true);
    setError(null);
    setRecipes([]);
    setShowWelcome(false);

    try {
      const fetchedRecipes = await generateRecipes(criteria); 
      
      const recipesWithIds: Recipe[] = fetchedRecipes.map(apiRecipeData => {
          const recipeId = crypto.randomUUID();
          const completeRecipe: Recipe = {
            id: recipeId,
            name: apiRecipeData.name || "名称未設定のレシピ",
            description: apiRecipeData.description || "説明がありません",
            cookingTimeMinutes: apiRecipeData.cookingTimeMinutes || null,
            calories: apiRecipeData.calories || null,
            mainIngredients: apiRecipeData.mainIngredients || [],
            ingredients: apiRecipeData.ingredients || [],
            instructions: apiRecipeData.instructions || [],
            nutrition: apiRecipeData.nutrition || null,
            tips: apiRecipeData.tips || null,
          };
          return completeRecipe;
        });
      setRecipes(recipesWithIds);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'レシピの取得に失敗しました。しばらくしてからもう一度お試しください。');
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

  const showMainLoadingSpinner = isLoading;


  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800">
      <Header onShowFavorites={() => setIsFavoritesModalOpen(true)} favoriteCount={favorites.length} />
      
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <SearchForm onSearch={handleSearch} isLoading={isLoading} />

        {showMainLoadingSpinner && <LoadingSpinner message="AIがレシピを考案中です..." />}
        
        {error && (
          <div className="mt-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md" role="alert">
            <div className="flex">
              <div className="py-1"><InfoIcon className="h-6 w-6 text-red-500 mr-3" /></div>
              <div>
                <p className="font-bold">エラーが発生しました</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {showWelcome && !isLoading && !error && recipes.length === 0 && (
          <div className="mt-10 text-center p-8 bg-white shadow-xl rounded-lg border border-slate-200">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">AIスマートレシピアシスタントへようこそ！</h2>
            <p className="text-lg text-slate-700 mb-6">
              気分や調理時間に合わせて、AIがあなたにぴったりのレシピを提案します。<br/>
              上のフォームから検索条件を入力して、新しい味覚の冒険を始めましょう！
            </p>
            <StarIcon className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
          </div>
        )}

        {!isLoading && !error && !showWelcome && recipes.length === 0 && searchCriteria && (
           <div className="mt-10 text-center p-8 bg-white shadow-xl rounded-lg border border-slate-200">
            <h2 className="text-2xl font-semibold text-slate-600 mb-4">レシピが見つかりませんでした</h2>
            <p className="text-slate-600">
              条件を変更して再度お試しください。
            </p>
          </div>
        )}

        {recipes.length > 0 && (
          <RecipeList 
            recipes={recipes} 
            onViewDetails={handleViewDetails} 
            onToggleFavorite={toggleFavorite}
            isFavorite={isRecipeFavorite}
          />
        )}

        {searchCriteria && recipes.length > 0 && !isLoading && (
          <div className="mt-8 text-center">
            <button
              onClick={() => handleSearch(searchCriteria)}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? '検索中...' : '別の提案を見る'}
            </button>
          </div>
        )}
      </main>

      {selectedRecipe && (
        <RecipeDetailModal 
          recipe={selectedRecipe} 
          onClose={handleCloseModal} 
          onToggleFavorite={toggleFavorite}
          isFavorite={isRecipeFavorite(selectedRecipe.id)}
        />
      )}

      {isFavoritesModalOpen && (
        <FavoriteRecipesModal
          favorites={favorites}
          onClose={() => setIsFavoritesModalOpen(false)}
          onViewDetails={handleViewDetails}
          onToggleFavorite={toggleFavorite}
          isFavorite={isRecipeFavorite}
        />
      )}
      <Footer />
    </div>
  );
};

export default App;