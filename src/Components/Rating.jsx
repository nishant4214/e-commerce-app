import React, { useState , useEffect} from "react";
import { Box, Typography, TextField, Button, Rating } from "@mui/material";
import addReview from '../netlify/addReview';

const OrderFeedback = ({ orderId,  userId, productData, onSubmitFeedback }) => {
  const [rating, setRating] = useState(0); // State to store rating
  const [comment, setComment] = useState(""); // State to store comment
  const [error, setError] = useState("");
  
  const user = sessionStorage.getItem('user');
  const userObj = JSON.parse(user);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    }
    setError("");
    const feedbackData = { productData, rating, comment };
    const reviewData = await addReview(orderId, productData.id,userId, rating, comment );

    if(reviewData){
      onSubmitFeedback(feedbackData);
      alert("Feedback submitted successfully!");
      setRating(0);
      setComment("");
    }else{
      alert("Error while setting feedback");

    }
  };
  
  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "20px",
        width: "300px",
        height:"500px",
        margin: "20px auto",
        
      }}
      
    >
      <img
        src={productData.image_url || "/path/to/default-image.jpg"}
        alt={productData.name}
        className="card-img-top img-fluid"
        style={{
        objectFit: "cover",
        maxHeight: "200px",
        borderTopLeftRadius: "8px",
        borderTopRightRadius: "8px",
        }}
      />
      <Typography variant="h6">
        {productData.name}
      </Typography>
      <Rating
        value={rating}
        onChange={(event, newValue) => setRating(newValue)}
        size="large"
      />
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        label="Add your Review"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        sx={{ marginTop: "16px" }}
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: "16px" }}
        onClick={handleSubmit}
      >
        Submit Review
      </Button>
    </Box>
  );
};

export default OrderFeedback;
