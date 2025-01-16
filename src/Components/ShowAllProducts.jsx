import * as React from 'react';
import Typography from '@mui/material/Typography';
import {  IconButton,Button, Rating, TextField } from '@mui/material';
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
import {FormLabel, CircularProgress} from '@mui/material';
const ShowAllProducts = () => {
  const user = sessionStorage.getItem("user");
  const userObj = JSON.parse(user);
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const authToken = sessionStorage.getItem("authToken");
  const [loading, setLoading] = React.useState(false);
  const {  cartItems, updateCart } = useCart();  // Access cart context
  const { wishlistItems, updateWishlist} = useWishlist();
  const[isBuyNow, setBuyNow] = React.useState(false);
  const[buyNowProduct, setBuyNowProduct] = React.useState(null);
  const navigate = useNavigate();

  

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts.products); // Store all products
        setFilteredProducts(fetchedProducts.products); // Set the same list for filtered view initially

      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);

      } finally {
        setLoading(false);
      }
    };

    if (authToken) {
      fetchProducts();
    }
  }, [authToken]);

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    // Filter products based on name
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
  };

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  if (loading) {
    return <CircularProgress />;
  }
  
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
        setBuyNow(true);
        setBuyNowProduct(updatedProd)
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



  return (
    <div>
     {isBuyNow ? (
        <CartStepper isBuyNow={true}  buyNowProduct={buyNowProduct}/>
      ) : (
      <Container fluid className="py-4">
        {/* Search Box */}
        <Row>
          <Col xs={12} className="mb-3">
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by product name..."
            />
          </Col>
        </Row>

        {/* Products Grid */}
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          <Row className="g-3">
            {filteredProducts.map((prod) => (
              <Col
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={prod.id}
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
                    <Typography variant="h6" className="card-title" style={{ fontWeight: "bold" }}>
                      {prod.name}
                    </Typography>
                    <Typography variant="body2"
                      className="text-muted"
                      style={{ marginBottom: "0.5rem" }}>
                      Category : {prod.categories.category_name}
                    </Typography>
                    {prod.categories.is_prescription_required ? (
                      <Typography variant="body2"
                        className="text-muted"
                        style={{ marginBottom: "0.5rem"}} >
                           <span style={{ color: "red"}}>
                              Needs Prescription
                            </span>
                      </Typography>):null
                    }
                    <Typography
                      variant="body2"
                      className="text-muted"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      Price: {prod.price} INR
                    </Typography>
                    <Rating
                      name={`product-rating-${prod.id}`}
                      value={calculateAverageRating(prod.reviews)}
                      precision={0.5}
                      readOnly
                    />
                    <Typography variant="caption" color="textSecondary">
                      ({prod.reviews?.length || 0} reviews)
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      style={{ marginTop: "10px" }}
                      onClick={() => 
                        isInWishList(prod) ? handleRemoveFromWishlist(prod) : handleAddToWishlist(prod)
                      }
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