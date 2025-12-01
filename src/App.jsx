import React from 'react';
import { LaserEyesProvider, useLaserEyes, UNISAT, XVERSE, LEATHER } from '@omnisat/lasereyes-react';

function WalletConnect() {
  const { connect, disconnect, connected, address, provider } = useLaserEyes();

  const handleConnect = async (walletType) => {
    try {
      await connect(walletType);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>BTC Quest</h1>
      <p style={styles.subtitle}>Connect your Bitcoin wallet to get started</p>
      
      {connected ? (
        <div style={styles.connectedContainer}>
          <p style={styles.connectedText}>Connected!</p>
          <p style={styles.address}>
            {address ? `${address.slice(0, 8)}...${address.slice(-8)}` : 'No address'}
          </p>
          <p style={styles.provider}>Provider: {provider || 'Unknown'}</p>
          <button style={styles.disconnectButton} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <div style={styles.walletButtons}>
          <button
            style={styles.walletButton}
            onClick={() => handleConnect(UNISAT)}
          >
            Connect UniSat
          </button>
          <button
            style={styles.walletButton}
            onClick={() => handleConnect(XVERSE)}
          >
            Connect Xverse
          </button>
          <button
            style={styles.walletButton}
            onClick={() => handleConnect(LEATHER)}
          >
            Connect Leather
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    padding: '20px',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '10px',
    color: '#f7931a',
  },
  subtitle: {
    fontSize: '1.1rem',
    marginBottom: '30px',
    color: '#cccccc',
  },
  walletButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    width: '100%',
    maxWidth: '300px',
  },
  walletButton: {
    padding: '15px 30px',
    fontSize: '1rem',
    backgroundColor: '#f7931a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  connectedContainer: {
    textAlign: 'center',
  },
  connectedText: {
    fontSize: '1.5rem',
    color: '#4caf50',
    marginBottom: '10px',
  },
  address: {
    fontSize: '0.9rem',
    backgroundColor: '#2a2a4e',
    padding: '10px 20px',
    borderRadius: '8px',
    marginBottom: '10px',
    wordBreak: 'break-all',
  },
  provider: {
    fontSize: '0.85rem',
    color: '#999999',
    marginBottom: '20px',
  },
  disconnectButton: {
    padding: '12px 24px',
    fontSize: '1rem',
    backgroundColor: '#e74c3c',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

function App() {
  return (
    <LaserEyesProvider>
      <WalletConnect />
    </LaserEyesProvider>
  );
}

export default App;
