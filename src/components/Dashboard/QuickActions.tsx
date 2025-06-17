import React from 'react';
import { Upload, BarChart, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const actions = [
  {
    name: 'Upload Data',
    description: 'Import COVID data from CSV or Excel files',
    icon: Upload,
    href: '/upload',
    color: 'from-blue-500 to-blue-600',
    id: 'upload-action'
  },
  {
    name: 'View Analytics',
    description: 'Explore data visualizations and insights',
    icon: BarChart,
    href: '/analytics',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Generate Report',
    description: 'Create comprehensive analysis reports',
    icon: FileText,
    href: '/reports',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Export Data',
    description: 'Download processed data and charts',
    icon: Download,
    href: '#',
    color: 'from-orange-500 to-orange-600'
  }
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <motion.button
          key={action.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          onClick={() => action.href !== '#' && navigate(action.href)}
          className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left group"
          data-tutorial={action.id}
        >
          <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-4`}>
            <action.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {action.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {action.description}
          </p>
        </motion.button>
      ))}
    </div>
  );
}