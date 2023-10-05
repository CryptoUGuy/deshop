import { ReactNode } from 'react';

import { Box, Container } from '@mui/material'

import NavBar from '@/components/NavBar';

type MainLayoutProps = {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <Box height="100%" display="flex" flexDirection="column">
            <NavBar />
            <Container style={{ flex: "1" }}>
                {children}
            </Container>
        </Box>
    )
}
