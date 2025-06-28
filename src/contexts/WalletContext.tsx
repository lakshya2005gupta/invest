import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
  connecting: boolean;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (transaction: any) => Promise<string>;
  getBalance: () => Promise<number>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [wallet, setWallet] = useState<WalletState>({
    connected: false,
    address: null,
    balance: 0,
    network: 'testnet',
    connecting: false,
  });

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    try {
      // Check if Aptos wallet is installed
      if (typeof window !== 'undefined' && (window as any).aptos) {
        const response = await (window as any).aptos.isConnected();
        if (response) {
          const account = await (window as any).aptos.account();
          const balance = await getWalletBalance(account.address);
          
          setWallet({
            connected: true,
            address: account.address,
            balance,
            network: 'testnet',
            connecting: false,
          });
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async () => {
    try {
      setWallet(prev => ({ ...prev, connecting: true }));

      // Check if Aptos wallet is installed
      if (typeof window === 'undefined' || !(window as any).aptos) {
        throw new Error('Aptos wallet not installed. Please install Petra or Martian wallet.');
      }

      // Request connection
      const response = await (window as any).aptos.connect();
      const account = await (window as any).aptos.account();
      const balance = await getWalletBalance(account.address);

      setWallet({
        connected: true,
        address: account.address,
        balance,
        network: 'testnet',
        connecting: false,
      });

      console.log('Wallet connected:', account.address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWallet(prev => ({ ...prev, connecting: false }));
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      if ((window as any).aptos) {
        await (window as any).aptos.disconnect();
      }
      
      setWallet({
        connected: false,
        address: null,
        balance: 0,
        network: 'testnet',
        connecting: false,
      });

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const signTransaction = async (transaction: any): Promise<string> => {
    try {
      if (!wallet.connected || !(window as any).aptos) {
        throw new Error('Wallet not connected');
      }

      const response = await (window as any).aptos.signAndSubmitTransaction(transaction);
      return response.hash;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  };

  const getWalletBalance = async (address?: string): Promise<number> => {
    try {
      const targetAddress = address || wallet.address;
      if (!targetAddress) return 0;

      // Simulate balance fetch - in real implementation, use Aptos SDK
      return Math.random() * 1000 + 100; // Random balance between 100-1100 APT
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  };

  const getBalance = async (): Promise<number> => {
    const balance = await getWalletBalance();
    setWallet(prev => ({ ...prev, balance }));
    return balance;
  };

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    signTransaction,
    getBalance,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};