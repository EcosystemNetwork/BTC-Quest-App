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

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>BTC Quest - Wallet Connect</h1>
      {connected ? (
        <div>
          <p>Connected: {address}</p>
          <button onClick={handleDisconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
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
