import { Box, Typography } from '@mui/material'

import { MainLayout } from '@/layouts';
import { Item } from '@/types';
import { CardItems } from '@/components';

interface PurchasesViewProps {
    items: Item[]
}

export const PurchasesView = ({ items }: PurchasesViewProps) => {
    return (
        <MainLayout>
            <Box mt="3em">
                <Typography variant="h5">Your purchases</Typography>
                <CardItems items={items} readonly={true} />
            </Box>
        </MainLayout>
    )
}