import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  page?: string;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  startTutorial: () => void;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  completeTutorial: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to COVID Analytics! 🎉',
    description: 'Let\'s take a quick tour of your new analytics dashboard. This tutorial will show you all the key features to help you analyze COVID-19 data effectively.',
    target: 'body',
    position: 'bottom'
  },
  {
    id: 'header',
    title: 'Navigation Header',
    description: 'Your main navigation bar contains your profile info, dark mode toggle (moon/sun icon), tutorial help button, and sign-out option. Try clicking the moon icon to switch to dark mode!',
    target: '[data-tutorial="header"]',
    position: 'bottom'
  },
  {
    id: 'sidebar',
    title: 'Main Navigation Menu',
    description: 'Use this sidebar to navigate between different sections: Dashboard (overview), Upload Data (import files), Analytics (detailed charts), Reports (summaries), and Settings (preferences).',
    target: '[data-tutorial="sidebar"]',
    position: 'right'
  },
  {
    id: 'stats-cards',
    title: 'Key Statistics Overview',
    description: 'These cards display your most important COVID data metrics at a glance - total deaths, cases, mortality rate, and recovery rate. They update automatically when you upload new data.',
    target: '[data-tutorial="stats-cards"]',
    position: 'bottom'
  },
  {
    id: 'chart',
    title: 'Interactive Data Visualization',
    description: 'This chart shows COVID trends over time. You can hover over data points for detailed information and toggle between different data types using the legend.',
    target: '[data-tutorial="chart"]',
    position: 'top'
  },
  {
    id: 'quick-actions',
    title: 'Quick Action Shortcuts',
    description: 'These buttons provide quick access to common tasks like uploading data, viewing detailed analytics, generating reports, and exporting your processed data.',
    target: '[data-tutorial="quick-actions"]',
    position: 'top'
  },
  {
    id: 'upload-data',
    title: 'Ready to Get Started? 🚀',
    description: 'Click "Upload Data" to import your COVID-19 datasets and begin your analysis. The system supports CSV and Excel files with automatic data validation.',
    target: '[data-tutorial="upload-action"]',
    position: 'top'
  }
];

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has completed tutorial
    if (user) {
      const hasCompletedTutorial = localStorage.getItem(`tutorial-completed-${user.uid}`);
      if (!hasCompletedTutorial) {
        // Start tutorial after a short delay for better UX
        setTimeout(() => {
          setIsActive(true);
          setCurrentStep(0);
        }, 1500);
      }
    }
  }, [user]);

  const startTutorial = () => {
    setCurrentStep(0);
    setIsActive(true);
  };

  const nextStep = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    if (user) {
      localStorage.setItem(`tutorial-completed-${user.uid}`, 'true');
    }
  };

  const completeTutorial = () => {
    setIsActive(false);
    if (user) {
      localStorage.setItem(`tutorial-completed-${user.uid}`, 'true');
    }
  };

  return (
    <TutorialContext.Provider value={{
      isActive,
      currentStep,
      steps: tutorialSteps,
      startTutorial,
      nextStep,
      prevStep,
      skipTutorial,
      completeTutorial
    }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}