import * as React from 'react';
import { extendTheme, styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import Grid from '@mui/material/Grid2';
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

// Skeleton loading component for placeholders
const Skeleton = styled('div')(({ theme, height }) => ({
  backgroundColor: theme.palette.action.hover,
  borderRadius: theme.shape.borderRadius,
  height,
  content: '" "',
}));

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

// Main Customer Dashboard Component
export default function CustomerDashboard(props) {
  const { window } = props;
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [auth, setAuth] = useState(true);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [selectedProductCount, setSelectedProductCount] = useState(0); // State for the product count

  const [anchorEl, setAnchorEl] = useState(null);
  const router = useDemoRouter('/customer-dashboard');
  const demoWindow = window ? window() : undefined;
  const authToken = sessionStorage.getItem('authToken');
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
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
      icon: <ShoppingCartIcon />,
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
      icon: <ShoppingCartIcon />,
    }
  ];

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Logout handler
  const handleAuth = async () => {
    await clearSession(userObj.id); // Clear session data
    setAuth(false); // Update auth state
    navigate('/'); // Redirect to login or home page
  };

  useEffect(() => {
    if (router.pathname === '/Logout') {
      handleAuth();
    }
  }, [router.pathname]);

  useEffect(() => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }

    const fetchProducts = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts.products);
    };

    fetchProducts();
  }, [authToken]);

  useEffect(() => {
    // Load the cart and product count from sessionStorage on initial load
    const storedProducts = sessionStorage.getItem('product');
    const storedCount = sessionStorage.getItem('selectedProductCount');

    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        if (Array.isArray(parsedProducts)) {
          setSelectedProducts(parsedProducts);
          setSelectedProductCount(parsedProducts.length); // Set the initial count
        }
      } catch (error) {
        console.error('Error parsing stored products:', error);
        setSelectedProducts([]);
        setSelectedProductCount(0);
      }
    } else {
      setSelectedProductCount(0); // No products in sessionStorage
    }
  }, [selectedProducts]);

  const handleAddToCart = (product) => {
    // Ensure that selectedProducts is always an array before updating
    const updatedCart = Array.isArray(selectedProducts) ? [...selectedProducts, product] : [product];
    
    setSelectedProducts(updatedCart);
    
    // Store the updated cart and product count in sessionStorage
    sessionStorage.setItem('product', JSON.stringify(updatedCart));
    sessionStorage.setItem('selectedProductCount', updatedCart.length);
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
                          src={prod.image_url || '/path/to/default-image.jpg'} // Fallback image if no image URL
                          alt={prod.name}
                          style={{
                            objectFit: 'contain', // Ensure the entire image is visible without distortion
                            maxWidth: '100%',     // Ensure image doesn't overflow the container
                            maxHeight: 200,       // Set a maximum height for the image
                            width: 'auto',        // Maintain the image's original aspect ratio
                            height: 'auto',       // Maintain the image's original aspect ratio
                          }}
                        />
                        <ImageListItemBar
                          title={prod.name}
                          subtitle={`Price: ${prod.price} INR`}
                          position="bottom"
                          style={{ background: 'rgba(0, 0, 0, 0.5)' }} // Optional: for better visibility
                        />
                        {/* Add to Cart Button */}
                        <IconButton
                          onClick={() => handleAddToCart(prod)} // Trigger function to handle adding to cart
                          style={{
                            position: 'absolute',
                            bottom: 60,
                            left: '90%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: transparent button background for visibility
                            color: '#fff',
                          }}
                        >
                          <ShoppingCartIcon />
                        </IconButton>
                      </ImageListItem>
                    ))}
                  </ImageList>
                ) : (
                  <Typography>No products available.</Typography> // Fallback message
                )}
              </List>
            </>
          )}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
