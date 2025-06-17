import React, { useState } from 'react';
import { Calendar, MapPin, Users, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  regions: string[];
  ageGroups: string[];
  genders: string[];
}

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableRegions?: string[];
  availableAgeGroups?: string[];
  isOpen: boolean;
  onToggle: () => void;
}

export function FilterPanel({
  filters,
  onFiltersChange,
  availableRegions = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
  availableAgeGroups = ['0-17', '18-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+'],
  isOpen,
  onToggle
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleArrayFilterChange = (key: 'regions' | 'ageGroups' | 'genders', value: string) => {
    const currentArray = localFilters[key];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterOptions = {
      dateRange: { start: '', end: '' },
      regions: [],
      ageGroups: [],
      genders: []
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = 
    localFilters.dateRange.start || 
    localFilters.dateRange.end || 
    localFilters.regions.length > 0 || 
    localFilters.ageGroups.length > 0 || 
    localFilters.genders.length > 0;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filters
        {hasActiveFilters && (
          <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
            Active
          </span>
        )}
      </button>

      {/* Filter Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-lg"
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <div className="flex items-center space-x-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={onToggle}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Date Range */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={localFilters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...localFilters.dateRange,
                        start: e.target.value
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="date"
                      value={localFilters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', {
                        ...localFilters.dateRange,
                        end: e.target.value
                      })}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Regions */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="h-4 w-4 mr-2" />
                    Regions
                  </label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {availableRegions.map((region) => (
                      <label key={region} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.regions.includes(region)}
                          onChange={() => handleArrayFilterChange('regions', region)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{region}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Age Groups */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                    <Users className="h-4 w-4 mr-2" />
                    Age Groups
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {availableAgeGroups.map((ageGroup) => (
                      <label key={ageGroup} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.ageGroups.includes(ageGroup)}
                          onChange={() => handleArrayFilterChange('ageGroups', ageGroup)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{ageGroup}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Gender
                  </label>
                  <div className="space-y-2">
                    {['Male', 'Female', 'Other'].map((gender) => (
                      <label key={gender} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={localFilters.genders.includes(gender.toLowerCase())}
                          onChange={() => handleArrayFilterChange('genders', gender.toLowerCase())}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{gender}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}