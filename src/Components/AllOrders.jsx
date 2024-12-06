import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid2,
  Chip,
  CardContent,
  Card,
  CardActions
} from "@mui/material";
import getOrderDetailsById from "../netlify/getOrderDetailsById"; // API call to fetch order details
import getAllStatusCodes from "../netlify/getAllStatusCodes";
import getAllOrdersByUserId from "../netlify/getAllOrdersByUserId";
import getAllCartItemsByUserId from "../netlify/getAllCartItemsByUserId";
import { updateOrderStatus } from "../netlify/updateOrderStatus";
import { useCart } from "../CartContext";
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
const AllOrders = () => {
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const [orders, setOrders] = useState([]);
  const authToken = sessionStorage.getItem('authToken');
  const { updateCart } = useCart();  // Access cart context
  const [selectedOrderId, setSelectedOrderId] = useState(null);  // State to track the selected order
  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false);  // State to toggle view between All Orders and View Order

  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      
      updateCart(fetchedUserCart.updatedCartItems);  // Update the cart count and items in context
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedOrders = await getAllOrdersByUserId(userObj.id);
        setOrders(fetchedOrders.orders);  
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    if (authToken) {
      fetchUserCart();
      fetchProducts();
    }
  }, [authToken]);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderDetailsVisible(true);  // Show the View Order component
  };
  const handleCancelOrder = async (orderId) => {
    await updateOrderStatus(orderId,9);
    setIsOrderDetailsVisible(false);  // Show the View Order component

  };

  const handleBackToAllOrders = () => {
    setIsOrderDetailsVisible(false);  // Hide the View Order component and show All Orders
  };

 
  return (
    <Box p={4}>
      {isOrderDetailsVisible ? (
        <ViewOrder orderId={selectedOrderId} onBack={handleBackToAllOrders} />
      ) : (
        <>
          <Grid2 container spacing={3}>
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <Grid2 item xs={12} sm={6} md={4} key={order.order_id}>
                  <Card onClick={() => handleViewOrder(order.order_id)} sx={{ cursor: 'pointer' }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        {order.order_number}
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        Status: {order.order_status_codes.status_name}
                      </Typography>
                      <Divider/>
                      <Typography variant="body1" color="textSecondary">
                        Date: {new Date(order.order_date).toLocaleDateString()}
                      </Typography>
                      <Chip label={`Amount: ${order.total_amount.toFixed(2)} INR`} color="primary" sx={{ marginTop: 2 }} />
                    </CardContent>
                    <CardActions>
                    {order.order_status_codes.status_name !== 'Cancelled' && (
                        <Button size="small" color="error" 
                            onClick={() => handleCancelOrder(order.order_id)}
                            disabled={false}
                            >
                        Cancel Order
                        </Button>
                    )}
                    </CardActions>
                  </Card>
                </Grid2>
              ))
            ) : (
              <Typography>No orders available.</Typography>
            )}
          </Grid2>
        </>
      )}
    </Box>
  );
};
const ViewOrder = ({ orderId, onBack }) => {
    const [orderDetails, setOrderDetails] = useState({});
    const [statusCodes, setStatusCodes] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const response = await getOrderDetailsById(orderId);
          const responseStatusCodes = await getAllStatusCodes();
          console.log(JSON.stringify(response.order_data));
  
          setOrderDetails(response.order_data);
          setStatusCodes(responseStatusCodes.order_status_codes);
        } catch (error) {
          console.error("Error fetching order details:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchOrderDetails();
    }, [orderId]);
  
    if (loading) {
      return (
        <Box textAlign="center" mt={4}>
          <CircularProgress />
          <Typography mt={2}>Loading order details...</Typography>
        </Box>
      );
    }
  
    if (!orderDetails) {
      return (
        <Box textAlign="center" mt={4}>
          <Typography variant="h5" color="error">Order not found.</Typography>
        </Box>
      );
    }
  
    const {
      order_number,
      transaction_id,
      order_date,
      total_amount,
      delivery_addresses,
      order_items,
      status_code,
      order_status_history,
    } = orderDetails;
  
    const activeStatusIndex = statusCodes.findIndex(
      (status) => status.status_code === status_code
    );
  
    return (
      <Box p={4}>
        {/* Back Button */}
        <Box mt={3} textAlign="left">
          <Button variant="contained" color="primary" onClick={onBack}>
            Back to Orders
          </Button>
        </Box>
        <br/>
  
        {/* Order Information */}
        <Typography variant="h5" gutterBottom color="primary" fontWeight="bold">
          Order ID: {order_number}
        </Typography>
        
        <Paper elevation={6} sx={{ padding: 3, marginBottom: 3,backgroundColor: "#f0f0f0" }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            Items Ordered
          </Typography>
          <Grid2 container spacing={3}>
            {order_items.map((item, index) => (
                <Grid2 item xs={12} md={6} key={index}>
                <Paper elevation={3} sx={{ padding: 2, backgroundColor: "#fff" }}>
                    <ImageListItem>
                    <img
                        src={item.products.image_url || '/path/to/default-image.jpg'}
                        alt={item.products.name}
                        style={{
                        objectFit: 'contain',
                        maxWidth: '100%',
                        maxHeight: 200,
                        width: 'auto',
                        height: 'auto',
                        }}
                    />
                    <ImageListItemBar
                        title={item.products.name}
                        subtitle={`Price: ${item.products.price.toFixed(2)} INR`}
                        position="below"
                        style={{ background: 'rgba(0, 0, 0, 0.5)', color: '#fff' }}
                    />
                    </ImageListItem>
                    <Typography variant="h6" color="secondary" mt={1}>
                    Quantity: {item.quantity} | Total: {(item.products.price * item.quantity).toFixed(2)} INR
                    </Typography>
                </Paper>
                </Grid2>
            ))}
            </Grid2>
        </Paper>
        <Paper elevation={6} sx={{ padding: 3, marginBottom: 3, backgroundColor: "#f0f0f0" }}>
            <Grid2 container spacing={2}>
                {/* First Column */}
                <Grid2 item xs={12} md={4}>
                <List>
                    <ListItem>
                    <ListItemText
                        primary="Order Date"
                        secondary={<Typography color="secondary" variant="h6">{new Date(order_date).toLocaleDateString()}</Typography>}
                    />
                    </ListItem>
                    <Divider />
                    <ListItem>
                    <ListItemText
                        primary="Total Amount"
                        secondary={<Typography variant="h6" color="secondary">{total_amount.toFixed(2)} INR</Typography>}
                    />
                    </ListItem>
                </List>
                </Grid2>
                {/* Second Column */}
                <Grid2 item xs={12} md={4}>
                <List>
                    <ListItem>
                    <ListItemText
                        primary="Payment Mode"
                        secondary={<Typography variant="h6" color="secondary">UPI</Typography>}
                    />
                    </ListItem>
                    <Divider />
                    <ListItem>
                    <ListItemText
                        primary="Transaction ID"
                        secondary={<Typography variant="h6" color="secondary">{transaction_id}</Typography>}
                    />
                    </ListItem>
                </List>
                </Grid2>
                {/* Third Column - Address */}
                <Grid2 item xs={12} md={4}>
                <List>
                <Divider />
                    <ListItem>
                    <ListItemText
                        primary="Delivery Address"
                        secondary={
                        <Typography variant="h6" color="secondary">
                            {`${delivery_addresses.street_address}, ${delivery_addresses.cities.city_name}, ${delivery_addresses.states.state_name}, ${delivery_addresses.postal_code}`}
                        </Typography>
                        }
                    />
                    </ListItem>
                </List>
                </Grid2>
            </Grid2>
            </Paper>
        {/* Current Status Progress */}
        <Paper elevation={6} sx={{ padding: 3, marginBottom: 3, backgroundColor: "#f0f0f0" }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
            Order timeline
          </Typography>
          <Stepper alternativeLabel>
            {[...order_status_history, { 
                status_code, 
                order_status_codes: { status_name: orderDetails.order_status_codes.status_name }, 
                changed_at: new Date().toISOString(), // Optional: show "Now" for the current status 
                comments: "Current Status" // Label it as the current status 
            }].map((step, index) => (
                <Step key={step.status_code} completed={index <= activeStatusIndex}>
                <StepLabel
                    sx={{
                    color: index <= activeStatusIndex ? "green" : "grey",
                    fontWeight: index <= activeStatusIndex ? "bold" : "normal",
                    }}
                >
                    <div>
                    <span>{step.order_status_codes.status_name}</span>
                    <br />
                    <small style={{ color: "gray" }}>
                        {new Date(step.changed_at).toLocaleString()} {/* Format timestamp */}
                    </small>
                    </div>
                </StepLabel>
                </Step>
            ))}
            </Stepper>
        </Paper>
      </Box>
    );
  };
  
export { AllOrders, ViewOrder };
