import React from 'react';
import { useLaserEyes, UNISAT, XVERSE, OYL, LEATHER, MAGIC_EDEN, OKX, PHANTOM, WIZZ } from '@omnisat/lasereyes-react';

const WALLET_OPTIONS = [
  { name: 'Unisat', value: UNISAT },
  { name: 'Xverse', value: XVERSE },
  { name: 'OYL', value: OYL },
  { name: 'Leather', value: LEATHER },
  { name: 'Magic Eden', value: MAGIC_EDEN },
  { name: 'OKX', value: OKX },
  { name: 'Phantom', value: PHANTOM },
  { name: 'Wizz', value: WIZZ },
];

function App() {
  const { connect, disconnect, connected, address, provider } = useLaserEyes();

  const handleConnect = async (walletType) => {
    try {
      await connect(walletType);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1>BTC Quest</h1>
        <p className="subtitle">Connect your Bitcoin wallet to get started</p>
      </header>

      <main className="main-content">
        {connected ? (
          <div className="connected-container">
            <div className="wallet-info">
              <div className="status-badge connected">Connected</div>
              <p className="wallet-label">Wallet Address:</p>
              <p className="wallet-address">{address}</p>
              {provider && (
                <p className="wallet-provider">Provider: {provider}</p>
              )}
            </div>
            <button className="disconnect-btn" onClick={handleDisconnect}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div className="wallet-selection">
            <h2>Select a Wallet</h2>
            <div className="wallet-grid">
              {WALLET_OPTIONS.map((wallet) => (
                <button
                  key={wallet.value}
                  className="wallet-btn"
                  onClick={() => handleConnect(wallet.value)}
                >
                  {wallet.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Powered by LaserEyes</p>
      </footer>
    </div>
  );
}

export default App;
