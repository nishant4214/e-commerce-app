import React, { useEffect, useState } from 'react';
import { Table, TableBody,Button, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import getAllUsers from '../netlify/getAllUsers';
import changeUserStatus from '../netlify/changeUserStatus';
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const handleRemoveItem = (itemId, isactive) => {
    const fetchUsers = async () => {
      try {
        if(isactive){
          isactive = false;
        }else{
          isactive = true;
        } 
        await changeUserStatus(itemId,isactive);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  };


  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <div>
    <Typography variant="h4" gutterBottom>
      All Users
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Action</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>User Type</TableCell>
            <TableCell>Mobile Number</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Address</TableCell>
            <TableCell>Date Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.users.map((user) => (
            <TableRow key={user.id}>   
            <TableCell align="left">
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleRemoveItem(user.id, user.isactive)}
              >
                {user.isactive ? 
                  <p style={{ color: 'red' }}>Inactive</p> : 
                  <p style={{ color: 'green' }}>Active</p>
                }
              </Button>      
              </TableCell>      
              <TableCell>{user.full_name}</TableCell>
              <TableCell>
                {user.isactive ? 
                  <p style={{ color: 'green' }}>Active</p> : 
                  <p style={{ color: 'red' }}>Inactive</p>
                }
              </TableCell>
              <TableCell>{user.user_roles?.role}</TableCell>
              <TableCell>{user.mobile_no}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.address}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
          
   </div>
  );
};

export default UserList;
