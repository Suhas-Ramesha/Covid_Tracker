import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'increase' | 'decrease' | 'neutral';
  delay?: number;
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral',
  delay = 0 
}: StatsCardProps) {
  const changeColor = {
    increase: 'text-red-600 dark:text-red-400',
    decrease: 'text-green-600 dark:text-green-400',
    neutral: 'text-gray-600 dark:text-gray-400'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          {change && (
            <p className={`text-sm mt-2 ${changeColor[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg">
          <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </motion.div>
  );
}