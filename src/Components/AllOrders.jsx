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
  CardActions,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
  Link

} from "@mui/material";

import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import getOrderDetailsById from "../netlify/getOrderDetailsById"; // API call to fetch order details
import getAllStatusCodes from "../netlify/getAllStatusCodes";
import getAllOrdersByUserId from "../netlify/getAllOrdersByUserId";
import getAllCartItemsByUserId from "../netlify/getAllCartItemsByUserId";
import { updateOrderStatus } from "../netlify/updateOrderStatus";
import { useCart } from "../CartContext";
const AllOrders = () => {
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user);
  const [orders, setOrders] = useState([]);
  const authToken = sessionStorage.getItem('authToken');
  const { updateCart } = useCart(); // Access cart context
  const [selectedOrderId, setSelectedOrderId] = useState(null); // State to track the selected order
  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false); // State to toggle view
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false); // State for cancel order dialog
  const [selectedReason, setSelectedReason] = useState(""); // Selected cancel reason
  const [otherReason, setOtherReason] = useState(""); // Other reason text

  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      updateCart(fetchedUserCart.updatedCartItems); // Update cart count and items in context
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
    setIsOrderDetailsVisible(true); // Show the View Order component
  };

  const handleCancelOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsCancelDialogOpen(true); // Open the cancel order dialog
  };

  const handleCancelSubmit = async () => {
    const finalReason =
      selectedReason === "Other" ? otherReason : selectedReason;

    if (!finalReason) {
      alert("Please provide a reason for cancellation.");
      return;
    }

    try {
      await updateOrderStatus(selectedOrderId, 9, finalReason); // Call the API with reason
      alert("Order cancelled successfully.");
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.order_id === selectedOrderId
            ? { ...order, order_status_codes: { status_name: "Cancelled" } }
            : order
        )
      );
    } catch (error) {
      console.error("Error cancelling order:", error);
      alert("Failed to cancel the order.");
    } finally {
      setIsCancelDialogOpen(false);
      setSelectedReason("");
      setOtherReason("");
    }
  };

  const handleBackToAllOrders = () => {
    setIsOrderDetailsVisible(false); // Hide the View Order component
  };

  return (
    <Box p={4}>
      {isOrderDetailsVisible ? (
        <ViewOrder
          orderId={selectedOrderId}
          onBack={handleBackToAllOrders}
          isEditable={false}
        />
      ) : (
        <>
        <Grid2 container spacing={3}>
          {Array.isArray(orders) && orders.length > 0 ? (
            orders.map((order) => (
              <Grid2 item xs={12} sm={6} md={4} key={order.order_id}>
                <Card
                  sx={{
                    cursor: "pointer",
                    height: "300px", // Fixed height for consistent card sizes
                    width: "300px",

                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent onClick={() => handleViewOrder(order.order_id)}>
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {order.order_number}
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      Status: {order.order_status_codes.status_name}
                    </Typography>
                    <Divider />
                    <Typography variant="body1" color="textSecondary">
                      Date: {new Date(order.order_date).toLocaleDateString()}
                    </Typography>
                    <Chip
                      label={`Amount: ${order.total_amount.toFixed(2)} INR`}
                      color="primary"
                      sx={{ marginTop: 2 }}
                    />
                    <Box
                      sx={{
                        marginTop: 2,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center", // Center-align the images
                      }}
                    >
                      {order.order_items.map((item, index) => (
                        <img
                          key={index}
                          src={item.products.image_url || "https://via.placeholder.com/100"}
                          alt={item.products.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "5px",
                            objectFit: "cover",
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                  <CardActions>
                    {order.status_code < 4 && (
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleCancelOrder(order.order_id)}
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

          <Dialog
            open={isCancelDialogOpen}
            onClose={() => setIsCancelDialogOpen(false)}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogContent>
              <Typography gutterBottom>
                Please select a reason for cancelling your order:
              </Typography>
              <RadioGroup
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {[
                  "Changed my mind",
                  "Found a better price",
                  "Order placed by mistake",
                  "Product not required anymore",
                  "Other",
                ].map((reason) => (
                  <FormControlLabel
                    key={reason}
                    value={reason}
                    control={<Radio />}
                    label={reason}
                  />
                ))}
              </RadioGroup>
              {selectedReason === "Other" && (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  value={otherReason}
                  onChange={(e) => setOtherReason(e.target.value)}
                  placeholder="Please specify your reason"
                  sx={{ marginTop: 2 }}
                />
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCancelDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCancelSubmit}
                variant="contained"
                color="error"
              >
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

const ViewOrder = ({ orderId, onBack, isEditable }) => {
    const [orderDetails, setOrderDetails] = useState({});
    const [statusCodes, setStatusCodes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState(0);
    const [comments, setComments] = useState('');


    useEffect(() => {
      const fetchOrderDetails = async () => {
        try {
          const response = await getOrderDetailsById(orderId);
          const responseStatusCodes = await getAllStatusCodes();
  
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
      sgst,
      cgst,
      delivery_addresses,
      order_items,
      status_code,
      order_status_history,
      gcp_file_id
    } = orderDetails;
    
    const activeStatusIndex = statusCodes.findIndex(
      (status) => status.status_code === status_code
    );

    const handleStatusChange = (event) => {
      setNewStatus(event.target.value);
    };
  
    const handleSaveStatus = async () => {
      if (newStatus) {
        try {
          const response = await updateOrderStatus(orderId,newStatus,comments);
          if (response && 'error' in response) {
            alert(response.error);
          } else {
            // Handle unexpected cases (e.g., response doesn't have data or error)
            alert("Status updated successfully!");
            
          }

        } catch (error) {
          console.error("Error updating status:", error);
        }
      } else {
        alert("Please select a status.");
      }
    };

    const handleDownload = async (event) => {
      event.preventDefault(); // Prevent navigation
  
      try {
        const response = await fetch(`https://minio-file-ops.onrender.com/download/${gcp_file_id}`, {
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error("Failed to download the file.");
        }
  
        // Extract filename from Content-Disposition header
        const contentDisposition = response.headers.get("Content-Disposition");
        const filename = contentDisposition
          ? contentDisposition
              .split("filename=")[1]
              .replace(/["']/g, "") // Remove quotes if present
          : `Prescription_${order_number}`;
  
        // Convert response to blob
        const blob = await response.blob();
  
        // Create an object URL and initiate the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename; // Use the extracted filename or fallback
        document.body.appendChild(a);
        a.click();
  
        // Clean up
        a.remove();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error during download:", error);
        alert("Failed to download the prescription. Please try again.");
      }
    };
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
          
        <TableContainer component={Paper} sx={{ marginTop: 2, borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>#</TableCell>
                <TableCell align="left" sx={{ fontWeight: "bold" }}>Product Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Price (₹)</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Quantity</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Total (₹)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {order_items.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="left">{item.products.name}</TableCell>
                  <TableCell align="center">{item.products.price.toFixed(2)}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="center">{(item.products.price * item.quantity).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow hover>   
                  <TableCell colSpan={4} align="right">SGST :</TableCell>
                  <TableCell align="center">{sgst.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow hover>   
                  <TableCell colSpan={4} align="right">CGST :</TableCell>
                  <TableCell align="center">{cgst.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow hover>   
                  <TableCell colSpan={4} align="right">Grand Total :</TableCell>
                  <TableCell align="center">{total_amount.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

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
                <Grid2 item xs={12} md={4}>
                  <List>
                  <Divider />
                  {gcp_file_id && gcp_file_id.trim() !== "" && gcp_file_id.trim() !== 'NULL' ? (
                    <Link to="#" onClick={handleDownload}>
                      Download Prescription
                    </Link>
                  ) : null}
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
                comments: orderDetails.comments// Label it as the current status 
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
                    <br />
                    <small style={{ color: "gray" }}>
                        {step.comments} {/* Format timestamp */}
                    </small>
                    </div>
                </StepLabel>
                </Step>
            ))}
            </Stepper>
        </Paper>
        {isEditable? (
          <Paper elevation={6} sx={{ padding: 3, marginBottom: 3, backgroundColor: "#f0f0f0" }}>
          <FormControl fullWidth>
            <InputLabel id="status-select-label">Change Status</InputLabel>
            <Select
              labelId="status-select-label"
              value={newStatus}
              onChange={handleStatusChange}
              displayEmpty
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value="" disabled>
                Select a new status
              </MenuItem>
              {statusCodes.map((status) => (
                <MenuItem key={status.status_code} value={status.status_code}>
                  {status.status_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
              fullWidth
              margin="normal"
              label="Comments"
              name="comments"
              onChange={(e) => setComments(e.target.value)}
              required
            />
          <Button variant="contained" color="primary" onClick={handleSaveStatus}>
            Update Order
          </Button>
        </Paper>
        ):null}
      
      </Box>
    );
  };
  

export { AllOrders, ViewOrder };
