import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import getProductDetailsById from "../netlify/getProductDetailsById";
import { CartProvider, useCart } from '../CartContext';
import { removeFromCart } from '../netlify/removeFromCart';
import addToCart from '../netlify/addToCart';
import getAllCartItemsByUserId from '../netlify/getAllCartItemsByUserId';
import { updateCartItemCount } from '../netlify/updateCartItemCount';

const ProductDetailsPage = () => {
  const { id } = useParams(); // Get product ID from URL params
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { cartContextCount, cartItems, updateCart } = useCart();  // Access cart context
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user); 
  
  const fetchUserCart = async () => {
    try {
      const fetchedUserCart = await getAllCartItemsByUserId(userObj.id);
      const matchedCartItem = fetchedUserCart.updatedCartItems.find(
        (item) => item.product_id === parseInt(id, 10) // Ensure proper comparison
      );
      const quantity = matchedCartItem ? matchedCartItem.quantity : 1;
  
      setProduct((prev) => ({ ...prev, quantity }));
      updateCart(fetchedUserCart.updatedCartItems);
    } catch (error) {
      console.error("Error fetching user cart:", error);
    }
  };
  
  const handleAddToCart = async (prod) => {
    try {
      if (!cartItems.some(item => item.id === prod.id)) {
        const cartItemId = await addToCart(userObj.id, prod.id, 1);
        const updatedProd = { ...prod, cartItemId, quantity: 1 }; // Add default quantity
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
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductDetailsById(id); // Fetch product data based on ID
        setProduct({ ...data.product, quantity: data.product.quantity || 1 }); // Ensure quantity is at least 1
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

   
  const handleIncrease = (prod) => {
    const newQuantity = prod.quantity + 1;
    setProduct({ ...prod, quantity: newQuantity }); // Update product state

    const updatedCart = cartItems.map(item => 
      item.id === prod.id ? { ...item, quantity: item.quantity + 1, updatedItem: updateCartItemCount(item.cart_item_id, item.quantity + 1) } : item
    );
    updateCart(updatedCart);
    
  };
  
  const handleDecrease = (prod) => {
    if (prod.quantity > 1) 
    {
      const newQuantity = prod.quantity - 1;
      setProduct({ ...prod, quantity: newQuantity }); // Update product state

      const updatedCart = cartItems.map(item => 
        item.id === prod.id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1, updatedItem: updateCartItemCount(item.cart_item_id, item.quantity - 1) }
          : item
      );
      updateCart(updatedCart);
    }
  };
  
  React.useEffect(() => {
    fetchUserCart();
  }, []);
  const isInCart = (prod) => {
    return cartItems.some(item => item.id === prod.id);
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return product ? (
    <Container className="py-5">
      <Row>
        {/* Product Image */}
        <Col md={6} className="d-flex align-items-center">
          <Card.Img
            variant="top"
            src={product.image_url || "/images/default-product.jpg"}
            alt={product.name}
            className="img-fluid shadow-lg rounded"
          />
        </Col>

        {/* Product Information */}
        <Col md={6}>
          <Typography variant="h3" gutterBottom>
            {product.name}
          </Typography>
          <Typography variant="h5" style={{ color: "#007bff", fontWeight: "bold" }}>
            Price: ₹{product.price}
          </Typography>
          <Typography variant="body1" className="my-3">
            {product.description}
          </Typography>

          {/* Quantity Selector and Add to Cart */}
          <div className="d-flex align-items-center my-4">
            <label htmlFor="quantity" className="me-3">
              Quantity:
            </label>
            <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: "10px",
                    gap: "10px",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleDecrease(product)}
                    style={{ minWidth: "40px" }}
                  >
                    -
                  </Button>
                  <Typography variant="h6" style={{ margin: "0 10px" }}>
                  {product.quantity || 1}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleIncrease(product)}
                    style={{ minWidth: "40px" }}
                  >
                    +
                  </Button>
                </div>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() =>
                isInCart(product) ? handleRemoveFromCart(product) : handleAddToCart(product)
              }
            >
              {isInCart(product) ? "Remove from Cart" : "Add to Cart"}
            </Button>

          </div>

          {/* Additional Info */}
          <Typography variant="subtitle1" className="text-muted">
            Category: {product.category || "General"}
          </Typography>
          <Typography variant="subtitle1" className="text-muted">
            SKU: {product.sku || "N/A"}
          </Typography>
        </Col>
      </Row>

      {/* Additional Images or Recommendations */}
      <Row className="mt-5">
        <Col>
          <h4>Related Products</h4>
          <p>Coming Soon...</p>
        </Col>
      </Row>
    </Container>
  ) : (
    <div className="text-center mt-5">Product not found</div>
  );
};

export default ProductDetailsPage;
