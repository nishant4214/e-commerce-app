import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid2, IconButton } from '@mui/material';
import { RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { updateCartItemCount } from '../netlify/updateCartItemCount';
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import { removeFromCart } from '../netlify/removeFromCart';
import { CartProvider, useCart } from '../CartContext';
import {   TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import getAllAddressByUserId from '../netlify/getAllAddressByUserId';
import addUserAddress from '../netlify/addUserAddress';
const steps = ['Review Cart', 'Shipping Details', 'Payment'];

const CartStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [cartTotal, setCartTotal] = React.useState(0);
  const [CGSTValue, setCGSTValue] = React.useState(0);
  const [SGSTValue, setSGSTValue] = React.useState(0);
  const [GrandTotal, setGrandTotal] = React.useState(0);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [shippingAddress, setShippingAddress] = React.useState("");
  const [addressList, setAddressList] = React.useState([]);
  const [newAddress, setNewAddress] = React.useState({
    streetAddress: '',
    cityId: 0,
    stateId: 0,
    postalCode: '',
    contactNumber:''
  });
  const [isAddingAddress, setIsAddingAddress] = React.useState(false); // To toggle between view and form


  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const { cartContextCount, cartItems, updateCart } = useCart();  // Access cartCount and cartItems from context

  const fetchAddresses = async () => {
    try {
      const delivery_addresses = getAllAddressByUserId(userObj.id)
      console.log(delivery_addresses);
      setAddressList(delivery_addresses); // Store the addresses
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => false;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleSelectAddress = (event) => {
    setShippingAddress(event.target.value);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // Add new address
  const handleAddNewAddress = async () => {
    if (!newAddress.streetAddress || !newAddress.cityId || !newAddress.stateId || !newAddress.postalCode || !newAddress.contactNumber) {
      alert("Please fill in all fields");
      return;
    }

    try {
      const address_id = addUserAddress(newAddress.streetAddress,newAddress.cityId,newAddress.stateId,newAddress.postalCode, newAddress.contactNumber);
      if(!address_id){
        fetchAddresses();
        setIsAddingAddress(false);  // Close the address form
        setNewAddress({ streetAddress: '', cityId: 0, stateId: 0, postalCode: '', contactNumber:'' }); // Clear form
      }
    } catch (error) {
      console.error("Error adding address:", error);
      alert("There was an error adding your address.");
    }
  };


  const calculateTotal = (cartItems) => {
    let total = 0;
    cartItems.forEach(item => {
      const itemPrice = item.products?.price || item.price;
      total += itemPrice * item.quantity;
    });
  
    // Calculate taxes
    const SGST = total * 0.09;
    const CGST = total * 0.09;
    const grandTotal = total + SGST + CGST;
  
    // Set stateId with computed values
    setCartTotal(total.toFixed(2));
    setSGSTValue(SGST.toFixed(2));
    setCGSTValue(CGST.toFixed(2));
    setGrandTotal(grandTotal.toFixed(2));
  };
  
  
  const fetchData = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      updateCart(fetchedUserCart.updatedCartItems); // Update cart in context
      calculateTotal(fetchedUserCart.updatedCartItems);  
      sessionStorage.setItem('product', JSON.stringify(fetchedUserCart.updatedCartItems));
      sessionStorage.setItem('cartCount', fetchedUserCart.updatedCartItems.length);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  
const handleIncrease = (prod) => {
  const updatedCart = cartItems.map(item => 
    item.id === prod.id ? { ...item, quantity: item.quantity + 1, updatedItem: updateCartItemCount(item.cart_item_id, item.quantity + 1) } : item
  );
  updateCart(updatedCart);
  calculateTotal(updatedCart);  // Recalculate total
};

const handleDecrease = (prod) => {
  const updatedCart = cartItems.map(item => 
    item.id === prod.id && item.quantity > 1
      ? { ...item, quantity: item.quantity - 1, updatedItem: updateCartItemCount(item.cart_item_id, item.quantity - 1) }
      : item
  );
  updateCart(updatedCart);
  calculateTotal(updatedCart);  // Recalculate total
};

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleRemoveFromCart = async (prod) => {
    const updatedCart = cartItems.filter(item => item.id !== prod.id);
    updateCart(updatedCart); // Update cart in context

    await removeFromCart(prod.id,false);
    fetchData();
    sessionStorage.setItem('product', JSON.stringify(updatedCart));
    sessionStorage.setItem('cartCount', updatedCart.length);

  };
  
  React.useEffect(() => {
    calculateTotal(cartItems);
  }, []);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          if (isStepOptional(index)) {
            labelProps.optional = <Typography variant="caption">Optional</Typography>;
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === 0 ? (
        // Cart step
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Your Cart</Typography>
          {cartItems.length === 0 ? (
            <Typography>No items in your cart.</Typography>
          ) : (
            <div>
            <Grid2 container spacing={3}>
            {cartItems.map((prod) => (
              <Grid2 item xs={12} sm={6} md={4} key={prod.id}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                    src={prod.products?.image_url || prod.image_url} // Will pick the first non-null image URL
                    alt={prod.products?.name || prod.name} // Will pick the first non-null name
                    style={{
                      width: '150px',  // Set fixed width
                      height: '150px', // Set fixed height
                      objectFit: 'cover', // Maintain aspect ratio but fill the container
                      borderRadius: '8px', // Optional: adds rounded corners to the image
                    }}
                  />
                  <Typography variant="h6">{prod.products?.name || prod.name}</Typography>
                  <Typography variant="body1">Price: {prod.products?.price || prod.price} INR</Typography>
                  <Typography variant="body1">Total: {((prod.products?.price || prod.price) * prod.quantity).toFixed(2)} INR</Typography>

                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                    <Button variant="contained" color="primary" onClick={() => handleDecrease(prod)}>-</Button>
                    <Typography variant="h6" style={{ margin: '0 10px' }}>{prod.quantity}</Typography>
                    <Button variant="contained" color="primary" onClick={() => handleIncrease(prod)}>+</Button>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    <IconButton color="secondary" onClick={() => handleRemoveFromCart(prod)}>
                      <RemoveShoppingCartIcon />
                    </IconButton>
                  </div>
                </div>
                    
              </Grid2>
            ))}
            </Grid2>
            <Grid2>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
              <Typography variant="body1">Total : {cartTotal} INR</Typography>
              <Typography variant="body1">CGST : {CGSTValue} INR</Typography>
              <Typography variant="body1">SGST : {SGSTValue} INR</Typography>
              <Typography variant="" style={{fontSize:'30px', marginRight:0}}>Grand Total :{GrandTotal} INR</Typography>
              </div>
            </Grid2>
            </div>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <Button onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Box>
      ) : activeStep === 1 ? (
        // Shipping step
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Shipping Details</Typography>
          {/* Shipping form or details go here */}
          {!isAddingAddress ? (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Select Address</InputLabel>
                <Select
                  value={shippingAddress}
                  onChange={handleSelectAddress}
                  label="Select Address"
                >
                  {addressList.map((address) => (
                    <MenuItem key={address.id} value={address.id}>
                      {address.streetAddress}, {address.cityId}, {address.stateId}, {address.postalCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={() => setIsAddingAddress(true)}>Add New Address</Button>
            </>
          ) : (
            <>
              <TextField
                label="Address Line 1"
                variant="outlined"
                name="streetAddress"
                value={newAddress.streetAddress}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="cityId"
                variant="outlined"
                name="cityId"
                value={newAddress.cityId}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="stateId"
                variant="outlined"
                name="stateId"
                value={newAddress.stateId}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="postalCode"
                variant="outlined"
                name="postalCode"
                value={newAddress.postalCode}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <TextField
                label="contactNumber"
                variant="outlined"
                name="contactNumber"
                value={newAddress.contactNumber}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
              />
              <Button onClick={handleAddNewAddress} variant="contained" color="primary">Add Address</Button>
              <Button onClick={() => setIsAddingAddress(false)} sx={{ ml: 2 }}>Cancel</Button>
            </>
          )}

          <Button onClick={handleAddNewAddress} variant="contained" sx={{ mb: 2 }}>
            Add New Address
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
            <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
            <Button onClick={handleNext}>Next</Button>
          </Box>
        </Box>
      ) : activeStep === 2 ? (
        // Payment step
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6">Payment</Typography>
          {/* Payment form or details go here */}
          <Button onClick={handleNext}>Finish</Button>
        </Box>
      ) : (
        // All steps completed
        <Box sx={{ mt: 2 }}>
          <Typography sx={{ mt: 2, mb: 1 }}>
            All steps completed - you're finished
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleReset}>Reset</Button>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CartStepper;
