'use client';

import { useAccount } from 'wagmi'

import { ConnectedView } from '@/views/ConnectedView';
import { NonConnectedView } from '@/views/NonConnectedView';

export default function Home() {
  const { isConnected } = useAccount()

  if (isConnected) {
    return <ConnectedView />
  }

  return <NonConnectedView />
}


