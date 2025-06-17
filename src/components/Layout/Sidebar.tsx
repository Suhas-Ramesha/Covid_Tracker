import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Upload, BarChart, FileText, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Upload Data', href: '/upload', icon: Upload },
  { name: 'Analytics', href: '/analytics', icon: BarChart },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  return (
    <motion.div 
      className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      data-tutorial="sidebar"
    >
      <div className="flex-1 flex flex-col min-h-0 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </motion.div>
  );
}