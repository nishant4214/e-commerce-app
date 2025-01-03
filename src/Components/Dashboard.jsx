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
import getTotalTodaysSales from '../netlify/getTodaysSells';
import getProductCount from '../netlify/getProductCount';
import BillingList from './BillingList';
import UserList from './UserList';
import clearSession from '../netlify/clearSession';
import ChangeOrderStatus from './ChangeOrderStatus';
import getAllOrderCount from '../netlify/getAllOrderCount';
import PerformanceOverview from "./PerformanceOverview";
import ProfilePage from './Profile';

export default function Dashboard() {
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [productCount, setProductCount] = React.useState(0);
  const [inventoryCount, setInventoryCount] = React.useState(0);
  const [allOrderCount, setAllOrderCount] = React.useState(0);
  const [totalTodaysSales, setTotalTodaysSales] = React.useState(0);
  const authToken = sessionStorage.getItem('authToken');
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user);

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

  const handleAuth = async () => {

    await clearSession(userObj.id)
    setAuth(false);
    sessionStorage.clear();
    navigate('/Login'); // Redirect to home or login
  };
  React.useEffect(() => {
    const fetchCounts = async () => {
      const productCount = await getProductCount();
      const inventoryCount = await getInventoryCount();
      const allOrderCount = await getAllOrderCount();

      const totalTodaysSalesAmount = await getTotalTodaysSales();
      setProductCount(productCount);
      setInventoryCount(inventoryCount);
      setTotalTodaysSales(totalTodaysSalesAmount);
      setAllOrderCount(allOrderCount);

    };

    fetchCounts();
  }, []); // Empty dependency array so it runs once on mount
  const DrawerList = (
    <Box 
  sx={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%', // Make sure the Box takes full width on mobile
    '& > :not(style)': { m: 1, width: '75ch' }, // Default width
    '@media (max-width: 600px)': {
      '& > :not(style)': { width: '90%' }, // Change width for smaller screens (mobile)
    },
  }}
  role="presentation" 
  onClick={handleDrawerToggle}
>
      <List>
        {[
          { text: 'Dashboard', path: '/dashboard' },
          { text: 'Products', path: './add-product' },
          { text: 'Inventory', path: './manage-inventory' },
          { text: 'Billing', path: './billing' },
          { text: 'All Bills', path: './bill-list' },
          { text: 'All Users', path: './user-list' },
          { text: 'All Orders', path: './order-list' },

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
   const showDashboardCountCards = location.pathname === "/dashboard"; // Only show on dashboard route
   if (!authToken) {
    alert('Not authenticated');
    navigate('/'); // Redirect to the login page
    return null; // Do not render the Dashboard if not authenticated
  }

  const handleBoxClick = (route) => {
    // navigate("/dashboard/order-list"); // Redirect to the desired route
    navigate(route); // Navigate to the passed route

  };
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
              <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
                {userObj.username}
              </Typography>
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
              <MenuItem style={{ justifyContent: "center" }}>
                <Link to="./profile" style={{ textDecoration: "none", color: "inherit" }}>
                  Profile
                </Link>
              </MenuItem>
              <MenuItem onClick={handleAuth} style={{ justifyContent: "center" }}>
                Logout
              </MenuItem>
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
          <div className="dashboard">
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
              <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} onClick={() => handleBoxClick('/dashboard/add-product')}>
                <Typography variant="h6">Products</Typography>
                <Typography variant="h4">{productCount}</Typography>
              </Box>
              <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} onClick={() => handleBoxClick('/dashboard/manage-inventory')}>
                <Typography variant="h6">Inventory</Typography>
                <Typography variant="h4">{inventoryCount}</Typography>
              </Box>
              <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} onClick={() => handleBoxClick('/dashboard/bill-list')}>
                <Typography variant="h6">Today's Sales</Typography>
                <Typography variant="h4">{totalTodaysSales.toFixed(2)} INR</Typography>
              </Box>
              <Box sx={{ width: '30%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} onClick={() => handleBoxClick('/dashboard/order-list')}>
                <Typography variant="h6">Today's Orders</Typography>
                <Typography variant="h4">{allOrderCount}</Typography>
              </Box>
            </Box>
            <Box sx={{ width: '100%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} onClick={() => handleBoxClick('/dashboard/order-list')}>
              <PerformanceOverview />
            </Box>
          </div>
        )}
          <Routes>
              <Route path="/add-product" element={<AddProductForm />} />
              <Route path="/manage-inventory" element={<AddInventoryForm />} />
              <Route path="/billing" element={<AddBillingForm />} />
              <Route path="/bill-list" element={<BillingList />} />
              <Route path="/user-list" element={<UserList />} />
              <Route path="/order-list" element={<ChangeOrderStatus />} />
              <Route path="/profile" element={<ProfilePage />} />
          </Routes>
      </Box>
    </Box>
  );
}
