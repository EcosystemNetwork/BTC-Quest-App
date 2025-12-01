import React from 'react';
import { LaserEyesProvider, useLaserEyes, MAINNET } from '@omnisat/lasereyes-react';
import './App.css';

const WALLET_OPTIONS = [
  { id: 'unisat', name: 'Unisat', hasKey: 'hasUnisat' },
  { id: 'xverse', name: 'Xverse', hasKey: 'hasXverse' },
  { id: 'leather', name: 'Leather', hasKey: 'hasLeather' },
  { id: 'magic-eden', name: 'Magic Eden', hasKey: 'hasMagicEden' },
  { id: 'okx', name: 'OKX', hasKey: 'hasOkx' },
  { id: 'phantom', name: 'Phantom', hasKey: 'hasPhantom' },
  { id: 'wizz', name: 'Wizz', hasKey: 'hasWizz' },
  { id: 'orange', name: 'Orange', hasKey: 'hasOrange' },
  { id: 'oyl', name: 'OYL', hasKey: 'hasOyl' },
];

function WalletConnect() {
  const {
    connect,
    disconnect,
    connected,
    isConnecting,
    address,
    paymentAddress,
    publicKey,
    balance,
    network,
    provider,
    hasUnisat,
    hasXverse,
    hasLeather,
    hasMagicEden,
    hasOkx,
    hasPhantom,
    hasWizz,
    hasOrange,
    hasOyl,
  } = useLaserEyes();

  const hasProviderMap = {
    hasUnisat,
    hasXverse,
    hasLeather,
    hasMagicEden,
    hasOkx,
    hasPhantom,
    hasWizz,
    hasOrange,
    hasOyl,
  };

  const handleConnect = async (walletId) => {
    try {
      await connect(walletId);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const formatBalance = (satoshis) => {
    if (satoshis === undefined || satoshis === null) return '0';
    const btc = Number(satoshis) / 100000000;
    return btc.toFixed(8);
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  if (connected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-header">
          <div className="connection-status">
            <span className="status-dot connected" />
            <span>Connected via {provider}</span>
          </div>
          <button className="disconnect-btn" onClick={handleDisconnect}>
            Disconnect
          </button>
        </div>
        
        <div className="wallet-info">
          <div className="info-card">
            <h3>Network</h3>
            <p className="network-badge">{network}</p>
          </div>
          
          <div className="info-card">
            <h3>Balance</h3>
            <p className="balance">{formatBalance(balance)} BTC</p>
          </div>
          
          <div className="info-card">
            <h3>Ordinals Address</h3>
            <p className="address" title={address}>
              {truncateAddress(address)}
            </p>
          </div>
          
          <div className="info-card">
            <h3>Payment Address</h3>
            <p className="address" title={paymentAddress}>
              {truncateAddress(paymentAddress)}
            </p>
          </div>
          
          {publicKey && (
            <div className="info-card full-width">
              <h3>Public Key</h3>
              <p className="pubkey" title={publicKey}>
                {truncateAddress(publicKey)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      <h2>Connect Your Bitcoin Wallet</h2>
      <p className="subtitle">Select a wallet to connect</p>
      
      <div className="wallet-grid">
        {WALLET_OPTIONS.map((wallet) => {
          const isAvailable = hasProviderMap[wallet.hasKey];
          return (
            <button
              key={wallet.id}
              className={`wallet-btn ${!isAvailable ? 'unavailable' : ''}`}
              onClick={() => handleConnect(wallet.id)}
              disabled={isConnecting || !isAvailable}
              title={!isAvailable ? `${wallet.name} not installed` : `Connect with ${wallet.name}`}
            >
              <span className="wallet-name">{wallet.name}</span>
              {!isAvailable && <span className="install-hint">Not installed</span>}
              {isConnecting && <span className="connecting">Connecting...</span>}
            </button>
          );
        })}
      </div>
      
      <p className="help-text">
        Don't have a Bitcoin wallet?{' '}
        <a href="https://unisat.io" target="_blank" rel="noopener noreferrer">
          Get Unisat
        </a>
        {' or '}
        <a href="https://www.xverse.app" target="_blank" rel="noopener noreferrer">
          Get Xverse
        </a>
      </p>
    </div>
  );
}

function App() {
  return (
    <LaserEyesProvider
      config={{
        network: MAINNET,
      }}
    >
      <div className="app">
        <header className="app-header">
          <h1>BTC Quest Wallet</h1>
        </header>
        <main className="app-main">
          <WalletConnect />
        </main>
        <footer className="app-footer">
          <p>Powered by LaserEyes</p>
        </footer>
      </div>
    </LaserEyesProvider>
  );
}

export default App;
