import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Grid, IconButton } from '@mui/material';
import { RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

const steps = ['Review Cart', 'Shipping Details', 'Payment'];

const CartStepper = ({cartItemsProps}) => {
  console.log(cartItemsProps);
  const [activeStep, setActiveStep] = React.useState(0);
  const [cartItems, setCartItems] = React.useState(cartItemsProps); // Initial cart items for example

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => false;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleIncrease = (prod) => {
    const updatedCart = cartItems.map(item =>
      item.id === prod.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCart);
  };

  const handleDecrease = (prod) => {
    const updatedCart = cartItems.map(item =>
      item.id === prod.id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updatedCart);
  };

  const handleRemove = (prod) => {
    const updatedCart = cartItems.filter(item => item.id !== prod.id);
    setCartItems(updatedCart);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

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
            <Grid container spacing={3}>
              {cartItems.map((prod) => (
                <Grid item xs={12} sm={6} md={4} key={prod.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img
                      src={prod.products?.image_url || prod.image_url} // Will pick the first non-null image URL
                      alt={prod.products?.name || prod.name} // Will pick the first non-null name
                      style={{
                        maxWidth: '100%',
                        maxHeight: '200px',
                        objectFit: 'contain',
                      }}
                    />
                    <Typography variant="h6">{prod.products?.name ||prod.name}</Typography>
                    <Typography variant="body1">Price: {prod.price} INR</Typography>
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                      <Button variant="contained" color="primary" onClick={() => handleDecrease(prod)}>-</Button>
                      <Typography variant="h6" style={{ margin: '0 10px' }}>{prod.quantity}</Typography>
                      <Button variant="contained" color="primary" onClick={() => handleIncrease(prod)}>+</Button>
                    </div>
                    <div style={{ marginTop: '10px' }}>
                      <IconButton color="secondary" onClick={() => handleRemove(prod)}>
                        <RemoveShoppingCartIcon />
                      </IconButton>
                    </div>
                  </div>
                </Grid>
              ))}
            </Grid>
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
          <Button onClick={handleNext}>Next</Button>
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
