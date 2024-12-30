import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText, ImageList, ImageListItemBar, ImageListItem, IconButton } from '@mui/material';
import getAllProducts from '../netlify/getAllProducts';
import addProduct from '../netlify/addProduct';
import updateProduct from '../netlify/updateProduct';
import EditIcon from "@mui/icons-material/Edit";

const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [products, setProducts] = useState([]);
  const authToken = sessionStorage.getItem('authToken');
  

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const resetForm = () => {
    setProduct({
      id:0,
      name: '',
      description: '',
      price: '',
      image_url: '',
    });


  };

  const handleSubmit = async (e) => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }

    e.preventDefault();
    if (product.id) {
      await updateProduct(product);
    } else {
      await addProduct(product);
    }

    setProduct({ name: '', description: '', price: '', image_url: '' }); // Reset form
    const fetchedProducts = await getAllProducts(); 
    setProducts(fetchedProducts.products);
  };

  const handleEdit = (product) => {
    if (!authToken) {
      throw new Error('No authentication token available');
    }
    setProduct(product);
  };

  if (!authToken) {
    return <p>You are not logged in.</p>;
  }
  const defaultImage = 'data:image/png;base64,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'; // Default image URL (you can use any default image URL)

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%', // Make sure the Box takes full width on mobile
      '& > :not(style)': { m: 1, width: '75ch' }, // Default width
      '@media (max-width: 600px)': {
        '& > :not(style)': { width: '90%' }, // Change width for smaller screens (mobile)
      },
    }}>
      <Typography variant="h4" gutterBottom>
        {product.id ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Product Name"
        name="name"
        value={product.name}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Description"
        name="description"
        value={product.description}
        onChange={handleChange}
        required
        multiline
        rows={4}
      />
      <TextField
        fullWidth
        margin="normal"
        label="Price"
        name="price"
        type="number"
        value={product.price}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Image URL"
        name="image_url"
        value={product.image_url}
        onChange={handleChange}
        required
      />
      <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
        {product.id ? 'Update Product' : 'Add Product'}
      </Button>
      <Button variant="contained" color="primary" onClick={resetForm} type="button" sx={{ mt: 2 }}>
        Cancel
      </Button>


      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Product List
      </Typography>
      <List>
      {Array.isArray(products) && products.length > 0 ? (
      <ImageList cols={3} rowHeight={200} gap={16}>
        {products.map((prod) => (
          <ImageListItem key={prod.id} >
            <img
              src={prod.image_url || defaultImage}
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
              actionIcon={
          <IconButton
            aria-label="edit"
            style={{ color: "white" }}
            onClick={() => handleEdit(prod)}
          >
            <EditIcon />
          </IconButton>
        }

            />
            </ImageListItem>
        ))}
      </ImageList>
    ) : (
      <Typography>No products available.</Typography> // Show a fallback message if no products
    )}
      </List>
    </Box>
  );
};

export default AddProductForm;
