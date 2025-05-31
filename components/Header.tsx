
import React, { forwardRef } from 'react';
import { APP_NAME } from '../constants';
import { StarIcon, SparklesIcon, SunIcon, MoonIcon } from './Icons';
import { motion } from 'framer-motion';

interface HeaderProps {
  onShowFavorites: () => void;
  favoriteCount: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header = forwardRef<HTMLElement, HeaderProps>(({ onShowFavorites, favoriteCount, isDarkMode, onToggleDarkMode }, ref) => {
  const iconVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20, delay: 0.2 } },
  };
  const textVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20, delay: 0.1 } },
  };


  return (
    <motion.header 
      ref={ref}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="bg-gradient-to-r from-blue-500 to-sky-500 dark:from-slate-700 dark:to-slate-800 text-white p-4 shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <motion.div variants={iconVariants} initial="hidden" animate="visible">
            <SparklesIcon className="h-8 w-8 text-sky-300 dark:text-sky-400" />
          </motion.div>
          <motion.h1 
            variants={textVariants} 
            initial="hidden" 
            animate="visible"
            className="text-2xl md:text-3xl font-bold tracking-tight"
          >
            {APP_NAME}
          </motion.h1>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            onClick={onToggleDarkMode}
            className="p-2 bg-white/20 hover:bg-white/30 dark:bg-slate-600/50 dark:hover:bg-slate-500/50 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isDarkMode ? <SunIcon className="h-6 w-6 text-yellow-300" /> : <MoonIcon className="h-6 w-6 text-sky-200" />}
          </motion.button>
          <motion.button
            onClick={onShowFavorites}
            className="relative flex items-center px-3 py-2 sm:px-4 sm:py-2 bg-white/20 hover:bg-white/30 dark:bg-slate-600/50 dark:hover:bg-slate-500/50 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            aria-label="お気に入りを表示"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <StarIcon className="h-6 w-6 text-sky-300 dark:text-yellow-300" />
            <span className="ml-2 hidden sm:inline">お気に入り</span>
            {favoriteCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
              >
                {favoriteCount}
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
});

Header.displayName = 'Header';
