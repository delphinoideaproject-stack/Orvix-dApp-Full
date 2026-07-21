import React, { createContext, useContext } from 'react';
import { BrowserProvider } from 'ethers';
import { useWeb3 } from '../../lib/web3';
import type { WalletState, WalletType } from '../types';

interface WalletContextValue extends WalletState {
  connect: (type: WalletType) => Promise<void>;
  disconnect: () => void;
  provider: BrowserProvider | null;
  error: string | null;
}

const WalletContext = createContext<WalletContextValue | null>(null);

function shortenAddress(addr: string) {
  return addr.slice(0, 6) + '...' + addr.slice(-4).toUpperCase();
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { 
    address, 
    isConnected, 
    chainId, 
    open: openWalletModal, 
    disconnect: disconnectWeb3, 
    provider 
  } = useWeb3();

  const connect = async (type: WalletType) => {
    openWalletModal();
  };

  const disconnect = () => {
    disconnectWeb3();
  };

  return (
    <WalletContext.Provider 
      value={{ 
        address, 
        chainId, 
        connected: isConnected, 
        walletType: isConnected ? 'metamask' : null, 
        connect, 
        disconnect, 
        provider: provider as BrowserProvider | null, 
        error: null 
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet outside WalletProvider');
  return ctx;
}

export { shortenAddress };
