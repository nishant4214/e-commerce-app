import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import getAllProducts from '../netlify/getAllProducts';
import getAllInventory from '../netlify/getAllInventory';
import SaveInventory from '../netlify/Inventory';
import { updateInventory } from '../netlify/updateInventory';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const AddInventoryForm = () => {
  const [product, setProduct] = useState({
    description: '',
    quantity: '',
  });
  const [products, setAllProducts] = useState([]);
  const [inventory, setAllInventory] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [inventoryId, setInventoryId] = useState(null);

  useEffect(() => {
    const fetchProductsAndInventory = async () => {
      const productsResponse = await getAllProducts();
      const inventoryResponse = await getAllInventory();
      setAllProducts(productsResponse.products);
      setAllInventory(inventoryResponse); // Assuming inventoryResponse is already an array
    };

    fetchProductsAndInventory();
  }, [inventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inventoryId) {
      await updateInventory(inventoryId, product.description, product.quantity);
    } else {
      await SaveInventory(selectedProduct, product.description, product.quantity);
    }
    resetForm();
  };

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  const handleInventorySelect = (item) => {
    setSelectedProduct(item.product_id);
    setProduct({
      description: item.description,
      quantity: item.quantity,
    });
    setInventoryId(item.id);
  };

  const resetForm = () => {
    setProduct({ description: '', quantity: '' });
    setSelectedProduct('');
    setInventoryId(null);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', // Make sure the Box takes full width on mobile
      '& > :not(style)': { m: 1, width: '75ch' }, // Default width
      '@media (max-width: 600px)': {
        '& > :not(style)': { width: '90%' }, // Change width for smaller screens (mobile)
      },
    }}>
      <Typography variant="h6" gutterBottom>
        Manage Inventory
      </Typography>
      <FormControl sx={{ m: 1, width: 1200 }}>
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={selectedProduct}
          label="Product"
          onChange={handleProductChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.isArray(products) && products.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
        required
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        name="quantity"
        type="number"
        value={product.quantity}
        onChange={handleChange}
        required
      />

      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        {inventoryId ? 'Update' : 'Save'}
      </Button>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Existing Inventory
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(inventory.inventory) && inventory.inventory.map((item) => (
              <TableRow key={item.id} hover onClick={() => handleInventorySelect(item)}>
                <TableCell>{item.products.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  <Button variant="outlined" onClick={() => handleInventorySelect(item)}>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AddInventoryForm;
