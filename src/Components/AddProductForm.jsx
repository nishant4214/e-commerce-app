import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import getAllProducts from '../netlify/getAllProducts';
import addProduct from '../netlify/addProduct';
import updateProduct from '../netlify/updateProduct';
const AddProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
  });
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts.products);
      
    };

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
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
    setProduct(product);
  };

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
      <Typography variant="h6" gutterBottom>
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

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Product List
      </Typography>
      <List>
      {Array.isArray(products) && products.length > 0 ? (
          products.map((prod) => (
            <ListItem button key={prod.id} onClick={() => handleEdit(prod)}>
              <ListItemText primary={prod.name} secondary={`Price: ${prod.price} INR`} />
            </ListItem>
          ))
        ) : (
          <Typography>No products available.</Typography>  // Show a fallback message if no products
        )}
      </List>
    </Box>
  );
};

export default AddProductForm;
