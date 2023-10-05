import { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material'
import { useContractRead, useContractWrite } from 'wagmi'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ethers } from 'ethers';

import { MainLayout } from '@/layouts';
import { Item, Store } from '@/types';
import { CardItems, Modal } from '@/components';
import { DESHOP_ADDRESS } from '@/constants';

import DeShopAbi from '@/abis/DeShop.json'

interface StoreViewProps {
    store: Store
}

const HARDCODED_IMAGE_URL = "https://picsum.photos/200/300"

const validationSchema = Yup.object({
    name: Yup.string()
        .max(30, 'Must be 30 characters or less')
        .required('Required'),
    description: Yup.string()
        .max(50, 'Must be 50 characters or less')
        .required('Required'),
    price: Yup.number()
        .min(0, 'Must be positive')
        .required('Required')
});

interface Values {
    name: string
    description: string
    price: number
}

export const StoreView = ({ store }: StoreViewProps) => {
    const [items, setItems] = useState<Item[]>([])
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { refetch } = useContractRead({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'getItemsByStore',
        args: [store.id],
        onSuccess(data: Item[]) {
            setItems(data.map((item) => {
                return {
                    ...item,
                    price: ethers.formatEther(item.price)
                }
            }))
        },
    })

    const { data, isLoading, isSuccess, write } = useContractWrite({
        address: DESHOP_ADDRESS,
        abi: DeShopAbi,
        functionName: 'createItem',
        onSuccess(data: any) {
            handleClose()
            refetch()
        }
    })

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            price: 0
        },
        validationSchema: validationSchema,
        onSubmit: (values: Values) => {
            write({
                args: [store.id, values.name, values.description, HARDCODED_IMAGE_URL, ethers.parseUnits(values.price.toString())]
            });
        },
    });

    return (
        <MainLayout>
            <Box mt="3em" textAlign="center">
                <Typography variant="h4">{store.name}</Typography>
                <Typography variant="h5">{store.description}</Typography>
                <Typography variant="h6">Earnings: {store.earnings} ETH</Typography>
                <Box textAlign="right">
                    <Button variant="contained" onClick={handleOpen}>Create Item</Button>
                </Box>
                <CardItems items={items} readonly={true} />
            </Box>

            <Modal open={open} handleClose={handleClose}>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: '1em' }}>
                    Create Item
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
                    <TextField
                        fullWidth
                        id="price"
                        name="price"
                        label="Price"
                        value={formik.values.price}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        style={{ marginBottom: '1em' }}
                        error={formik.touched.price && Boolean(formik.errors.price)}
                        helperText={formik.touched.price && formik.errors.price}
                    />
                    <Button color="primary" variant="contained" fullWidth type="submit">
                        Create Item
                    </Button>
                </form>
            </Modal>
        </MainLayout>
    )
}
