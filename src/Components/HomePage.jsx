import React from "react";
import getAllProducts from '../netlify/getAllProducts';
import Typography from '@mui/material/Typography';
import { Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../styles/heroSection.css";
const HomePage = () => {
  const [products, setProducts] = React.useState([]);
  
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getAllProducts();
        setProducts(fetchedProducts.products); // Assuming fetchedProducts is { products: [...] }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };  
      fetchProducts();
    
  }, []);
  

  const testimonials = [
    {
      name: "Jane Doe",
      text: "Great quality and fast delivery. Highly recommend!",
    },
    {
      name: "John Smith",
      text: "Amazing deals and excellent customer service!",
    },
  ];

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container">
      
          <Link to="/" className="navbar-brand">
            <strong>E-Commerce</strong>
          </Link>
       
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                    Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Login" className="nav-link">
                    Login
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div class="hero-section">
        <div class="hero-content">
            <h1>Welcome to E-Commerce</h1>
            <p>Your trusted shopping destination with amazing deals.</p>
            <Link to="/Login"  className="btn">
                Shop Now
            </Link>
        </div>
        </div>


      {/* Categories */}
      <div className="categories py-5 bg-light">
        <div className="container text-center">
          <h2>Products</h2>
          <Container fluid className="py-4">
            {Array.isArray(products) && products.length > 0 ? (
                <Row className="g-3">
                {products.map((prod) => (
                    <Col xs={12} sm={6} md={4} lg={3} key={prod.id}>
                    <div className="card shadow-sm border-0 rounded">
                        <div className="image-container">
                        <img
                            src={prod.image_url || "/path/to/default-image.jpg"}
                            alt={prod.name}
                            className="card-img-top img-fluid"
                            style={{
                            objectFit: "cover",
                            maxHeight: "200px",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                            }}
                        />
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
      </div>

      
      {/* Testimonials */}
      <div className="testimonials py-5 bg-light">
        <div className="container text-center">
          <h2>What Our Customers Say</h2>
          <div className="row">
            {testimonials.map((testimonial, index) => (
              <div className="col-md-6" key={index}>
                <div className="testimonial">
                  <blockquote className="blockquote">
                    <p>{testimonial.text}</p>
                    <footer className="blockquote-footer">{testimonial.name}</footer>
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Contact Section */}
      <div className="contact py-5 bg-light">
        
      </div>


      {/* Footer */}
      <footer className="footer bg-dark text-white py-4">
      <div className="container text-center" style={{ textAlign: "left", padding: "20px" }}>
        <div className="container">
            <h4 style={{ fontWeight: "bold" }}>Get in Touch</h4>
            <p>Email: <a href="mailto:support@ecommerce.com" style={{ color: "#007bff" }}>support@ecommerce.com</a></p>
            <p>Phone: <a href="tel:+18001234567" style={{ color: "#007bff" }}>+1 800 123 4567</a></p>
            <p>Address: XYZ ABC, Thane</p>
        </div>
          <p>&copy; {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
