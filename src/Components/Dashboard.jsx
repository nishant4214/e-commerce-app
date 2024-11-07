import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { Link, useNavigate,useLocation  } from 'react-router-dom';
import {  Routes, Route } from 'react-router-dom';
import AddProductForm from './AddProductForm';
import AddInventoryForm from './Inventory';
import AddBillingForm from './Billing';
import getInventoryCount from '../netlify/getInventoryCount';
import getProductCount from '../netlify/getProductCount';


export default function Dashboard() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [productCount, setProductCount] = React.useState(0);
  const [inventoryCount, setInventoryCount] = React.useState(0);
  const navigate = useNavigate();
  const location = useLocation();  // Hook to get the current route

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAuth = () => {
    setAuth(false);
    navigate('/'); // Redirect to home or login
  };
  React.useEffect(() => {
    const fetchCounts = async () => {
      const productCount = await getProductCount();
      const inventoryCount = await getInventoryCount();
      setProductCount(productCount);
      setInventoryCount(inventoryCount);
    };

    fetchCounts();
  }, []); // Empty dependency array so it runs once on mount
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={handleDrawerToggle}>
      <List>
        {[
          { text: 'Products', path: './add-product' }, // Correct path
          { text: 'Inventory', path: './manage-inventory' },
          { text: 'Billing', path: './billing' },
          { text: 'Reports', path: './reports' },
        ].map((item, index) => (
          <ListItem key={item.text} disablePadding>
            <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const showDashboardCountCards = location.pathname === "/Dashboard"; // Only show on dashboard route

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            E-Commerce
          </Typography>
          {auth && (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                <MenuItem onClick={handleAuth}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer open={open} onClose={handleDrawerToggle}>
        {DrawerList}
      </Drawer>
      {/* Routing for the Dashboard Content */}
      <Box component="main" sx={{ p: 3 }}>
        {/* Dashboard Cards for Counts */}
        {/* Conditionally render dashboard count cards */}
        {showDashboardCountCards && (
          <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
            <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h4">{productCount}</Typography>
            </Box>
            <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">Inventory</Typography>
              <Typography variant="h4">{inventoryCount}</Typography>
            </Box>
          </Box>
        )}
          <Routes>
              <Route path="/add-product" element={<AddProductForm />} />
              <Route path="/manage-inventory" element={<AddInventoryForm />} />
              <Route path="/billing" element={<AddBillingForm />} />
              {/* Other routes can be added here */}
          </Routes>
      </Box>
    </Box>
  );
}
