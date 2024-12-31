import * as React from 'react';
import Typography from '@mui/material/Typography';
import {  IconButton,Button, Rating } from '@mui/material';
import { RemoveShoppingCart as RemoveShoppingCartIcon } from '@mui/icons-material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import { removeFromCart } from '../netlify/removeFromCart';
import addToCart from '../netlify/addToCart';
import getAllProducts from '../netlify/getAllProducts';
import {  useCart } from '../CartContext';
import { useNavigate } from 'react-router-dom';
import addToWishlist from '../netlify/addToWishlist';
import { Row, Col, Container } from "react-bootstrap"; // Bootstrap grid system
import { useWishlist } from '../WishlistContext';
import { removeFromWishlist } from '../netlify/removeFromWishlist';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import getAllWishListItemsByUserId from '../netlify/getAllWishListItemsByUserId';
import CartStepper from './CartStepper';
const ShowAllProducts = () => {
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  const [products, setProducts] = React.useState([]);
  const authToken = sessionStorage.getItem('authToken');
  const {  cartItems, updateCart } = useCart();  // Access cart context
  const { wishlistItems, updateWishlist} = useWishlist();
  const[isBuyNow, setBuyNow] = React.useState(false);
  const[buyNowProduct, setBuyNowProduct] = React.useState(null);
  const navigate = useNavigate();

  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
    updateCart(fetchedUserCart.updatedCartItems);  // Update the cart count and items in context

    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };
  const fetchUserWishlist = async () => {
    try {
      const fetchedUserWistlist = await getAllWishListItemsByUserId(userObj.id);
    updateWishlist(fetchedUserWistlist.updatedWishlistItems);  // Update the cart count and items in context

    } catch (error) {
      console.error("Error fetching user wishtlist:", error);
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
      fetchUserWishlist();
      fetchProducts();
    }
  }, [authToken]);
  

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

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

  const handleAddToWishlist = async (prod) => {
    try {
      if (!wishlistItems.some(item => item.id === prod.id)) {
        const wishlistItemId = await addToWishlist(userObj.id, prod.id);
        const updatedProd = { ...prod, wishlistItemId };
        const updatedWishlist = [...wishlistItems, updatedProd];
        sessionStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
        sessionStorage.setItem('WishlistCount', updatedWishlist.length);
        updateWishlist(updatedWishlist);  // Update the cart count and items in context
        fetchUserWishlist();

      }
    } catch (error) {
      console.error("Error adding product to wishlist:", error);
    }
  };

  
  const handleRemoveFromWishlist = async (prod) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== prod.id);
    updateWishlist(updatedWishlist);
    await removeFromWishlist(prod.id,false);
    fetchUserWishlist();
    sessionStorage.setItem('Wishlist', JSON.stringify(updatedWishlist));
    sessionStorage.setItem('WishlistCount', JSON.stringify(updatedWishlist.length));
  };
  

  const isInCart = (prod) => {
    return cartItems.some(item => item.id === prod.id);
  };

  const isInWishList = (prod) => {
    return wishlistItems.some(item => item.id === prod.id);
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

  const handleBuyNow = (product) => {
    // Optionally pass product data to the next page via state
    // setAnchorEl('/customer-dashboard/Cart');

    console.log(product);
    setBuyNow(true);
    setBuyNowProduct(product)
  };

  
  return (
    <div>
      {isBuyNow ? (
        <CartStepper isBuyNow={true}  buyNowProduct={buyNowProduct}/>
      ) : (
      <Container fluid className="py-4">
        {Array.isArray(products) && products.length > 0 ? (
          <Row className="g-3">
            {products.map((prod) => (
              <Col xs={12} sm={6} md={4} lg={3} key={prod.id}
                      style={{ display: "flex", justifyContent: "center" }}
                      >
                <div className="card shadow-sm border-0 rounded">
                  <div className="image-container">
                    <img
                      src={prod.image_url || "/path/to/default-image.jpg"}
                      alt={prod.name}
                      className="card-img-top img-fluid"
                      onClick={() => navigate(`/product/${prod.id}`)} 
                      style={{
                        objectFit: "cover",
                        maxHeight: "200px",
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    />
                    <IconButton
                      onClick={() =>
                        isInCart(prod) ? handleRemoveFromCart(prod) : handleAddToCart(prod)
                      }
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                      }}
                      title='Add to cart'
                    >
                      {isInCart(prod) ? <RemoveShoppingCartIcon /> : <ShoppingCartIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() =>
                        isInWishList(prod) ? handleRemoveFromWishlist(prod) : handleAddToWishlist(prod)
                      }
                      style={{
                        position: "absolute",
                        top: 50,
                        right: 10,
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                      }}

                      title='Add to wishlist'
                    >
                      {isInWishList(prod) ? <FavoriteBorderIcon /> : <FavoriteIcon />}
                    </IconButton>
                  </div>
                  
                  <div className="card-body text-center">
                    <Typography variant="h6" className="card-title" style={{fontWeight:'bold'}}>
                      {prod.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-muted"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      Price: {prod.price} INR
                    </Typography>
                    <Rating
                        name={`product-rating-${prod.id}`}
                        value={calculateAverageRating(prod.reviews)} // Calculate the average rating
                        precision={0.5}
                        readOnly
                      />
                      <Typography variant="caption" color="textSecondary">
                        ({prod.reviews?.length || 0})
                      </Typography>
                      <br/>

                    <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() =>handleBuyNow(prod)}
                      >
                        Buy Now
                      </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ) : (
          <Typography>No products available.</Typography>
        )}
      </Container>
      )}
    </div>
  );
};

export default ShowAllProducts;
