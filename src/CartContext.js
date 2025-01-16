import React, { createContext, useState, useContext } from 'react';
import getAllCartItemsByUserId from './netlify/getAllCartItemsByUserId';
const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartContextCount, setCartCount] = useState(Number(sessionStorage.getItem('cartCount')) || 0);
  const [cartItems, setCartItems] = useState(JSON.parse(sessionStorage.getItem('product')) || []);
  
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  
  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      sessionStorage.setItem('product', JSON.stringify(fetchedUserCart.updatedCartItems));
      sessionStorage.setItem('cartCount', fetchedUserCart.updatedCartItems.length);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };
  
  const updateCart = (updatedCartItems) => {
    fetchUserCart();
    const newCartCount = updatedCartItems.length;
    setCartCount(newCartCount);
    setCartItems(updatedCartItems);

    sessionStorage.setItem('product', JSON.stringify(updatedCartItems));
    sessionStorage.setItem('cartCount', JSON.stringify(newCartCount));
  };

  return (
    <CartContext.Provider value={{ cartContextCount, cartItems, updateCart }}>
      {children}
    </CartContext.Provider>
  );
};
