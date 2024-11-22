import React from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import LandingPage from './components/LandingPage';
import { useNoteStore } from './store/noteStore';
import { ArrowLeft } from 'lucide-react';
import { Toaster } from './components/Toaster';

function App() {
  const { darkMode, hasVisitedBefore, setHasVisitedBefore, resetHasVisitedBefore } = useNoteStore();

  if (!hasVisitedBefore) {
    return <LandingPage onGetStarted={() => setHasVisitedBefore(true)} />;
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="flex-none p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <button
          onClick={() => resetHasVisitedBefore()}
          className="inline-flex items-center px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Landing
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Editor />
      </div>
      <Toaster />
    </div>
  );
}

export default App;