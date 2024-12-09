import React, { useEffect, useState } from 'react';
import { Table, TableBody,Button,Box, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import getAllOrders from '../netlify/getAllOrders';
import { ViewOrder } from './AllOrders';
const ChangeOrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);  // State to track the selected order
  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false);  // State to toggle view between All Orders and View Order

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedOrders = await getAllOrders();
        setOrders(fetchedOrders);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsOrderDetailsVisible(true);  // Show the View Order component
  };

  const handleBackToAllOrders = () => {
    setIsOrderDetailsVisible(false);  // Hide the View Order component and show All Orders
  };
  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Box p={4}>
    {isOrderDetailsVisible ? (
        <div>
            <ViewOrder orderId={selectedOrderId} onBack={handleBackToAllOrders} isEditable={true} />
        </div>
      ) : (
    <div>
    <Typography variant="h4" gutterBottom>
      All Orders
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Order Number</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Txn ID</TableCell>
            <TableCell>Total Bill (INR)</TableCell>
            <TableCell>Date Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.orders.map((order) => (
            <TableRow key={order.order_id}>   
            <TableCell align="left">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleViewOrder(order.order_id)}
              >
                View
              </Button>      
              </TableCell>      
              <TableCell>{order.order_number}</TableCell>
              <TableCell>{order.users?.full_name}</TableCell>
              <TableCell>{order.order_status_codes.status_name}</TableCell>
              <TableCell>{order.users?.mobile_no}</TableCell>
              <TableCell>{order.transaction_id}</TableCell>
              <TableCell>{order.total_amount.toFixed(2)}</TableCell>
              <TableCell>{new Date(order.order_date).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          
   </div>
      )}
  </Box>
  );
};

export default ChangeOrderStatus;
