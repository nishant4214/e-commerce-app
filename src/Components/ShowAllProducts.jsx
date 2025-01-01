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
const ShowAllProducts = () => {
  const user = sessionStorage.getItem("user");
  const userObj = JSON.parse(user);
  const [products, setProducts] = React.useState([]);
  const [filteredProducts, setFilteredProducts] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const authToken = sessionStorage.getItem("authToken");
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        console.log(fetchedProducts.products)
        setProducts(fetchedProducts.products); // Store all products
        setFilteredProducts(fetchedProducts.products); // Set the same list for filtered view initially
      } catch (error) {
        console.error("Error fetching products:", error);
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

  return (
    <div>
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
                      onClick={() => console.log(`Buy Now: ${prod.name}`)}
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
    </div>
  );
};

export default ShowAllProducts;