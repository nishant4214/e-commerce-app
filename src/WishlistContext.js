// CartContext.js
import React, { createContext, useState, useContext } from 'react';
import getAllWishListItemsByUserId from './netlify/getAllWishListItemsByUserId';
// Create the Context
const WishlistContext = createContext();

export const useWishlist = () => {
  return useContext(WishlistContext);
};

export const WishlistProvider = ({ children }) => {
  const [wishlistContextCount, setWishlistCount] = useState(Number(sessionStorage.getItem('WishlistCount')) || 0);
  const [wishlistItems, setWishlistItems] = useState(JSON.parse(sessionStorage.getItem('Wishlist')) || []);
  
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  
  const fetchUserWishlist = async () => {
    try {
      const fetchedUserWishlist = await getAllWishListItemsByUserId(userObj.id);
        
      sessionStorage.setItem('Wishlist', JSON.stringify(fetchedUserWishlist.updatedWishlistItems));
      sessionStorage.setItem('WishlistCount', fetchedUserWishlist.updatedWishlistItems.length);

    } catch (error) {
      console.error("Error fetching user wishlist:", error);
    }
  };
  const updateWishlist = (updatedWishlistItems) => {
    fetchUserWishlist();
    const newCartCount = updatedWishlistItems.length;
    setWishlistCount(newCartCount);
    setWishlistItems(updatedWishlistItems);

    sessionStorage.setItem('Wishlist', JSON.stringify(updatedWishlistItems));
    sessionStorage.setItem('WishlistCount', JSON.stringify(newCartCount));
  };

  return (
    <WishlistContext.Provider value={{ wishlistContextCount, wishlistItems, updateWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
