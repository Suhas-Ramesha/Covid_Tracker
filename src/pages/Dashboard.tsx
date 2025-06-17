import React from 'react';
import { Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { QuickActions } from '../components/Dashboard/QuickActions';
import { LineChart } from '../components/Charts/LineChart';
import { motion } from 'framer-motion';

// Sample data - replace with real data from your backend
const sampleData = [
  { date: '2023-01-01', deaths: 1200, cases: 45000 },
  { date: '2023-02-01', deaths: 1100, cases: 42000 },
  { date: '2023-03-01', deaths: 950, cases: 38000 },
  { date: '2023-04-01', deaths: 800, cases: 35000 },
  { date: '2023-05-01', deaths: 750, cases: 32000 },
  { date: '2023-06-01', deaths: 700, cases: 30000 },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Welcome back! Here's your COVID data overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-tutorial="stats-cards">
        <StatsCard
          title="Total Deaths"
          value={125420}
          icon={AlertTriangle}
          change="-2.4% from last month"
          changeType="decrease"
          delay={0.1}
        />
        <StatsCard
          title="Total Cases"
          value={2845670}
          icon={Users}
          change="+1.2% from last month"
          changeType="increase"
          delay={0.2}
        />
        <StatsCard
          title="Mortality Rate"
          value="4.4%"
          icon={Activity}
          change="-0.1% from last month"
          changeType="decrease"
          delay={0.3}
        />
        <StatsCard
          title="Recovery Rate"
          value="94.8%"
          icon={TrendingUp}
          change="+0.3% from last month"
          changeType="increase"
          delay={0.4}
        />
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        data-tutorial="chart"
      >
        <LineChart data={sampleData} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        data-tutorial="quick-actions"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
        <QuickActions />
      </motion.div>
    </div>
  );
}