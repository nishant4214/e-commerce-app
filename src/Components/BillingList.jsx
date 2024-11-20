import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import getAllBills from '../netlify/getAllBills';
import { Visibility as VisibilityIcon } from '@mui/icons-material';

const BillingList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false); // Modal open state
  const [selectedImage, setSelectedImage] = useState(null); // Selected base64 image


  useEffect(() => {
    const fetchBills = async () => {
      try {
        const fetchedBills = await getAllBills();
        setBills(fetchedBills.bills);
      } catch (err) {
        setError('Failed to load bills');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);
  const handleClickOpen = (bill) => {
    setSelectedImage(bill.bill_document); // Set the base64 image data
    setOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null); // Clear the selected image when closing
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Bill ID</TableCell>
            <TableCell>Customer Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Date Time</TableCell>
            <TableCell>Bill</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bills.map((bill) => (
            <TableRow key={bill.id}>
              <TableCell>{bill.id}</TableCell>
              <TableCell>{bill.users?.full_name}</TableCell>
              <TableCell>{bill.users?.email}</TableCell>
              <TableCell>{bill.created_at}</TableCell>
              <TableCell>
                  <IconButton onClick={() => handleClickOpen(bill)} color="primary">
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
     {/* Modal to display the bill image */}
     <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
     <DialogTitle>Bill Image</DialogTitle>
     <DialogContent>
       {selectedImage ? (
         <img src={selectedImage} alt="Bill Document" style={{ width: '100%', height: 'auto' }} />
       ) : (
         <Typography>No image available</Typography>
       )}
     </DialogContent>
     <DialogActions>
       <button onClick={handleClose} color="primary">
         Close
       </button>
     </DialogActions>
   </Dialog>
   </div>
  );
};

export default BillingList;
