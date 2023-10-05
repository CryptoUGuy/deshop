import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography'
import { ConnectButton } from '@rainbow-me/rainbowkit';

import { PROJECT_NAME } from '@/constants';

export default function NavBar() {
    return (
        <Box display="flex" justifyContent="space-between" alignItems="center" padding="1em 10em" mt="3em">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}><Typography variant='h5'>{PROJECT_NAME}</Typography></Link>
            <Box display="flex" alignItems="center" gap="3em">
                <Link href="/my-purchases" style={{ textDecoration: 'none', color: 'inherit' }}><Typography variant='h6'>My Purchases</Typography></Link>
                <Link href="/my-store" style={{ textDecoration: 'none', color: 'inherit' }}><Typography variant='h6'>My Store</Typography></Link>
                <ConnectButton />
            </Box>
        </Box>
    );
}
