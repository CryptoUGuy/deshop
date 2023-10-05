'use client';

import { useState } from 'react';

import { useAccount, useContractRead } from 'wagmi';
import { ethers } from 'ethers';

import { NoStoreView, StoreView } from '@/views';
import { DESHOP_ADDRESS } from '@/constants';
import { Store } from '@/types';

import DeShopAbi from '@/abis/DeShop.json'

export default function MyStore() {
    const [store, setStore] = useState<Store | undefined>()
    const { address } = useAccount()

    useContractRead({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'getStoreByOwner',
        args: [address],
        onSuccess(data: Store) {
            if (data.id == 0) {
                return
            }
            setStore({
                ...data,
                earnings: ethers.formatEther(data.earnings)
            })
        },
    })

    if (!store) {
        return <NoStoreView />
    }

    return (
        <StoreView store={store} />
    )
}
