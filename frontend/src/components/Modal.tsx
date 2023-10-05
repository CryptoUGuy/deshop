import { Box, Modal as MaterialUIModal } from '@mui/material'

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

interface ModalProps {
    open: boolean;
    handleClose: () => void;
    children: React.ReactNode;
}

export const Modal = ({ open, handleClose, children }: ModalProps) => {
    return (
        <MaterialUIModal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
                {children}
            </Box>
        </MaterialUIModal>
    )
}