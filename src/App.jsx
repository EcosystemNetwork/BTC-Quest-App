import { useState } from 'react';
import { useLaserEyes } from '@omnisat/lasereyes-react';
import Dashboard from './Dashboard';

function App() {
  const { connected, connect, disconnect, address, isConnecting, hasUnisat, hasXverse, hasOkx, hasLeather, hasMagicEden } = useLaserEyes();
  const [demoMode, setDemoMode] = useState(false);

  const availableWallets = [
    { name: 'Unisat', provider: 'unisat', available: hasUnisat },
    { name: 'Xverse', provider: 'xverse', available: hasXverse },
    { name: 'OKX', provider: 'okx', available: hasOkx },
    { name: 'Leather', provider: 'leather', available: hasLeather },
    { name: 'Magic Eden', provider: 'magic-eden', available: hasMagicEden },
  ];

  const handleConnect = async (provider) => {
    try {
      await connect(provider);
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  // Demo mode to preview dashboard without wallet
  if (demoMode) {
    return <Dashboard address="bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" onDisconnect={() => setDemoMode(false)} />;
  }

  // If connected, show Dashboard
  if (connected) {
    return <Dashboard address={address} onDisconnect={disconnect} />;
  }

  // Show wallet connect screen
  return (
    <div className="app">
      <div className="login-container">
        <h1>BTC Quest</h1>
        <p className="subtitle">Connect your Bitcoin wallet to get started</p>
        
        <div className="wallet-buttons">
          {availableWallets.map((wallet) => (
            <button
              key={wallet.provider}
              className={`wallet-button ${!wallet.available ? 'disabled' : ''}`}
              onClick={() => handleConnect(wallet.provider)}
              disabled={isConnecting || !wallet.available}
            >
              {isConnecting ? 'Connecting...' : wallet.name}
              {!wallet.available && <span className="install-hint">Not installed</span>}
            </button>
          ))}
        </div>

        <p className="helper-text">
          Don't have a wallet?{' '}
          <a href="https://unisat.io" target="_blank" rel="noopener noreferrer">
            Install Unisat
          </a>
        </p>

        <button className="demo-button" onClick={() => setDemoMode(true)}>
          Try Demo Mode
        </button>
      </div>
    </div>
  );
}

export default App;
