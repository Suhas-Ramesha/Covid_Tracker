export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface CovidDataEntry {
  id: string;
  date: string;
  region: string;
  country: string;
  age_group: string;
  gender: 'male' | 'female' | 'other';
  deaths: number;
  cases: number;
  population: number;
  userId: string;
  uploadedAt: Date;
}

export interface AnalysisResult {
  totalDeaths: number;
  totalCases: number;
  mortalityRate: number;
  peakMonth: string;
  ageGroupBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
  timeSeriesData: Array<{
    date: string;
    deaths: number;
    cases: number;
  }>;
}

export interface FileUpload {
  id: string;
  filename: string;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  recordCount: number;
  fileSize: number;
}