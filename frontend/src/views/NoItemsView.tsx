import { MainLayout } from '@/layouts';
import { Box, Typography } from '@mui/material'

export const NoItemsView = () => {
    return (<MainLayout>
        <Box textAlign={"center"} display={"flex"} flexDirection={"column"} gap={"1rem"} height="80%" justifyContent="center">
            <Typography variant='h5'>
                No items found
            </Typography>
        </Box>
    </MainLayout>)
}