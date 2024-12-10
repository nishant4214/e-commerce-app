import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Typography from '@mui/material/Typography';
import { IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clearSession from '../netlify/clearSession';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import CartStepper from './CartStepper';
import ShowAllProducts from './ShowAllProducts';
import { CartProvider, useCart } from '../CartContext';
import {AllOrders, ViewOrder} from './AllOrders';
import OrdersSummary from './OrdersSummary';
import Box from '@mui/material/Box';

const demoTheme = extendTheme({
  colorSchemes: { light: true, dark: true },
  colorSchemeSelector: 'class',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function useDemoRouter(initialPath) {
  const [pathname, setPathname] = React.useState(initialPath);

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  return router;
}
export default function CustomerDashboard(props) {
  
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const { cartContextCount, updateCart } = useCart();  // Use cart context

  const { window } = props;
  const [auth, setAuth] = useState(true);
  const authToken = sessionStorage.getItem('authToken');
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useDemoRouter('/customer-dashboard');
  const demoWindow = window ? window() : undefined;
  const navigate = useNavigate();
  
const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'customer-dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      segment: 'Products',
      title: 'Products',
      icon: <CategoryIcon />,
    },
    {
      segment: 'Cart',
      title: (
        <div>
          Cart
          {/* Show the count next to Cart */}
          <span style={{ marginLeft: 8, fontSize: '1.2rem', color: 'red' }}>
            {cartContextCount > 0 ? `(${cartContextCount})` : ''}
          </span>
        </div>
      ),
      icon: <ShoppingCartIcon />,
    },
    {
      segment: 'Orders',
      title: 'Orders',
      icon: <ShoppingBasketIcon />,
    },
    {
      segment: 'Logout',
      title: 'Logout',
      icon: <LogoutIcon />,
    }
  ];

  // Logout handler
  const handleAuth = async () => {
    await clearSession(userObj.id); // Clear session data
    setAuth(false); // Update auth state
    sessionStorage.clear();
    navigate('/'); // Redirect to login or home page
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (router.pathname === '/Logout') {
      handleAuth();
    }
  }, [router.pathname]);
  
  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
    >
      <DashboardLayout>
        {auth && (
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', alignContent:'right' }}>
            {/* User info menu */}
            
          </div>
        )}

        <PageContainer>
          {router.pathname === '/customer-dashboard' && (
            <div className="dashboard">
              <div style={{ textAlign: "center", margin: "20px" }}>
                <h1>🌟 Hello, {userObj.username}! 🌟</h1>
                <p>Your shopping adventure awaits! 🚀</p>
              </div>
              <div className="dashboard-header">
                <Box sx={{ width: '40%', padding: 2, border: '1px solid #ccc', borderRadius: 2 }} >
                  <OrdersSummary userId={userObj.id} />
                </Box>
              </div>
            </div>
          )}
          {router.pathname === '/Products' && (
            <ShowAllProducts/>
          )}
          {router.pathname === '/Cart' && (
           <CartStepper />
          )}
          {router.pathname === '/Orders' && (
           <AllOrders />
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
