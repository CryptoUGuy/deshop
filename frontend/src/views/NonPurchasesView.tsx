import { Box, Typography } from '@mui/material'

import { MainLayout } from '@/layouts';

export const NonPurchasesView = () => {
    return (
        <MainLayout>
            <Box textAlign={"center"} display={"flex"} flexDirection={"column"} gap={"1rem"} height="80%" justifyContent="center">
                <Typography variant='h5'>
                    You don't have any purchases.
                </Typography>
            </Box>
        </MainLayout>
    )
}