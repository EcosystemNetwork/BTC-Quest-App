import React from 'react';
import ReactDOM from 'react-dom/client';
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes-react';
import App from './App';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LaserEyesProvider config={{ network: MAINNET }}>
      <App />
    </LaserEyesProvider>
  </React.StrictMode>
);
