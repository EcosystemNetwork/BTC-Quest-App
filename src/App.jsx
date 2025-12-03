import React, { lazy, Suspense, memo } from 'react';
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes-react';
import './App.css';

// Lazy load Dashboard for performance optimization
const Dashboard = lazy(() => import('./components/Dashboard'));

// Memoized loading spinner component
const LoadingSpinner = memo(function LoadingSpinner() {
  return (
    <div className="loading">
      <div className="spinner"></div>
    </div>
  );
});

// Memoized footer component
const Footer = memo(function Footer() {
  return (
    <footer className="app-footer">
      <p>Powered by LaserEyes | Built with ₿itcoin</p>
    </footer>
  );
});

function App() {
  return (
    <LaserEyesProvider
      config={{
        network: MAINNET,
      }}
    >
      <div className="app">
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
        <Footer />
      </div>
    </LaserEyesProvider>
  );
}

export default App;
