'use client';

import { connectorsForWallets, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { rabbyWallet } from '@rainbow-me/rainbowkit/wallets';

import { configureChains, createConfig } from 'wagmi';
import { baseGoerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
    [baseGoerli],
    [
        alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID || "" }),
        publicProvider()
    ]
);

const projectId = '4b20a058bd8a8579be7510fe01a982c2';

const { wallets } = getDefaultWallets({
    appName: 'DeShop',
    projectId,
    chains
});

const connectors = connectorsForWallets([
    ...wallets,
    {
        groupName: 'Other',
        wallets: [rabbyWallet({
            chains
        })]
    }
])

export const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient
})

export default chains;