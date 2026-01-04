import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import WelcomePage from './pages/WelcomePage';
import DiscoverPage from './pages/DiscoverPage';
import ExplorePage from './pages/ExplorePage';
import PlanPage from './pages/PlanPage';
import './App.css';

/**
 * App - Main application component
 */
function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/plan" element={<PlanPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
