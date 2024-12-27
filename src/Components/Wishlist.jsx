import React, { useEffect } from "react";
import { Typography, IconButton, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import getAllWishListItemsByUserId from "../netlify/getAllWishListItemsByUserId";
import { removeFromWishlist } from "../netlify/removeFromWishlist";
import  addToCart  from "../netlify/addToCart";
import { useWishlist } from "../WishlistContext";
import { useCart } from "../CartContext";
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import CartStepper from "./CartStepper";

import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

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
const Wishlist = () => {
  const user = sessionStorage.getItem("user");
  const userObj = JSON.parse(user);
  const { wishlistItems, updateWishlist } = useWishlist();
  const { cartItems, updateCart } = useCart();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useDemoRouter('/customer-dashboard');
  const[isBuyNow, setBuyNow] = React.useState(false);
  const[buyNowProduct, setBuyNowProduct] = React.useState(null);
  const fetchUserWishlist = async () => {
    try {
      const fetchedUserWishlist = await getAllWishListItemsByUserId(userObj.id);
      updateWishlist(fetchedUserWishlist.updatedWishlistItems);
    } catch (error) {
      console.error("Error fetching user wishlist:", error);
    }
  };

  const handleRemoveFromWishlist = async (prod) => {
    const updatedWishlist = wishlistItems.filter(
      (item) => item.products.id !== prod.products.id
    );
    updateWishlist(updatedWishlist);
    await removeFromWishlist(prod.products.id, false);
    fetchUserWishlist();
    sessionStorage.setItem("Wishlist", JSON.stringify(updatedWishlist));
    sessionStorage.setItem("WishlistCount", JSON.stringify(updatedWishlist.length));
  };

  const handleMoveToCart = async (prod) => {
    try {
      if (!cartItems.some((item) => item.products.id === prod.products.id)) {
        await addToCart(userObj.id, prod.products.id, 1);
        const updatedCart = [...cartItems, { ...prod, quantity: 1 }];
        updateCart(updatedCart);
        await handleRemoveFromWishlist(prod);
      } else {
        alert("Product is already in your cart.");
      }
    } catch (error) {
      console.error("Error moving product to cart:", error);
    }
  };

  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      updateCart(fetchedUserCart.updatedCartItems);  // Update the cart count and items in context
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };

  useEffect(() => {
    fetchUserWishlist();
  }, []);

  const handleBuyNow = (product) => {
    // Optionally pass product data to the next page via state
    // setAnchorEl('/customer-dashboard/Cart');
    setBuyNow(true);
    setBuyNowProduct(product)
  };
  
  return (
    <div>
      {isBuyNow ? (
        <CartStepper isBuyNow={true}  buyNowProduct={buyNowProduct}/>
      ) : (
        <Container fluid className="py-4">
          {Array.isArray(wishlistItems) && wishlistItems.length > 0 ? (
            <Row className="g-3">
              {wishlistItems.map((prod) => (
                <Col xs={12} sm={6} md={4} lg={3} key={prod.products.id}>
                  <div className="card shadow-sm border-0 rounded">
                    <div className="image-container">
                      <img
                        src={prod.products.image_url || "/path/to/default-image.jpg"}
                        alt={prod.products.name}
                        className="card-img-top img-fluid"
                        onClick={() => navigate(`/product/${prod.products.id}`)}
                        style={{
                          objectFit: "cover",
                          maxHeight: "200px",
                          borderTopLeftRadius: "8px",
                          borderTopRightRadius: "8px",
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveFromWishlist(prod)}
                        style={{
                          position: "absolute",
                          top: 10,
                          right: 10,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "#fff",
                        }}
                        title="Remove from wishlist"
                      >
                        <FavoriteBorderIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleMoveToCart(prod)}
                        style={{
                          position: "absolute",
                          top: 50,
                          right: 10,
                          backgroundColor: "rgba(0, 0, 0, 0.6)",
                          color: "#fff",
                        }}
                        title="Add to cart"
                      >
                        <ShoppingCartIcon />
                      </IconButton>
                    </div>
  
                    <div className="card-body text-center">
                      <Typography
                        variant="h6"
                        className="card-title"
                        style={{ fontWeight: "bold" }}
                      >
                        {prod.products.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-muted"
                        style={{ marginBottom: "0.5rem" }}
                      >
                        Price: {prod.products.price} INR
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleBuyNow(prod)}
                      >
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          ) : (
            <Typography>No products added in wishlist.</Typography>
          )}
        </Container>
      )}
    </div>
  );
}
  

export default Wishlist;
