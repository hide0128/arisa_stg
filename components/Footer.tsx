
import React from 'react';
import { APP_NAME } from '../constants';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-sky-100 text-sky-700 p-4 text-center border-t border-sky-200">
      <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
      <p className="text-sm">Powered by AI with <span className="font-semibold">Gemini</span>.</p>
    </footer>
  );
};
