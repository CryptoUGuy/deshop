import "./global.css";
import '@rainbow-me/rainbowkit/styles.css';

import { WagmiConfig } from "wagmi";
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import chains, { wagmiConfig } from '@/utils/rainbowConfig'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { DESCRIPTION, PROJECT_NAME } from '@/constants';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: PROJECT_NAME,
  description: DESCRIPTION
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider chains={chains}>
            {children}
          </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  )
}
