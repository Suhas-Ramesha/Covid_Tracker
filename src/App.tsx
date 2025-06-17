import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ThemeProvider } from './contexts/ThemeContext';
import { TutorialProvider } from './contexts/TutorialContext';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { TutorialOverlay } from './components/Tutorial/TutorialOverlay';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <TutorialProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Header />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 md:ml-64 pt-16">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/upload" element={<Upload />} />
                  <Route path="/analytics" element={<div className="text-gray-900 dark:text-white">Analytics Page (Coming Soon)</div>} />
                  <Route path="/reports" element={<div className="text-gray-900 dark:text-white">Reports Page (Coming Soon)</div>} />
                  <Route path="/settings" element={<div className="text-gray-900 dark:text-white">Settings Page (Coming Soon)</div>} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </div>
            </main>
          </div>
          <TutorialOverlay />
        </div>
      </Router>
    </TutorialProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;