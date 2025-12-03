import React from 'react';
import { LaserEyesProvider, useLaserEyes, UNISAT, XVERSE, LEATHER, MAGIC_EDEN, OKX, WIZZ, ORANGE } from '@omnisat/lasereyes-react';

function WalletConnect() {
  const { 
    connect, 
    disconnect, 
    connected, 
    address, 
    balance,
    provider 
  } = useLaserEyes();

  const wallets = [
    { name: 'Unisat', provider: UNISAT },
    { name: 'Xverse', provider: XVERSE },
    { name: 'Leather', provider: LEATHER },
    { name: 'Magic Eden', provider: MAGIC_EDEN },
    { name: 'OKX', provider: OKX },
    { name: 'Wizz', provider: WIZZ },
    { name: 'Orange', provider: ORANGE },
  ];

  const formatAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatBalance = (bal) => {
    if (!bal) return '0';
    return (Number(bal) / 100000000).toFixed(8);
  };

  return (
    <div className="wallet-container">
      <h1>BTC Quest</h1>
      <p className="subtitle">Connect your Bitcoin wallet to get started</p>
      
      {connected ? (
        <div className="connected-section">
          <div className="wallet-info">
            <div className="info-item">
              <span className="label">Connected Wallet:</span>
              <span className="value">{provider}</span>
            </div>
            <div className="info-item">
              <span className="label">Address:</span>
              <span className="value address">{formatAddress(address)}</span>
            </div>
            <div className="info-item">
              <span className="label">Balance:</span>
              <span className="value">{formatBalance(balance)} BTC</span>
            </div>
          </div>
          <button className="disconnect-btn" onClick={disconnect}>
            Disconnect Wallet
          </button>
        </div>
      ) : (
        <div className="wallet-buttons">
          {wallets.map((wallet) => (
            <button
              key={wallet.provider}
              className="wallet-btn"
              onClick={() => connect(wallet.provider)}
            >
              Connect {wallet.name}
            </button>
          ))}
        </div>
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
