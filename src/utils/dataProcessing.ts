import Papa from 'papaparse';
import { CovidDataEntry } from '../types';

export interface ProcessedData {
  totalRecords: number;
  validRecords: number;
  errors: string[];
  data: CovidDataEntry[];
}

export function parseCSVFile(file: File): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const processedData = processRawData(results.data as any[]);
          resolve(processedData);
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        reject(error);
      }
    });
  });
}

export function processRawData(rawData: any[]): ProcessedData {
  const errors: string[] = [];
  const validData: CovidDataEntry[] = [];
  
  const requiredFields = ['date', 'region', 'country', 'age_group', 'gender', 'deaths', 'cases', 'population'];
  
  rawData.forEach((row, index) => {
    const rowNumber = index + 1;
    
    // Check for required fields
    const missingFields = requiredFields.filter(field => !row[field] && row[field] !== 0);
    if (missingFields.length > 0) {
      errors.push(`Row ${rowNumber}: Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(row.date)) {
      errors.push(`Row ${rowNumber}: Invalid date format. Expected YYYY-MM-DD, got: ${row.date}`);
      return;
    }
    
    // Validate numeric fields
    const numericFields = ['deaths', 'cases', 'population'];
    for (const field of numericFields) {
      const value = parseFloat(row[field]);
      if (isNaN(value) || value < 0) {
        errors.push(`Row ${rowNumber}: Invalid ${field} value: ${row[field]}`);
        return;
      }
    }
    
    // Validate gender
    const validGenders = ['male', 'female', 'other'];
    if (!validGenders.includes(row.gender.toLowerCase())) {
      errors.push(`Row ${rowNumber}: Invalid gender value: ${row.gender}`);
      return;
    }
    
    // Create valid data entry
    const dataEntry: CovidDataEntry = {
      id: `${row.country}_${row.region}_${row.date}_${row.age_group}_${row.gender}`,
      date: row.date,
      region: row.region,
      country: row.country,
      age_group: row.age_group,
      gender: row.gender.toLowerCase() as 'male' | 'female' | 'other',
      deaths: parseInt(row.deaths),
      cases: parseInt(row.cases),
      population: parseInt(row.population),
      userId: '', // Will be set when saving to database
      uploadedAt: new Date()
    };
    
    validData.push(dataEntry);
  });
  
  return {
    totalRecords: rawData.length,
    validRecords: validData.length,
    errors,
    data: validData
  };
}

export function aggregateDataByRegion(data: CovidDataEntry[]) {
  const regionData = new Map<string, { deaths: number; cases: number; population: number }>();
  
  data.forEach(entry => {
    const existing = regionData.get(entry.region) || { deaths: 0, cases: 0, population: 0 };
    regionData.set(entry.region, {
      deaths: existing.deaths + entry.deaths,
      cases: existing.cases + entry.cases,
      population: existing.population + entry.population
    });
  });
  
  return Array.from(regionData.entries()).map(([region, stats]) => ({
    label: region,
    deaths: stats.deaths,
    cases: stats.cases,
    population: stats.population,
    mortalityRate: ((stats.deaths / stats.cases) * 100).toFixed(2)
  }));
}

export function aggregateDataByAgeGroup(data: CovidDataEntry[]) {
  const ageGroupData = new Map<string, { deaths: number; cases: number }>();
  
  data.forEach(entry => {
    const existing = ageGroupData.get(entry.age_group) || { deaths: 0, cases: 0 };
    ageGroupData.set(entry.age_group, {
      deaths: existing.deaths + entry.deaths,
      cases: existing.cases + entry.cases
    });
  });
  
  return Array.from(ageGroupData.entries()).map(([ageGroup, stats]) => ({
    label: ageGroup,
    value: stats.deaths,
    cases: stats.cases
  }));
}

export function aggregateDataByGender(data: CovidDataEntry[]) {
  const genderData = new Map<string, { deaths: number; cases: number }>();
  
  data.forEach(entry => {
    const existing = genderData.get(entry.gender) || { deaths: 0, cases: 0 };
    genderData.set(entry.gender, {
      deaths: existing.deaths + entry.deaths,
      cases: existing.cases + entry.cases
    });
  });
  
  return Array.from(genderData.entries()).map(([gender, stats]) => ({
    label: gender.charAt(0).toUpperCase() + gender.slice(1),
    value: stats.deaths,
    cases: stats.cases
  }));
}

export function createTimeSeriesData(data: CovidDataEntry[]) {
  const timeSeriesData = new Map<string, { deaths: number; cases: number }>();
  
  data.forEach(entry => {
    const existing = timeSeriesData.get(entry.date) || { deaths: 0, cases: 0 };
    timeSeriesData.set(entry.date, {
      deaths: existing.deaths + entry.deaths,
      cases: existing.cases + entry.cases
    });
  });
  
  return Array.from(timeSeriesData.entries())
    .map(([date, stats]) => ({
      date,
      deaths: stats.deaths,
      cases: stats.cases
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function calculateSummaryStats(data: CovidDataEntry[]) {
  const totalDeaths = data.reduce((sum, entry) => sum + entry.deaths, 0);
  const totalCases = data.reduce((sum, entry) => sum + entry.cases, 0);
  const totalPopulation = data.reduce((sum, entry) => sum + entry.population, 0);
  
  const mortalityRate = totalCases > 0 ? (totalDeaths / totalCases) * 100 : 0;
  const deathRate = totalPopulation > 0 ? (totalDeaths / totalPopulation) * 100000 : 0; // per 100k population
  
  // Find peak month
  const monthlyData = new Map<string, number>();
  data.forEach(entry => {
    const month = entry.date.substring(0, 7); // YYYY-MM
    monthlyData.set(month, (monthlyData.get(month) || 0) + entry.deaths);
  });
  
  const peakMonth = Array.from(monthlyData.entries())
    .sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  
  return {
    totalDeaths,
    totalCases,
    totalPopulation,
    mortalityRate: parseFloat(mortalityRate.toFixed(2)),
    deathRate: parseFloat(deathRate.toFixed(2)),
    peakMonth,
    recordCount: data.length
  };
}