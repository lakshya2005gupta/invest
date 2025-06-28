import React from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from '@aptos-labs/wallet-adapter-petra-plugin';
import { MartianWallet } from '@aptos-labs/wallet-adapter-martian-plugin';
import { PontemWallet } from '@aptos-labs/wallet-adapter-pontem-plugin';

interface AptosWalletProviderProps {
  children: React.ReactNode;
}

const AptosWalletProvider: React.FC<AptosWalletProviderProps> = ({ children }) => {
  const wallets = [
    new PetraWallet(),
    new MartianWallet(),
    new PontemWallet(),
  ];

  return (
    <AptosWalletAdapterProvider 
      plugins={wallets} 
      autoConnect={true}
      onError={(error) => {
        console.error('Wallet connection error:', error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
};

export default AptosWalletProvider;