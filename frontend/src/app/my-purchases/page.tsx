'use client';

import { useState } from 'react';
import { useAccount, useContractRead } from 'wagmi'
import { ethers } from "ethers";

import { NonPurchasesView } from '@/views/NonPurchasesView';
import { PurchasesView } from '@/views/PurchasesView';
import { DESHOP_ADDRESS } from '@/constants';
import { Item } from '@/types'

import DeShopAbi from '@/abis/DeShop.json'

export default function MyPurchases() {
    const { address } = useAccount()
    const [items, setItems] = useState<Item[]>([])

    useContractRead({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'getItemsBought',
        args: [address],
        onSuccess(data: Item[]) {
            setItems(data.map((item) => {
                return {
                    ...item,
                    price: ethers.formatEther(item.price)
                }
            }))
        },
    })

    if (items.length == 0) {
        return <NonPurchasesView />
    }

    return <PurchasesView items={items} />
}