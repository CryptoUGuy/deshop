'use client';

import { Button, Card, CardActionArea, CardActions, CardContent, CardMedia, Grid, Typography } from '@mui/material'
import { useContractWrite } from 'wagmi';

import { Item } from '@/types';
import { DESHOP_ADDRESS } from '@/constants';

import DeShopAbi from '@/abis/DeShop.json'
import { ethers } from 'ethers';

interface CardItemsProps {
    items: Item[]
    readonly?: boolean
}

export const CardItems = ({ items, readonly }: CardItemsProps) => {
    return (
        <Grid container spacing={3} mt="0.5em">
            {items.map((item, index) => {
                return (<Grid item={true} key={index + 1} xs={3}>
                    <CardItem item={item} readonly={readonly} />
                </Grid>)
            })}
        </Grid>
    )
}

interface CardItemProps {
    item: Item
    readonly?: boolean
}

const CardItem = ({ item, readonly }: CardItemProps) => {
    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'buyItem'
    })

    const handleBuy = async () => {
        write({
            args: [item.id],
            value: ethers.parseUnits(item.price, 'ether')
        })
    }

    return (
        <Card>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={item.imageUrl}
                    alt={item.name}
                />
                <CardContent>
                    <Typography variant="h6">{item.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        {item.description}
                    </Typography>
                    <Typography variant="body2">{item.price} ETH</Typography>
                </CardContent>
                <CardActions>
                    {!readonly && <Button variant="outlined" onClick={handleBuy}>Buy</Button>}
                </CardActions>
            </CardActionArea>
        </Card>
    )
}