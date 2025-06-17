import React from 'react';
import { User, LogOut, BarChart3, Moon, Sun, HelpCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { useTutorial } from '../../contexts/TutorialContext';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const { startTutorial } = useTutorial();

  return (
    <motion.header 
      className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-tutorial="header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                COVID Analytics
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Tutorial button */}
            <button
              onClick={startTutorial}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title="Start Tutorial"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
            
            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {user?.displayName || user?.email}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}