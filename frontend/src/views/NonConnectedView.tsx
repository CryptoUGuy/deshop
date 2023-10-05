import { Box, Container, Typography } from "@mui/material"
import { ConnectButton } from "@rainbow-me/rainbowkit"

import { DESCRIPTION, PROJECT_NAME } from "@/constants"

export const NonConnectedView = () => {
    return (
        <Container style={{
            height: '100vh',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center'
        }} >
            <Box textAlign={"center"} display={"flex"} flexDirection={"column"} gap={"1rem"} width={"40%"} marginBottom={"10vh"}>
                <Typography variant='h1'>{PROJECT_NAME}</Typography>
                <Typography variant='h5'>
                    {DESCRIPTION}
                </Typography>
                <Box display={"flex"} justifyContent={"center"} gap={"1rem"}>
                    <ConnectButton />
                </Box>
            </Box>

        </Container>)
}
