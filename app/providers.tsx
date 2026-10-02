'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, polygon, bsc } from 'wagmi/chains';
import { getDefaultConfig, RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';

import '@rainbow-me/rainbowkit/styles.css';

const { wallets } = getDefaultWallets();

const config = createConfig(
  getDefaultConfig({
    appName: 'Secure Contract AI',
    projectId: '954fa0f9345cbb6cde2942b0f44357c9', 
    chains: [mainnet, polygon, bsc],
    wallets: wallets,
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [bsc.id]: http(),
    },
  })
);

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
