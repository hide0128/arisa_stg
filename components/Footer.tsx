
import React from 'react';
import { APP_NAME } from '../constants';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 p-4 text-center border-t border-blue-200 dark:border-slate-700 transition-colors duration-300 ease-in-out"
    >
      <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      <p className="text-sm">Powered by AI with <span className="font-semibold">Gemini</span>.</p>
    </motion.footer>
  );
};
