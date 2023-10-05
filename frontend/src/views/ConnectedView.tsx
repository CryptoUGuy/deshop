import { useState } from 'react';

import { Box, Typography } from '@mui/material'
import { useContractRead } from 'wagmi'
import { ethers } from "ethers";

import { DESHOP_ADDRESS } from '@/constants';
import { CardItems } from '@/components';
import { MainLayout } from '@/layouts';
import { Item } from '@/types'

import DeShopAbi from '@/abis/DeShop.json'

import { NoItemsView } from './NoItemsView';

export const ConnectedView = () => {
    const [items, setItems] = useState<Item[]>([])

    useContractRead({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'getAllItems',
        onSuccess(data: Item[]) {
            const filteredData = data.filter((item) => {
                return item.sold == false
            })

            setItems(filteredData.map((item) => {
                return {
                    ...item,
                    price: ethers.formatEther(item.price)
                }
            }))
        },
    })

    if (items.length == 0) {
        return (<NoItemsView />)
    }

    return (
        <MainLayout>
            <Box mt="3em">
                <Typography variant="h5">Explore</Typography>
                <CardItems items={items} />
            </Box>
        </MainLayout>
    )
}