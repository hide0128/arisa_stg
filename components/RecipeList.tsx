
import React from 'react';
import type { Recipe } from '../types';
import { RecipeCard } from './RecipeCard';
import { motion, AnimatePresence } from 'framer-motion';

interface RecipeListProps {
  recipes: Recipe[];
  onViewDetails: (recipe: Recipe) => void;
  onToggleFavorite: (recipe: Recipe) => void;
  isFavorite: (recipeId: string) => boolean;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export const RecipeList: React.FC<RecipeListProps> = ({ recipes, onViewDetails, onToggleFavorite, isFavorite }) => {
  if (recipes.length === 0) {
    return null;
  }

  return (
    <motion.div 
      className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence>
        {recipes.map(recipe => (
          <RecipeCard 
            key={recipe.id} 
            recipe={recipe} 
            onViewDetails={onViewDetails}
            onToggleFavorite={onToggleFavorite}
            isFavorite={isFavorite(recipe.id)}
            animationVariants={itemVariants} // Pass item variants for stagger
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};
