import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import { Grid } from "@mui/material";
import React from "react";
import "./ProductCard.css";
import useState from "react";

const ProductCard = ({ product, handleAddToCart }) => {

 
  return (
  
   <Card className="card">
      <CardMedia  component="img" image={product.image}  />
      <CardContent>
          <Typography  variant="h5">
                    {product.name}
          </Typography>
          <Typography>
           ${product.cost}
            </Typography>
          <Rating  defaultValue={product.rating} precision={0.5} readOnly />
      </CardContent>
        <CardActions className="card-actions">
            <Button
            className="card-button"
            startIcon={<AddShoppingCartOutlined />}
            variant="contained"
            >
            ADD TO CART
            </Button> 
        </CardActions>
    </Card>

  
  );
};

export default ProductCard;
