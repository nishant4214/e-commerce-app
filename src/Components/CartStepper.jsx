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
import getAllStates from '../netlify/getAllStates';
import getAllCityByStateId from '../netlify/getAllCityByStateId';
import PaymentComponent from './paymentGateway';
const steps = ['Review Cart', 'Shipping Details', 'Payment'];

const CartStepper = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [cartTotal, setCartTotal] = React.useState(0);
  const [CGSTValue, setCGSTValue] = React.useState(0);
  const [SGSTValue, setSGSTValue] = React.useState(0);
  const [GrandTotal, setGrandTotal] = React.useState(0);
  const [states, setStates] = React.useState([]);
  const [cities, setCities] = React.useState([]);
  const [shippingAddress, setShippingAddress] = React.useState(0);
  const [selectedState, setSelectedState] = React.useState(0);
  const [selectedCity, setSelectedCity] = React.useState(0);
  const [addressList, setAddressList] = React.useState([]);
  const [newAddress, setNewAddress] = React.useState({
    streetAddress: '',
    cityId: 0,
    stateId: 0,
    postalCode: '',
    contactNumber:''
  });


  const [errors, setErrors] = React.useState({
    streetAddress: '',
    cityId: '',
    stateId: '',
    postalCode: '',
    contactNumber: '',
  });

  const [isAddingAddress, setIsAddingAddress] = React.useState(false); // To toggle between view and form


  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const { cartContextCount, cartItems, updateCart } = useCart();  // Access cartCount and cartItems from context

  const fetchAddresses = async () => {
    try {
      const data = await getAllAddressByUserId(userObj.id)
      setAddressList(data.delivery_addresses); // Store the addresses
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  };

  
  const fetchStates = async () => {
    try {
      const allStates = await getAllStates();
      setStates(allStates.states)
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

    
  const fetchCities = async (stateId) => {
    try {
      const allCities = await getAllCityByStateId(stateId);
      setCities(allCities.cities);  // Ensure you're setting cities, not states
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };
  

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => false;

  const handleNext = () => {
    // Validation for Cart Step (Step 0)
    if (activeStep === 0) {
      if (cartItems.length === 0) {
        alert("Your cart is empty. Please add items to proceed.");
        return;
      }
    }
  
    // Validation for Shipping Step (Step 1)
    if (activeStep === 1) {
      if (shippingAddress === 0 && !isAddingAddress) {
        alert("Please select an address or add a new address.");
        return;
      }
      if ((isAddingAddress) && (!newAddress.streetAddress || !selectedCity || !selectedState || !newAddress.postalCode || !newAddress.contactNumber)) {
        alert("Please fill in all the address fields.");
        return;
      }
    }
  
    // Validation for Payment Step (Step 2)
    if (activeStep === 2) {
      // Add your payment validation here if needed
      // For example, ensure the user has entered payment details
    }
  
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };


  const handleSelectAddress = (event) => {
    const addressId = event.target.value;
    setShippingAddress(addressId);
  };
  
  const handleSelectState = async (event) => {
    const stateId = event.target.value;
    setSelectedState(stateId);
    await fetchCities(stateId);  // Pass the new stateId directly to fetchCities
  }

  const handleSelectCity = async (event) => {
    setSelectedCity(event.target.value);
    await fetchStates();
    setSelectedState(selectedState);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;
  
    // Validate Street Address
    if (!newAddress.streetAddress) {
      formErrors.streetAddress = 'Street Address is required';
      isValid = false;
    }
  
    // Validate State
    if (selectedState === 0) {
      formErrors.stateId = 'Please select a state';
      isValid = false;
    }
  
    // Validate City
    if (selectedCity === 0) {
      formErrors.cityId = 'Please select a city';
      isValid = false;
    }
  
    // Validate Postal Code (Assuming 6 digits for Indian postal codes)
    if (!/^\d{6}$/.test(newAddress.postalCode)) {
      formErrors.postalCode = 'Postal Code should be 6 digits';
      isValid = false;
    }
  
    // Validate Contact Number (Assuming a 10-digit Indian number)
    if (!/^\d{10}$/.test(newAddress.contactNumber)) {
      formErrors.contactNumber = 'Contact Number should be 10 digits';
      isValid = false;
    }
  
    setErrors(formErrors);
    return isValid;
  };
  
  // Add new address
  const handleAddNewAddress = async () => {
    // Check if the user and required fields are filled
    if (!userObj.id || !newAddress.streetAddress || !selectedCity || !selectedState || !newAddress.postalCode || !newAddress.contactNumber) {
      alert("Please fill in all fields");
      return;  // Early return if basic fields are missing
    }
  
    // Validate the form fields
    const isValid = validateForm();
    if (!isValid) {
      alert("Please fill valid data");
      return; // Prevent form submission if validation fails
    }
  
    try {
      // Assuming addUserAddress is a function that adds the address
      const address_id = await addUserAddress(userObj.id, newAddress.streetAddress, selectedCity, selectedState, newAddress.postalCode, newAddress.contactNumber);
      
      if (address_id) {
        fetchAddresses(); // Assuming fetchAddresses refreshes the list of addresses
        setIsAddingAddress(false);  // Close the address form
        setNewAddress({ streetAddress: '', cityId: 0, stateId: 0, postalCode: '', contactNumber: '' }); // Clear form
      } else {
        alert("Failed to add address.");
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
    fetchAddresses();

  }, []);

  React.useEffect(() => {
    if (isAddingAddress) {
      fetchStates();
    }
  }, [isAddingAddress]);
  

  return (
    <Box sx={{ width: '100%' }}>
    {cartItems.length === 0  ? null :(  
            <Grid2>
              <div style={{
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'flex-start',  // Align to the left
                padding: '16px',           // Add some padding for spacing
                backgroundColor: '#f5f5f5', // Light background color to make it stand out
                borderRadius: '8px',       // Round the corners
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                width: '100%',             // Ensure full width for responsiveness
                maxWidth: '500px',         // Limit the maximum width to avoid stretching
                marginTop: '20px',         // Add top margin for spacing from other content
              }}>
                <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  Total: <span style={{ fontSize: '18px', color: '#333' }}>{cartTotal} INR</span>
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  CGST: <span style={{ fontSize: '16px', color: '#00796b' }}>{CGSTValue} INR</span>
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                  SGST: <span style={{ fontSize: '16px', color: '#00796b' }}>{SGSTValue} INR</span>
                </Typography>
                <Typography variant="h5" style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '16px', color: '#e91e63' }}>
                  Grand Total: <span style={{ fontSize: '30px', color: '#e91e63' }}>{GrandTotal} INR</span>
                </Typography>
              </div>
            </Grid2>
        )}
  
          <br/>
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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "16px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s ease-in-out",
                }}
                className="cart-item"
              >
                <img
                  src={prod.products?.image_url || prod.image_url} // Will pick the first non-null image URL
                  alt={prod.products?.name || prod.name} // Will pick the first non-null name
                  style={{
                    width: "150px", // Fixed width
                    height: "150px", // Fixed height
                    objectFit: "cover", // Maintain aspect ratio but fill the container
                    borderRadius: "8px", // Adds rounded corners to the image
                  }}
                />
                <Typography
                  variant="h6"
                  style={{ marginTop: "10px", fontWeight: "bold", textAlign: "center" }}
                >
                  {prod.products?.name || prod.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  Price: {prod.products?.price || prod.price} INR
                </Typography>
                <Typography variant="body1" color="primary" style={{ fontWeight: "bold" }}>
                  Total: {((prod.products?.price || prod.price) * prod.quantity).toFixed(2)} INR
                </Typography>

                {/* Quantity controls */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDecrease(prod)}
                    style={{ minWidth: "40px" }}
                  >
                    -
                  </Button>
                  <Typography variant="h6" style={{ margin: "0 10px" }}>
                    {prod.quantity}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleIncrease(prod)}
                    style={{ minWidth: "40px" }}
                  >
                    +
                  </Button>
                </div>

                {/* Remove button */}
                <div style={{ marginTop: "10px" }}>
                  <IconButton
                    color="secondary"
                    onClick={() => handleRemoveFromCart(prod)}
                    style={{
                      border: "1px solid #f00",
                      padding: "8px",
                      borderRadius: "50%",
                      backgroundColor: "#ffeded",
                      transition: "background-color 0.3s",
                    }}
                  >
                    <RemoveShoppingCartIcon />
                  </IconButton>
                </div>
              </div>
            </Grid2>
          ))}
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
            <Button 
              onClick={handleNext}
              disabled={
                (activeStep === 0 && cartItems.length === 0) ||
                (activeStep === 1 && (shippingAddress === 0 && !isAddingAddress) || (isAddingAddress && (!newAddress.streetAddress || !selectedCity || !selectedState || !newAddress.postalCode || !newAddress.contactNumber))) ||
                (activeStep === 2 && false)  // Replace false with your payment validation condition
              }
            >
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
                    <MenuItem key={address.address_id} value={address.address_id}>
                      {address.street_address}, {address.cities.city_name}, {address.states.state_name}, {address.postalCode}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={() => setIsAddingAddress(true)}>Add New Address</Button>
              
            </>
          ) : (
            <>
            <TextField
              label="Street Address"
              variant="outlined"
              name="streetAddress"
              value={newAddress.streetAddress}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.streetAddress)}
              helperText={errors.streetAddress}
            />

            <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.stateId)}>
              <InputLabel>Select State</InputLabel>
              <Select
                value={selectedState}
                onChange={handleSelectState}
                label="Select State"
              >
                {/* Example states array */}
                {states.map((state) => (
                  <MenuItem key={state.state_id} value={state.state_id}>
                    {state.state_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.stateId && <Typography variant="caption" color="error">{errors.stateId}</Typography>}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.cityId)}>
              <InputLabel>Select City</InputLabel>
              <Select
                value={selectedCity}
                onChange={handleSelectCity}
                label="Select City"
              >
                {/* Example cities array */}
                {cities.map((city) => (
                  <MenuItem key={city.city_id} value={city.city_id}>
                    {city.city_name}
                  </MenuItem>
                ))}
              </Select>
              {errors.cityId && <Typography variant="caption" color="error">{errors.cityId}</Typography>}
            </FormControl>

            <TextField
              label="Postal Code"
              variant="outlined"
              name="postalCode"
              value={newAddress.postalCode}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.postalCode)}
              helperText={errors.postalCode}
            />

            <TextField
              label="Contact Number"
              variant="outlined"
              name="contactNumber"
              value={newAddress.contactNumber}
              onChange={handleInputChange}
              fullWidth
              sx={{ mb: 2 }}
              error={Boolean(errors.contactNumber)}
              helperText={errors.contactNumber}
            />
              <Button onClick={handleAddNewAddress} variant="contained" color="primary">Add Address</Button>
              <Button onClick={() => setIsAddingAddress(false)} sx={{ ml: 2 }}>Cancel</Button>
            </>
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
            {activeStep === steps.length - 1 ? "" : "Next"}
          </Button>

          </Box>
        </Box>
      ) : activeStep === 2 ? (
        // Payment step
        <Box sx={{ mt: 2 }}>
      
          {/* <Button onClick={handleNext}>Finish</Button> */}
          <PaymentComponent amountProps={GrandTotal} cgst={CGSTValue} sgst={SGSTValue} shippingAddress={shippingAddress} />
          <Button onClick={handleNext}>
            {activeStep === steps.length - 1 ? "" : "Next"}
          </Button>
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
