import React from 'react';
import { LaserEyesProvider, useLaserEyes, UNISAT } from '@omnisat/lasereyes-react';

function WalletConnect() {
  const { connect, disconnect, connected, address } = useLaserEyes();

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
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>BTC Quest Wallet Connect</h1>
      {connected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={handleDisconnect} style={buttonStyle}>
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={handleConnect} style={buttonStyle}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#f7931a',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  marginTop: '20px',
};

function App() {
  return (
    <LaserEyesProvider>
      <WalletConnect />
    </LaserEyesProvider>
  );
}

export default App;
