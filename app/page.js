'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase'; // Ensure this is the correct import path
import { Box, Typography, Modal, Stack, TextField, Button, Divider} from '@mui/material';
import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import useHiddenElements from './animations/useHiddenElements';
import './page.css'




export default function Home() {

  useHiddenElements();

  
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data()
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItem = async (item, quantity) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity: currentQuantity } = docSnap.data();
      await setDoc(docRef, { quantity: currentQuantity + Number(quantity) });
    } else {
      await setDoc(docRef, { quantity: Number(quantity) });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setItemQuantity('');
    setOpen(false);
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


  const theme = {
    palette: {
      primary: {
        main: '#3F51B5', // Indigo
        contrastText: '#FFFFFF',
      },
      secondary: {
        main: '#FF4081', // Pink
      },
      background: {
        default: '#F5F5F5', // Light grey
        paper: '#FFFFFF',
      },
      text: {
        primary: '#212121', // Very dark grey, almost black
        secondary: '#757575', // Medium grey
      },
    },
    typography: {
      fontFamily: "'Nunito Sans', 'Helvetica', 'Arial', sans-serif",
      h4: {
        fontWeight: 500,
      },
      h6: {
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 4,
    },
  };

  return (
    <Box
    width="100vw"
    height="100vh"
    display="flex"
    justifyContent="center"
    alignItems="center"
    flexDirection="column"
    gap={3}
    bgcolor={theme.palette.background.default}
    p={4}
  >
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        position="absolute"
        top="50%"
        left="50%"
        sx={{ transform: 'translate(-50%, -50%)', borderRadius: theme.shape.borderRadius }}
        width={400}
        bgcolor={theme.palette.background.paper}
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <Typography className='hidden' variant="h5" color={theme.palette.text.primary} fontWeight={600}>Add Item</Typography>
        <Stack width="100%" direction="column" spacing={3}>
          <TextField
            variant="outlined"
            fullWidth
            label="Item Name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="Quantity"
            type="number"
            value={itemQuantity}
            onChange={(e) => setItemQuantity(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } } }}
          />
          <Button
            variant="contained"
            onClick={() => {
              addItem(itemName, itemQuantity);
              handleClose();
            }}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              '&:hover': { bgcolor: theme.palette.primary.dark },
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Add Item
          </Button>
        </Stack>
      </Box>
    </Modal>

    <Typography variant="h4"  color={theme.palette.primary.main} mb={3}>Inventory Manager</Typography>

    <TextField
      variant="outlined"
      placeholder="Search Items"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        mb: 3,
        width: '300px',
        bgcolor: theme.palette.background.paper,
        '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main } }
      }}
    />

    <Button
      variant="contained"
      onClick={handleOpen}
      sx={{
        mb: 3,
        bgcolor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': { bgcolor: theme.palette.primary.dark },
        textTransform: 'none',
        fontWeight: 600,
      }}
    >
      Add New Item
    </Button>

    <Box
      border={`1px solid ${theme.palette.primary.main}`}
      borderRadius={theme.shape.borderRadius}
      overflow="hidden"
      bgcolor={theme.palette.background.paper}
      boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)"
      width="100%"
      maxWidth="800px"
    >
      <Box
        width="100%"
        bgcolor={theme.palette.primary.main}
        display="flex"
        alignItems="center"
        justifyContent="center"
        py={3}
      >
        <Typography variant="h5" color={theme.palette.primary.contrastText} fontWeight={600}>
          Inventory Items
        </Typography>
      </Box>

      <Stack width="100%" maxHeight="400px" spacing={2} overflow="auto" p={3}>
        {filteredInventory.map(({ name, quantity }) => (
          <Box
            key={name}
            width="100%"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            bgcolor={theme.palette.background.default}
            padding={2}
            borderRadius={theme.shape.borderRadius}
            boxShadow="0 2px 4px rgba(0, 0, 0, 0.05)"
            sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' } }}
          >
            <Typography variant="h6" color={theme.palette.text.primary}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography variant="h6" color={theme.palette.text.secondary}>
              {quantity}
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                onClick={() => addItem(name, 1)}
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  color: theme.palette.primary.contrastText,
                  '&:hover': { bgcolor: theme.palette.secondary.dark },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Add
              </Button>
              <Button
                variant="outlined"
                onClick={() => removeItem(name)}
                sx={{
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: 'rgba(255, 107, 53, 0.1)' },
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Remove
              </Button>
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  </Box>

  );
}