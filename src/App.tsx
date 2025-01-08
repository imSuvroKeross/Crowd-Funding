import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import CampaignList from './components/CampaignList';
import './styles.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Campaign List Page */}
        <Route path="/campaigns" element={<CampaignList />} />
      </Routes>
    </Router>
  );
}

export default App;