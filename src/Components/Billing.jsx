import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography,TableFooter, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import getAllProducts from '../netlify/getAllInventory';

const AddBillingForm = () => {
  // Initialize the state with default values
  const [bill, setBill] = useState({
    customerName: '',
    contactNumber: '',
    price: '', // Default empty string for price
    quantity: 0, // Default to 0 for quantity
    productId: '', // Default empty string for productId
  });
  
  const [inventory, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsResponse = await getAllProducts();
      setAllProducts(productsResponse.inventory);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const selectedProductObj = inventory.find((product) => product.id === selectedProduct);
    if (selectedProductObj) {
      setBill((prevBill) => ({
        ...prevBill,
        price: selectedProductObj.price || '', // Ensure price is always a string
      }));
    }
  }, [selectedProduct, inventory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;

  
    // Set the price to the selected product's price
    const selectedProductObj = inventory.find((products) => products.products.id === productId);
    if (selectedProductObj) {
      setSelectedProduct(productId);
      setBill((prevBill) => ({
        ...prevBill,
        price: selectedProductObj.products.price,

        productId: productId,  // Ensure the productId is correctly set
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(bill)
    if (!bill.customerName || !bill.contactNumber || !bill.productId || Number(bill.quantity) <= 0) {
      console.log('Form validation failed');
      return;
    }

    try {
      const selectedProductObj = inventory.find((product) => product.products.id === bill.productId);

      if (!selectedProductObj) {
        alert('Product not found');
        return;
      }

      // Check if the product already exists in purchased items
      const existingItem = purchasedItems.find((item) => item.id === bill.productId);

      if (selectedProductObj && Number(selectedProductObj.quantity) < Number(bill.quantity)) {
        alert('Not enough stock available');
        return;
      }

      let updatedItems = [];

      if (existingItem) {
        // If the product already exists, check if the stock can accommodate the new quantity
        const newQuantity = Number(existingItem.quantity) + Number(bill.quantity);
        if (Number(selectedProductObj.quantity) < newQuantity) {
          alert('Not enough stock available');
          return;
        }

        // Update quantity and total
        updatedItems = purchasedItems.map((item) =>
          item.id === bill.productId
            ? {
                ...item,
                quantity: newQuantity,
                total: newQuantity * Number(item.price),
              }
            : item
        );
      } else {
        // If the product does not exist, add it to the list
        if (Number(selectedProductObj.quantity) < Number(bill.quantity)) {
          alert('Not enough stock available');
          return;
        }

        // Add new item to the purchased items list
        updatedItems = [
          ...purchasedItems,
          {
            id: bill.productId,
            name: selectedProductObj.products.name,
            price: selectedProductObj.products.price,
            quantity: bill.quantity,
            total: Number(selectedProductObj.products.price) * Number(bill.quantity),
          },
        ];
      }

      setPurchasedItems(updatedItems);

      // Reset form
      setBill({
        customerName: bill.customerName,
        contactNumber: bill.contactNumber,
        price: '',
        quantity: 0,
        productId: '',
      });
      setSelectedProduct('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById("print-table").innerHTML; 
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };
  
  
  const handleRemoveItem = (itemId) => {
    const updatedItems = purchasedItems.filter((item) => item.id !== itemId);
    setPurchasedItems(updatedItems);
  };
  // Calculate total of all purchased items
  const calculateTotal = purchasedItems.reduce((acc, item) => acc + item.total, 0);
  const calculateSGST =  calculateTotal * 0.09;
  const calculateCGST = calculateTotal * 0.09;
  const grandTotal = Number(calculateTotal)+Number(calculateSGST.toFixed(2))+Number(calculateCGST.toFixed(2));
  const CurrentDate = new Date().toLocaleString();
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
        Customer Details
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Customer Name"
        name="customerName"
        value={bill.customerName || ''} // Ensure empty string if undefined
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Contact Number"
        name="contactNumber"
        value={bill.contactNumber || ''} // Ensure empty string if undefined
        onChange={handleChange}
        required
      />
      <Typography variant="h6" gutterBottom>
        Select Items
      </Typography>
      <FormControl sx={{ m: 1, width: 1200 }}>
        <InputLabel id="product-select-label">Product</InputLabel>
        <Select
          labelId="product-select-label"
          id="product-select"
          value={selectedProduct || ''} // Ensure empty string if undefined
          label="Product"
          onChange={handleProductChange}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {Array.isArray(inventory) && inventory.map((item) => (
            <MenuItem key={item.products.id} value={item.products.id}>
              {item.products.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="price"
        type="number"
        value={bill.price || ''} // Ensure empty string if undefined
        onChange={handleChange}
        required
        disabled
      />
      <TextField
        fullWidth
        margin="normal"
        label="Quantity"
        name="quantity"
        type="number"
        value={bill.quantity || 0} // Default to 0 if undefined
        onChange={handleChange}
        required
      />
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        Add To Bill
      </Button>
     

      {/* Display added items in a Grid2 layout */}
      {purchasedItems.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Billing Details
          </Typography>
          <TableContainer component={Paper} id="print-table">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell colSpan={2} align="left"><strong>Date & Time:</strong></TableCell>
                  <TableCell colSpan={3} align="left"><strong></strong>{CurrentDate}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="left"><strong>Name:</strong></TableCell>
                  <TableCell colSpan={3} align="left"><strong></strong>{bill.customerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="left"><strong>Contact Number:</strong></TableCell>
                  <TableCell colSpan={3} align="left"><strong></strong>{bill.contactNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left"></TableCell>
                  <TableCell>Product</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Price (INR)</TableCell>
                  <TableCell align="right">Total (INR)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {purchasedItems.map((item) => (
                  <TableRow key={item.id}>
                  <TableCell align="left">
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      -
                    </Button>
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{item.price}</TableCell>
                    <TableCell align="right">{item.total}</TableCell>
                 
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>Sub Total:</strong></TableCell>
                  <TableCell align="right"><strong>{calculateTotal.toFixed(2)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>SGST (9%):</strong></TableCell>
                  <TableCell align="right"><strong>{calculateSGST.toFixed(2)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>CGST (9%):</strong></TableCell>
                  <TableCell align="right"><strong>{calculateCGST.toFixed(2)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={4} align="right"><strong>Grand Total:</strong></TableCell>
                  <TableCell align="right"><strong>{grandTotal.toFixed(2)}</strong></TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
          <Button
        variant="contained"
        color="primary"
        onClick={handlePrint}
        sx={{ mt: 2 }}
      >
        Print Bill
      </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddBillingForm;
