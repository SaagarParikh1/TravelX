import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Weather from './pages/Weather';
import Images from './pages/Images';
import Activities from './pages/Activities';
import Questions from './pages/Questions';
import { DestinationProvider } from './context/DestinationContext';

function App() {
  return (
    <DestinationProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/weather" element={<Weather />} />
            <Route path="/images" element={<Images />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/questions" element={<Questions />} />
          </Routes>
        </div>
      </Router>
    </DestinationProvider>
  );
}

export default App;