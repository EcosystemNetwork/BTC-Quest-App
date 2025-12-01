import React from 'react';
import { LaserEyesProvider, useLaserEyes, UNISAT } from '@omnisat/lasereyes-react';
import './App.css';

function WalletConnect() {
  const { connect, disconnect, address, isConnected } = useLaserEyes();

  const handleConnect = async () => {
    try {
      await connect(UNISAT);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  return (
    <div className="wallet-container">
      <h1>BTC Quest</h1>
      <p className="subtitle">Connect your Bitcoin wallet to get started</p>
      
      {isConnected ? (
        <div className="connected-section">
          <div className="address-display">
            <span className="label">Connected:</span>
            <span className="address">{address?.slice(0, 8)}...{address?.slice(-8)}</span>
          </div>
          <button className="wallet-button disconnect" onClick={handleDisconnect}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <button className="wallet-button connect" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

function App() {
  return (
    <LaserEyesProvider>
      <WalletConnect />
    </LaserEyesProvider>
  );
}

export default App;
