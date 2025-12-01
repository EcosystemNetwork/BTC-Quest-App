import React, { useState } from 'react';
import { useLaserEyes, UNISAT, XVERSE, LEATHER } from '@omnisat/lasereyes-react';

const WALLETS = [
  { id: UNISAT, name: 'UniSat', icon: '🟠' },
  { id: XVERSE, name: 'Xverse', icon: '🟣' },
  { id: LEATHER, name: 'Leather', icon: '🟤' },
];

function WalletConnect() {
  const { connect, disconnect, address, connected, isConnecting } = useLaserEyes();
  const [showWallets, setShowWallets] = useState(false);

  const handleConnect = async (walletId) => {
    try {
      await connect(walletId);
      setShowWallets(false);
    } catch (err) {
      console.error('Failed to connect:', err);
    }
  };

  const truncateAddress = (addr) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (connected) {
    return (
      <div className="wallet-connected">
        <div className="wallet-address">
          <span className="connected-dot"></span>
          <span className="address-text">{truncateAddress(address)}</span>
        </div>
        <button className="btn btn-disconnect" onClick={disconnect}>
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-connect">
      {showWallets ? (
        <div className="wallet-dropdown">
          <div className="dropdown-header">
            <span>Choose Wallet</span>
            <button className="close-btn" onClick={() => setShowWallets(false)}>×</button>
          </div>
          <div className="wallet-list">
            {WALLETS.map(wallet => (
              <button
                key={wallet.id}
                className="wallet-option"
                onClick={() => handleConnect(wallet.id)}
                disabled={isConnecting}
              >
                <span className="wallet-icon">{wallet.icon}</span>
                <span className="wallet-name">{wallet.name}</span>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          className="btn btn-connect"
          onClick={() => setShowWallets(true)}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="spinner"></span>
              Connecting...
            </>
          ) : (
            <>
              <span className="connect-icon">⚡</span>
              Connect Wallet
            </>
          )}
        </button>
      )}
    </div>
  );
}

export default WalletConnect;
