import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import HomePage from './pages/HomePage';
import BettingPage from './pages/BettingPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/bet/:pair" element={<BettingPage />} />
        </Routes>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 5000,
            style: {
              background: '#232D3F',
              color: '#fff',
            },
          }}
        />
      </Router>
    </Web3Provider>
  );
}

export default App;