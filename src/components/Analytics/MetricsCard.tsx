import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  color?: 'blue' | 'red' | 'green' | 'yellow' | 'purple';
  delay?: number;
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = 'blue',
  delay = 0
}: MetricsCardProps) {
  const colorClasses = {
    blue: {
      bg: 'from-blue-500 to-blue-600',
      text: 'text-blue-600',
      light: 'bg-blue-50'
    },
    red: {
      bg: 'from-red-500 to-red-600',
      text: 'text-red-600',
      light: 'bg-red-50'
    },
    green: {
      bg: 'from-green-500 to-green-600',
      text: 'text-green-600',
      light: 'bg-green-50'
    },
    yellow: {
      bg: 'from-yellow-500 to-yellow-600',
      text: 'text-yellow-600',
      light: 'bg-yellow-50'
    },
    purple: {
      bg: 'from-purple-500 to-purple-600',
      text: 'text-purple-600',
      light: 'bg-purple-50'
    }
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
          
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                trend.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="text-sm text-gray-500 ml-1">
                {trend.period}
              </span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg bg-gradient-to-r ${colors.bg}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  );
}