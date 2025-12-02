import React, { useState } from 'react';
import {
  LaserEyesProvider,
  useLaserEyes,
  MAINNET,
  UNISAT,
  XVERSE,
  LEATHER,
  MAGIC_EDEN,
  OKX,
  PHANTOM
} from '@omnisat/lasereyes-react';

const WALLET_OPTIONS = [
  { id: UNISAT, name: 'UniSat', hasKey: 'hasUnisat' },
  { id: XVERSE, name: 'Xverse', hasKey: 'hasXverse' },
  { id: LEATHER, name: 'Leather', hasKey: 'hasLeather' },
  { id: MAGIC_EDEN, name: 'Magic Eden', hasKey: 'hasMagicEden' },
  { id: OKX, name: 'OKX', hasKey: 'hasOkx' },
  { id: PHANTOM, name: 'Phantom', hasKey: 'hasPhantom' },
];

const ADDRESS_PREFIX_LENGTH = 8;
const ADDRESS_SUFFIX_LENGTH = 6;

function WalletConnect() {
  const {
    connect,
    disconnect,
    connected,
    address,
    balance,
    isConnecting,
    hasUnisat,
    hasXverse,
    hasLeather,
    hasMagicEden,
    hasOkx,
    hasPhantom
  } = useLaserEyes();
  const [showWallets, setShowWallets] = useState(false);
  const [error, setError] = useState(null);

  const walletAvailability = {
    hasUnisat,
    hasXverse,
    hasLeather,
    hasMagicEden,
    hasOkx,
    hasPhantom
  };

  if (connected) {
    return <Dashboard address={address} balance={balance} onDisconnect={disconnect} />;
  }

  const handleConnect = async (walletId) => {
    try {
      setError(null);
      await connect(walletId);
    } catch (err) {
      setError(err.message || 'Failed to connect wallet');
    }
  };

  const availableWallets = WALLET_OPTIONS.filter(w => walletAvailability[w.hasKey]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>BTC Quest</h1>
        <p style={styles.subtitle}>Connect your Bitcoin wallet to get started</p>
        
        {error && <p style={styles.error}>{error}</p>}
        
        {!showWallets ? (
          <button 
            style={styles.button} 
            onClick={() => setShowWallets(true)}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div style={styles.walletList}>
            {availableWallets.length > 0 ? (
              availableWallets.map(wallet => (
                <button
                  key={wallet.id}
                  style={styles.walletButton}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                >
                  {wallet.name}
                </button>
              ))
            ) : (
              <p style={styles.noWallets}>
                No Bitcoin wallet detected. Please install a wallet extension like UniSat, Xverse, or Leather.
              </p>
            )}
            <button 
              style={styles.backButton} 
              onClick={() => setShowWallets(false)}
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ address, balance, onDisconnect }) {
  const displayAddress = address
    ? `${address.slice(0, ADDRESS_PREFIX_LENGTH)}...${address.slice(-ADDRESS_SUFFIX_LENGTH)}`
    : '';

  return (
    <div style={styles.container}>
      <div style={styles.dashboardCard}>
        <h1 style={styles.dashboardTitle}>Dashboard</h1>
        <div style={styles.infoSection}>
          <div style={styles.infoItem}>
            <span style={styles.label}>Wallet Address</span>
            <span style={styles.value}>{displayAddress}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.label}>Balance</span>
            <span style={styles.value}>{balance ? `${balance} sats` : '0 sats'}</span>
          </div>
        </div>
        <div style={styles.welcomeMessage}>
          <p>Welcome to BTC Quest! Your wallet is connected.</p>
        </div>
        <button style={styles.disconnectButton} onClick={onDisconnect}>
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '48px',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '400px',
    width: '90%',
  },
  title: {
    color: '#f7931a',
    fontSize: '2.5rem',
    marginBottom: '8px',
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '1rem',
    marginBottom: '32px',
  },
  button: {
    background: 'linear-gradient(135deg, #f7931a 0%, #ff9500 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '1.1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(247, 147, 26, 0.4)',
  },
  walletList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  walletButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  backButton: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.6)',
    border: 'none',
    padding: '12px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    marginTop: '8px',
  },
  noWallets: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
  },
  error: {
    color: '#ff6b6b',
    fontSize: '0.9rem',
    marginBottom: '16px',
    padding: '12px',
    background: 'rgba(255, 107, 107, 0.1)',
    borderRadius: '8px',
  },
  dashboardCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    padding: '48px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    maxWidth: '500px',
    width: '90%',
  },
  dashboardTitle: {
    color: '#f7931a',
    fontSize: '2rem',
    marginBottom: '32px',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: '24px',
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    marginBottom: '12px',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.9rem',
  },
  value: {
    color: 'white',
    fontSize: '0.9rem',
    fontFamily: 'monospace',
  },
  welcomeMessage: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '24px',
    padding: '16px',
    background: 'rgba(247, 147, 26, 0.1)',
    borderRadius: '8px',
    border: '1px solid rgba(247, 147, 26, 0.2)',
  },
  disconnectButton: {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '14px 24px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
};

function App() {
  return (
    <LaserEyesProvider config={{ network: MAINNET }}>
      <WalletConnect />
    </LaserEyesProvider>
  );
}

export default App;
