import * as React from 'react';

import Typography from '@mui/material/Typography';
import {  IconButton } from '@mui/material';
import { RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import { removeFromCart } from '../netlify/removeFromCart';
import addToCart from '../netlify/addToCart';
import getAllProducts from '../netlify/getAllProducts';
import List from '@mui/material/List';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import { CartProvider, useCart } from '../CartContext';
const ShowAllProducts = () => {
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const [products, setProducts] = React.useState([]);
  const authToken = sessionStorage.getItem('authToken');
  const { cartContextCount, cartItems, updateCart } = useCart();  // Access cart context

  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
    updateCart(fetchedUserCart.updatedCartItems);  // Update the cart count and items in context

    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  React.useEffect(() => {
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
      if (!cartItems.some(item => item.id === prod.id)) {
        const cartItemId = await addToCart(userObj.id, prod.id, 1);
        const updatedProd = { ...prod, cartItemId };
        const updatedCart = [...cartItems, updatedProd];
        sessionStorage.setItem('product', JSON.stringify(updatedCart));
        sessionStorage.setItem('cartCount', updatedCart.length);
        updateCart(updatedCart);  // Update the cart count and items in context
        fetchUserCart();
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };
  
  
  const handleRemoveFromCart = async (prod) => {
    const updatedCart = cartItems.filter(item => item.id !== prod.id);
    updateCart(updatedCart);
    await removeFromCart(prod.id,false);
    fetchUserCart();
    sessionStorage.setItem('product', JSON.stringify(updatedCart));
    sessionStorage.setItem('cartCount', JSON.stringify(updatedCart.length));
  };

  const isInCart = (prod) => {
    return cartItems.some(item => item.id === prod.id);
  };


  
React.useEffect(() => {           
    const fetchData = async () => {
        try {
        const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
        updateCart(fetchedUserCart.updatedCartItems);
        } catch (error) {
        console.error("Error fetching user cart:", error);
        }
    };
    fetchData();
}, []);

  
  return (
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
  );
};

export default ShowAllProducts;
