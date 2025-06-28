import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { aptosService } from '../services/aptosService';

interface WalletState {
  connected: boolean;
  address: string | null;
  balance: number;
  network: string;
  connecting: boolean;
  publicKey: string | null;
  walletName: string | null;
}

interface WalletContextType {
  wallet: WalletState;
  connectWallet: (walletName?: string) => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (transaction: any) => Promise<string>;
  signMessage: (message: string) => Promise<string>;
  getBalance: () => Promise<number>;
  switchNetwork: (network: string) => Promise<void>;
  fundAccount: () => Promise<void>;
  isWalletInstalled: (walletName: string) => boolean;
  getAvailableWallets: () => string[];
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
    publicKey: null,
    walletName: null,
  });

  // Check if wallet is already connected on mount
  useEffect(() => {
    checkWalletConnection();
    
    // Listen for wallet events
    if (typeof window !== 'undefined') {
      window.addEventListener('aptos:connect', handleWalletConnect);
      window.addEventListener('aptos:disconnect', handleWalletDisconnect);
      window.addEventListener('aptos:accountChanged', handleAccountChanged);
      window.addEventListener('aptos:networkChanged', handleNetworkChanged);
      
      return () => {
        window.removeEventListener('aptos:connect', handleWalletConnect);
        window.removeEventListener('aptos:disconnect', handleWalletDisconnect);
        window.removeEventListener('aptos:accountChanged', handleAccountChanged);
        window.removeEventListener('aptos:networkChanged', handleNetworkChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    try {
      // Check multiple wallet types
      const wallets = ['aptos', 'petra', 'martian', 'pontem', 'fewcha'];
      
      for (const walletName of wallets) {
        if (typeof window !== 'undefined' && (window as any)[walletName]) {
          const walletAPI = (window as any)[walletName];
          
          try {
            const isConnected = await walletAPI.isConnected();
            if (isConnected) {
              const account = await walletAPI.account();
              const network = await walletAPI.network();
              const balance = await getWalletBalance(account.address);
              
              setWallet({
                connected: true,
                address: account.address,
                balance,
                network: network.name || 'testnet',
                connecting: false,
                publicKey: account.publicKey,
                walletName,
              });
              break;
            }
          } catch (error) {
            console.log(`${walletName} wallet not connected`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connectWallet = async (preferredWallet?: string) => {
    try {
      setWallet(prev => ({ ...prev, connecting: true }));

      const availableWallets = getAvailableWallets();
      if (availableWallets.length === 0) {
        throw new Error('No Aptos wallet found. Please install Petra, Martian, Pontem, or Fewcha wallet.');
      }

      // Use preferred wallet or first available
      const walletToUse = preferredWallet && availableWallets.includes(preferredWallet) 
        ? preferredWallet 
        : availableWallets[0];

      const walletAPI = (window as any)[walletToUse];

      // Request connection
      const response = await walletAPI.connect();
      const account = await walletAPI.account();
      const network = await walletAPI.network();
      const balance = await getWalletBalance(account.address);

      setWallet({
        connected: true,
        address: account.address,
        balance,
        network: network.name || 'testnet',
        connecting: false,
        publicKey: account.publicKey,
        walletName: walletToUse,
      });

      console.log(`${walletToUse} wallet connected:`, account.address);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setWallet(prev => ({ ...prev, connecting: false }));
      throw error;
    }
  };

  const disconnectWallet = async () => {
    try {
      if (wallet.walletName && (window as any)[wallet.walletName]) {
        await (window as any)[wallet.walletName].disconnect();
      }
      
      setWallet({
        connected: false,
        address: null,
        balance: 0,
        network: 'testnet',
        connecting: false,
        publicKey: null,
        walletName: null,
      });

      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  const signTransaction = async (transaction: any): Promise<string> => {
    try {
      if (!wallet.connected || !wallet.walletName || !(window as any)[wallet.walletName]) {
        throw new Error('Wallet not connected');
      }

      const walletAPI = (window as any)[wallet.walletName];
      const response = await walletAPI.signAndSubmitTransaction(transaction);
      return response.hash;
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      if (!wallet.connected || !wallet.walletName || !(window as any)[wallet.walletName]) {
        throw new Error('Wallet not connected');
      }

      const walletAPI = (window as any)[wallet.walletName];
      const response = await walletAPI.signMessage({
        message,
        nonce: Math.random().toString(),
      });
      return response.signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const switchNetwork = async (network: string) => {
    try {
      if (!wallet.connected || !wallet.walletName || !(window as any)[wallet.walletName]) {
        throw new Error('Wallet not connected');
      }

      const walletAPI = (window as any)[wallet.walletName];
      await walletAPI.changeNetwork({ name: network });
      
      setWallet(prev => ({ ...prev, network }));
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  };

  const getWalletBalance = async (address?: string): Promise<number> => {
    try {
      const targetAddress = address || wallet.address;
      if (!targetAddress) return 0;

      return await aptosService.getAccountBalance(targetAddress);
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

  const fundAccount = async (): Promise<void> => {
    try {
      if (!wallet.address) {
        throw new Error('Wallet not connected');
      }

      await aptosService.fundAccount(wallet.address);
      await getBalance(); // Refresh balance
    } catch (error) {
      console.error('Error funding account:', error);
      throw error;
    }
  };

  const isWalletInstalled = (walletName: string): boolean => {
    return typeof window !== 'undefined' && !!(window as any)[walletName];
  };

  const getAvailableWallets = (): string[] => {
    if (typeof window === 'undefined') return [];
    
    const wallets = ['aptos', 'petra', 'martian', 'pontem', 'fewcha'];
    return wallets.filter(wallet => (window as any)[wallet]);
  };

  // Event handlers
  const handleWalletConnect = (event: any) => {
    console.log('Wallet connected event:', event);
    checkWalletConnection();
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected event');
    setWallet({
      connected: false,
      address: null,
      balance: 0,
      network: 'testnet',
      connecting: false,
      publicKey: null,
      walletName: null,
    });
  };

  const handleAccountChanged = (event: any) => {
    console.log('Account changed event:', event);
    checkWalletConnection();
  };

  const handleNetworkChanged = (event: any) => {
    console.log('Network changed event:', event);
    setWallet(prev => ({ ...prev, network: event.networkName || 'testnet' }));
  };

  const value: WalletContextType = {
    wallet,
    connectWallet,
    disconnectWallet,
    signTransaction,
    signMessage,
    getBalance,
    switchNetwork,
    fundAccount,
    isWalletInstalled,
    getAvailableWallets,
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