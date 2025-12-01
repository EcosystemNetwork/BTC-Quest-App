import React from 'react';
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes-react';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <LaserEyesProvider config={{ network: MAINNET }}>
      <div className="app">
        <Dashboard />
      </div>
    </LaserEyesProvider>
  );
}

export default App;
