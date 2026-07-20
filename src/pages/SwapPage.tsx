import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WalletProvider } from '../swap-components/contexts/WalletContext';
import { SettingsProvider } from '../swap-components/contexts/SettingsContext';
import { ToastProvider } from '../swap-components/contexts/ToastContext';
import SwapCard from '../swap-components/components/SwapCard';
import { Token } from '../types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30000, refetchOnWindowFocus: false },
  },
});

export function SwapPage({ 
  embedded = false, 
  onModalOpenChange, 
  preselectedToken,
  onClearPreselectedToken 
}: { 
  embedded?: boolean; 
  onModalOpenChange?: (isOpen: boolean) => void;
  preselectedToken?: Token | null;
  onClearPreselectedToken?: () => void;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <WalletProvider>
          <ToastProvider>
            <div className={`w-full max-w-md mx-auto ${embedded ? 'py-4' : 'py-8'}`}>
              <SwapCard />
            </div>
          </ToastProvider>
        </WalletProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
