import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { ShoppingCart as ShoppingCartIcon, RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import getAllProducts from '../netlify/getAllProducts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clearSession from '../netlify/clearSession';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';
import addToCart from '../netlify/addToCart';
import { removeFromCart } from '../netlify/removeFromCart';
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import CartStepper from './CartStepper';
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

  const { window } = props;
  const [products, setProducts] = useState([]);
  const [auth, setAuth] = useState(true);
  const authToken = sessionStorage.getItem('authToken');
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const [cart, setCart] = useState([]);
  const [selectedProductCount, setSelectedProductCount] = useState(sessionStorage.getItem('cartCount')); // State for the product count
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useDemoRouter('/customer-dashboard');
  const demoWindow = window ? window() : undefined;
  const navigate = useNavigate();

  
// Navigation config (adjust as needed)
const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'dashboard',
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
            {selectedProductCount > 0 ? `(${selectedProductCount})` : ''}
          </span>
        </div>
      ),
      icon: <ShoppingCartIcon />,
    },
    {
      segment: 'Logout',
      title: 'Logout',
      icon: <LogoutIcon />,
    }
  ];
  
const fetchData = async () => {
  try {
    const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
    setCart(fetchedUserCart.updatedCartItems); // Access the cart_items array
    setSelectedProductCount(fetchedUserCart.updatedCartItems.length)
   // console.log(fetchedUserCart.cart_items)
  } catch (error) {
    console.error("Error fetching user cart:", error);
  }
};

  useEffect(() => {
    fetchData();
  }, []);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Logout handler
  const handleAuth = async () => {
    await clearSession(userObj.id); // Clear session data
    setAuth(false); // Update auth state
    sessionStorage.clear();
    navigate('/'); // Redirect to login or home page
  };

  useEffect(() => {
    if (router.pathname === '/Logout') {
      handleAuth();
    }
  }, [router.pathname]);
  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      setCart(fetchedUserCart.updatedCartItems); // Access the cart_items array
      setSelectedProductCount(fetchedUserCart.updatedCartItems.length);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts.products); // Assuming fetchedProducts is { products: [...] }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };  
    if (authToken) {
      fetchUserCart();
      fetchProducts();
    }
  }, [authToken]);


  const handleAddToCart = async (prod) => {
    try {
      if (!cart.some(item => item.id === prod.id)) {
        const cartItemId = await addToCart(userObj.id, prod.id, 1);
        const updatedProd = { ...prod, cartItemId };
        const updatedCart = [...cart, updatedProd];
        setSelectedProductCount(updatedCart.length);
        sessionStorage.setItem('product', JSON.stringify(updatedCart));
        sessionStorage.setItem('cartCount', JSON.stringify(updatedCart.length));
        setCart(updatedCart);  // Update the cart state with the new cart
       // console.log(updatedCart)
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  
  
  const handleRemoveFromCart = async (prod) => {
    const updatedCart = cart.filter(item => item.id !== prod.id);
    setCart(updatedCart);
    setSelectedProductCount(updatedCart.length);
    await removeFromCart(prod.id,false);
    fetchUserCart();
    sessionStorage.setItem('product', JSON.stringify(updatedCart));
    sessionStorage.setItem('cartCount', JSON.stringify(updatedCart.length));
  };
  
  const isInCart = (prod) => {
    return cart.some(item => item.id === prod.id);
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
            {/* User info menu */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
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
              <Typography variant="h7" component="div" sx={{ flexGrow: 1 }} >
                {userObj.username} {/* Display the logged-in user's name */}
              </Typography>
            </div>
          </div>
        )}

        <PageContainer>
          {router.pathname === '/Products' && (
            <>
              <List>
              {Array.isArray(products) && products.length > 0 ? (
                <ImageList cols={3} rowHeight={200} gap={16}>
                  {products.map((prod) => (
                    <ImageListItem key={prod.id}>
                      <img
                        src={prod.image_url || '/path/to/default-image.jpg'}
                        alt={prod.name}
                        style={{
                          objectFit: 'contain',
                          maxWidth: '100%',
                          maxHeight: 200,
                          width: 'auto',
                          height: 'auto',
                        }}
                      />
                      <ImageListItemBar
                        title={prod.name}
                        subtitle={`Price: ${prod.price} INR`}
                        position="bottom"
                        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
                      />
                      {/* Add to Cart / Remove from Cart Button */}
                      <IconButton
                        onClick={() => isInCart(prod) ? handleRemoveFromCart(prod) : handleAddToCart(prod)}
                        style={{
                          position: 'absolute',
                          bottom: 60,
                          left: '90%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(0, 0, 0, 0.5)',
                          color: '#fff',
                        }}
                      >
                        {isInCart(prod) ? <RemoveShoppingCartIcon /> : <ShoppingCartIcon />}
                      </IconButton>
                    </ImageListItem>
                  ))}
                </ImageList>
                ) : (
                  <Typography>No products available.</Typography>
                )}
              </List>
            </>
          )}
          {router.pathname === '/Cart' && (
           <CartStepper />
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
