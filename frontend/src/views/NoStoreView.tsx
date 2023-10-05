import { useState } from 'react';

import { Box, Typography, Button, TextField } from '@mui/material'
import { useContractWrite } from 'wagmi';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { MainLayout } from '@/layouts';
import { DESHOP_ADDRESS } from '@/constants';

import DeShopAbi from '@/abis/DeShop.json'
import { Modal } from '@/components';

const validationSchema = Yup.object({
    name: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    description: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required')
});

interface Values {
    name: string
    description: string
}

export const NoStoreView = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'createStore',
        onSuccess(data: any) {
            handleClose()
        }
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            description: ''
        },
        validationSchema: validationSchema,
        onSubmit: (values: Values) => {
            write({
                args: [values.name, values.description]
            });
        },
    });

    return (<MainLayout>
        <Box textAlign={"center"} display={"flex"} flexDirection={"column"} gap={"1rem"} height="80%" justifyContent="center">
            <Typography variant='h5'>
                You don't have any store yet.
            </Typography>
            <Box display={"flex"} justifyContent={"center"} gap={"1rem"}>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Create your first store
                </Button>
            </Box>
        </Box>
        <Modal open={open} handleClose={handleClose}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '1em' }}>
                Create Store
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ marginBottom: '1em' }}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                />
                <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    style={{ marginBottom: '1em' }}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                />
                <Button color="primary" variant="contained" fullWidth type="submit">
                    Create Store
                </Button>
            </form>
        </Modal>
    </MainLayout>)
}
