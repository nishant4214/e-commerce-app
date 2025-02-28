import * as React from 'react';
import { extendTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clearSession from '../netlify/clearSession';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import CartStepper from './CartStepper';
import ShowAllProducts from './ShowAllProducts';
import Wishlist from './Wishlist';
import { CartProvider, useCart } from '../CartContext';
import { WishlistProvider, useWishlist } from '../WishlistContext';
import {AllOrders, ViewOrder} from './AllOrders';
//import OrdersSummary from './OrdersSummary';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProfilePage from './Profile';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import getAllOrdersByUserId from "../netlify/getAllOrdersByUserId";
import OrderFeedback from './Rating';
import { Typography } from "@mui/material";
import { Row, Col, Container } from "react-bootstrap"; // Bootstrap grid system

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
  const { wishlistContextCount, updateWishlist } = useWishlist();  
  const [orders, setOrders] = useState([]);
  const [isReviewProducts, setIsReviewProducts]= useState(false);
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
      segment: 'Profile',
      title: 'Profile',
      icon: <AccountCircleIcon />,
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
          <span style={{ marginLeft: 10, fontSize: '1.2rem', color: 'red' }}>
                     
          </span>
          
        </div>
      ),
      icon: <div>{cartContextCount > 0 ?<Badge  badgeContent=  { `${cartContextCount}`} color="primary">
              <ShoppingCartIcon />
            </Badge>:<ShoppingCartIcon />}</div>
      ,
    },
    {
      segment: 'Orders',
      title: 'Orders',
      icon: <ShoppingBasketIcon />,
    },
    {
      segment: 'Wishlist',
      title: 'Wishlist',
      icon: <div>
        {wishlistContextCount > 0 ?
          <Badge  badgeContent=  { `${wishlistContextCount}`} color="primary">
            <FavoriteIcon />
              </Badge>:
            <FavoriteIcon />}
        </div>,
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
    navigate('/Login'); // Redirect to login or home page
  };
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    if (router.pathname === '/Logout') {
      handleAuth();
      
    }
  }, [router.pathname]);

  useEffect(() => {
    if (Array.isArray(orders)) {
      const hasPendingReviews = orders.some((order) =>
        order.order_items.some((product) => product.is_reviewed === false)
      );
      setIsReviewProducts(hasPendingReviews);
    }
  }, [orders]);
  

  const fetchProducts = async () => {
    try {
      const fetchedOrders = await getAllOrdersByUserId(userObj.id);
    // Filter orders by status code = 5
    const filteredOrders = fetchedOrders.orders.filter(
      (order) => order.order_status_codes && order.order_status_codes.status_code === 5
    );
    setOrders(filteredOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  useEffect(() => {
    if (authToken) {
      fetchProducts();
    }
  }, [authToken]);

  const handleFeedbackSubmit = (feedbackData) => {
    fetchProducts();
  };
  
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
          </div>
        )}

        <PageContainer>
        {router.pathname === '/customer-dashboard' && (
            <div className="dashboard">
              <div style={{ textAlign: "center", margin: "20px" }}>
                <h1>🌟 Hello, {userObj.username}! 🌟</h1>
                <p>Your shopping adventure awaits! 🚀</p>
              </div>
              {isReviewProducts ? (
                <div className="dashboard-header">
                  <Typography variant="h6" gutterBottom>
                    Rate Your Purchase
                  </Typography>
                </div>
              ) : (
                <div></div>
              )}

            <div className="dashboard-header">
            <Row className="g-3">
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) =>
                Array.isArray(order.order_items) && order.order_items.length > 0 ? (
                  order.order_items
                    .filter((product) => product.is_reviewed === false) // Filter items where is_reviewed is false
                    .map((product) => (
                      <Col xs={12} sm={6} md={4} lg={3} key={product.product_id}>
                        <div className="card shadow-sm border-0 rounded">
                          <OrderFeedback
                            orderId={order.order_id}
                            userId={userObj.id}
                            productData={product.products}
                            onSubmitFeedback={(feedbackData) => handleFeedbackSubmit(feedbackData)}
                          />
                        </div>
                      </Col>
                    ))
                ) : (
                  <Col xs={12} key={order.order_id}>
                    <div>No items in this order.</div>
                  </Col>
                )
              )
            ) : (
              <Col xs={12}>
                <div>No orders to display. Start shopping now! 🛒</div>
              </Col>
            )}
          </Row>

              </div>
            </div>
          )}

          {router.pathname === '/Profile' && (
            <ProfilePage/>
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
          {router.pathname === '/Wishlist' && (
           <Wishlist />
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
