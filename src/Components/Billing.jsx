import React, { useState, useEffect, useContext } from 'react';
import { Checkbox, TextField, Button, Grid2, Box, Typography,TableFooter, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import getAllProducts from '../netlify/getAllInventory';
import { updateInventoryByProductId } from '../netlify/updateInventoryByProductId';
import AuthContext from '../AuthContext';
import registerUser from '../netlify/signUp';
import addBill from '../netlify/addBill';
import html2canvas from 'html2canvas';
import getAllUsers from '../netlify/getAllUsers';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const AddBillingForm = () => {
  // Initialize the state with default values
  const [bill, setBill] = useState({
    customerName: '',
    contactNumber: '',
    email : '',
    price: '', // Default empty string for price
    quantity: 0, // Default to 0 for quantity
    productId: '', // Default empty string for productId
    grandTotal: 0,
    address : ''
  });
  const [isDisabled, setIsDisabled] = useState(false);  // Initially enabled

  const [inventory, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [existingCustomer, setExistingCustomers] = useState([]); 
  const [isChecked, setCheckBoxValue] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState({
    id:0,
    customerName: '',
    contactNumber: '',
    customerEmail:''
  });

  const authToken = sessionStorage.getItem('authToken');
  
  useEffect(() => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    const fetchProducts = async () => {
      const productsResponse = await getAllProducts();
      setAllProducts(productsResponse.inventory);
    };

    fetchProducts();
  }, [authToken]);

  useEffect(() => {

    if (!authToken) {
      throw new Error('No authentication token available');
    }
    const selectedProductObj = inventory.find((product) => product.id === selectedProduct);
    if (selectedProductObj) {
      setBill((prevBill) => ({
        ...prevBill,
        price: selectedProductObj.price || '', // Ensure price is always a string
      }));
    }
  }, [selectedProduct, inventory, authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBill({ ...bill, [name]: value });
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;

  
    // Set the price to the selected product's price
    const selectedProductObj = inventory.find((products) => products.products.id === productId);
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    if (selectedProductObj) {
      setSelectedProduct(productId);
      setBill((prevBill) => ({
        ...prevBill,
        price: selectedProductObj.products.price,

        productId: productId,  // Ensure the productId is correctly set
      }));
    }
  };
  
  const handleCustomerSelect = (event) => {
    const selectedId = event.target.value;
    const customer = existingCustomer.find(item => item.id === selectedId);

    // Update selectedCustomer with the full customer details
    if (customer) {
      setSelectedCustomer({
        id: customer.id,
        customerName: customer.full_name,
        contactNumber: customer.mobile_no,
        customerEmail: customer.email
      });
    } else {
      // If no customer is selected (e.g., the user selects the "None" option)
      setSelectedCustomer({
        id: 0,
        customerName: '',
        contactNumber: '',
        customerEmail: ''
      });
    }
  };
  const loadExistingCustomers = async(e) =>{
    try {
      setCheckBoxValue(e.target.checked); // Determine if the checkbox is checked
      if(isChecked){
        const fetchedUsers = await getAllUsers();
        const filteredUsers = fetchedUsers.users.filter(user => user.isactive === true && user.role_id === 2); // If unchecked, clear the existing customers
        setExistingCustomers(filteredUsers);
      }
    } catch (error) {
      alert('Customers not found');
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    console.log(selectedCustomer);
    // if (!bill.customerName || !bill.contactNumber || !bill.email || !bill.productId || Number(bill.quantity) <= 0) {
    if (!selectedCustomer.customerName || !selectedCustomer.customerName || !selectedCustomer.customerEmail || !bill.productId || Number(bill.quantity) <= 0) {
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
        address: bill.address,
        email: bill.email,
        price: '',
        quantity: 0,
        productId: '',
        grandTotal: 0,
      });
      setSelectedProduct('');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handlePrint = () => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    const printContent = document.getElementById("print-table").innerHTML; 
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
  };
  const handleSaveUser = async () => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    try {
      const userDetails = await registerUser(bill.email, '12345678',bill.customerName,bill.contactNumber, bill.address,2);
      if(userDetails){
        document.getElementById('existing-customer-checkbox').checked = true;
        setCheckBoxValue(true);
        const fetchedUsers = await getAllUsers();
        const filteredUsers = fetchedUsers.users.filter(user => user.isactive === true && user.role_id === 2); // If unchecked, clear the existing customers
        setExistingCustomers(filteredUsers);
      }
    } catch (error) {
      alert('Error while adding customer');
    }
   
  };
  const handleFinalizeBill = async () => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
  
    // const userDetails = await registerUser(bill.email, '12345678',bill.customerName,bill.contactNumber, bill.address,2);
    
    // Sequentially update inventory for each purchased item
    for (const item of purchasedItems) {
      try {

        const result = await updateInventoryByProductId(item.id, Number(item.quantity));
        if (result) {
          console.log(`Inventory updated for product ${item.productId}`);
        }
        document.getElementById('PrintBtn').style.display = 'block';
        document.getElementById('FinalizeBtn').style.display = 'none';
        document.getElementById('form-bill-details').style.display = 'none';
      } catch (error) {
        console.error(`Error updating inventory for product ${item.productId}:`, error);
      }
    }
    const table = document.getElementById('print-table');
    const user = JSON.parse(sessionStorage.getItem('user'));
    const total_amount = bill.grandTotal;
    // Use html2canvas to render the table as an image
    html2canvas(table).then(function(canvas) {
      // Convert canvas to Base64 image string
      const base64Image = canvas.toDataURL("image/png");
      addBill(selectedCustomer.id,user.id,base64Image, total_amount)
    });
    
  };
    
  const handleRemoveItem = (itemId) => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    const updatedItems = purchasedItems.filter((item) => item.id !== itemId);
    setPurchasedItems(updatedItems);
  };
  // Calculate total of all purchased items
  const calculateTotal = purchasedItems.reduce((acc, item) => acc + item.total, 0);
  const calculateSGST =  calculateTotal * 0.09;
  const calculateCGST = calculateTotal * 0.09;
  const grandTotal = Number(calculateTotal)+Number(calculateSGST.toFixed(2))+Number(calculateCGST.toFixed(2));
  bill.grandTotal = grandTotal;
  const CurrentDate = new Date().toLocaleString();

  if (!authToken) {
    return <p>You are not logged in.</p>;
  }
  return (
    
    <Box component="form" onSubmit={handleSubmit} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', // Make sure the Box takes full width on mobile
      '& > :not(style)': { m: 1, width: '75ch' }, // Default width
      '@media (max-width: 1200px)': {
        '& > :not(style)': { width: '90%' }, // Change width for smaller screens (mobile)
      },
    }}>
     <div id="form-bill-details">
     <Typography variant="h4" gutterBottom>
        Billing
      </Typography>
      <Typography variant="h6" gutterBottom align='left'>
        Customer Details
      </Typography>
      <Grid2 container spacing={2}>
        <Grid2 item xs={12} sm={12}>
          <FormGroup>
            <FormControlLabel control={<Checkbox id="existing-customer-checkbox" onChange={loadExistingCustomers}/>} 
            label="Existing Customer" 
            />
          </FormGroup>        
        </Grid2>
        </Grid2>
        {isChecked ? (
          <FormControl sx={{ m: 1, width: 600 }}>
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              id="customer-select"
              value={selectedCustomer.id || ''}  // Use the customer's ID as the value
              label="Customer"
              onChange={handleCustomerSelect}
              disabled={isDisabled}  // Disable Select when isDisabled is true
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {Array.isArray(existingCustomer) && existingCustomer.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.full_name} : {item.mobile_no}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              margin="normal"
              label="Customer Name"
              name="customerName"
              value={bill.customerName || ''}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              margin="normal"
              label="Contact Number"
              name="contactNumber"
              value={bill.contactNumber || '+91'}
              onChange={handleChange}
              required
            />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={bill.email || ''}
              onChange={handleChange}
            />
          </Grid2>
          <Grid2 item xs={12} sm={4}>
          <TextField
            fullWidth
            margin="normal"
            label="Address"
            name="address"
            value={bill.address || ''}
            onChange={handleChange}
            multiline  // Enable multi-line input
            rows={4}   // Default number of rows (lines) shown
            rowsMax={6} // Max number of rows (lines) before the textarea becomes scrollable
            variant="outlined"
          />
          </Grid2>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveUser}
            sx={{ mt: 2 }}
            style={{display:'block'}}
            id="SaveUserBtn"
          >
            Save User
          </Button>
        </Grid2>
        )}
        {isChecked ? (
          <div>
          <Typography variant="h6" gutterBottom align='left'>
            Select Items
          </Typography>
          
          <Grid2 container spacing={2}>
            <Grid2 item xs={12} sm={4}>
              <FormControl fullWidth margin="normal">
              <InputLabel id="product-select-label">Product</InputLabel>
              <Select
                labelId="product-select-label"
                id="product-select"
                value={selectedProduct || ''}
                label="Product"
                onChange={handleProductChange}
                size="large"  // Keeps the size small
                sx={{
                  width: '210px',  // Ensures the Select takes full width
                  height: '50px', // Sets a fixed height
                  fontSize: '0.875rem', // Optional: Controls font size
                  boxSizing: 'border-box', // Ensures padding and border are included in the width/height
                }}
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
            </Grid2>

            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Price Per Unit"
                name="price"
                type="number"
                value={bill.price || ''}
                onChange={handleChange}
                required
                disabled
              />
            </Grid2>

            <Grid2 item xs={12} sm={4}>
              <TextField
                fullWidth
                margin="normal"
                label="Quantity"
                name="quantity"
                type="number"
                value={bill.quantity || 0}
                onChange={handleChange}
                required
              />
            </Grid2>
          </Grid2>

          <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
            Add To Bill
          </Button>
          </div>
        ):(<div></div>)}
     
    </div>

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
                  <TableCell colSpan={3} align="left"><strong></strong>{selectedCustomer.customerName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} align="left"><strong>Contact Number:</strong></TableCell>
                  <TableCell colSpan={3} align="left"><strong></strong>{selectedCustomer.contactNumber}</TableCell>
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
            style={{display:'none'}}
            id="PrintBtn"
          >
            Print Bill
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinalizeBill}
            sx={{ mt: 2 }}
            style={{display:'block'}}
            id="FinalizeBtn"
          >
            Finalize
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddBillingForm;
