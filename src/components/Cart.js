import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory,useState,Link } from "react-router-dom";
import "./Cart.css";

// Definition of Data Structures used
/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} productId - Unique ID for the product
 */

/**
 * Returns the complete data on all products in cartData by searching in productsData
 *
 * @param { Array.<{ productId: String, qty: Number }> } cartData
 *    Array of objects with productId and quantity of products in cart
 * 
 * @param { Array.<Product> } productsData
 *    Array of objects with complete data on all available products
 *
 * @returns { Array.<CartItem> }
 *    Array of objects with complete data on products in cart
 *
 */


export const generateCartItemsFrom = (cartData, productsData) => {
  
  
  let cartItem=[];
  cartData=cartData.data;
  const prodData=[...productsData]; 
  try{ const myArrayFiltered=prodData.filter((el) => {
    return cartData.some((f) => {
      
      if(f.productId === el._id)
      { 
        const data={
          "name":el.name,
          "qty":f.qty,
          "category":el.category,
          "cost":el.cost,
          "rating":el.rating,
          "image":el.image,
          "productId":el._id
        }
        cartItem.push(data);     
        return true
      }
      else 
      {
        return false;
      }
    });
  });
  return cartItem;
}catch(e){ console.log(e) }
 

  
  
};

/**
 * Get the total value of all products added to the cart
 *
 * @param { Array.<CartItem> } items
 *    Array of objects with complete data on products added to the cart
 *
 * @returns { Number }
 *    Value of all items in the cart
 *
 */
export const getTotalCartValue = (items = []) => {
  let amount=0;
  let i=0;
  for(i=0;i<items.length;i++)
  {  //console.log(items[i].cost,items[i].qty)
    amount=amount+(items[i].cost*items[i].qty);
  }
 
  return amount;
};


/**
 * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
 * 
 * @param {Number} value
 *    Current quantity of product in cart
 * 
 * @param {Function} handleAdd
 *    Handler function which adds 1 more of a product to cart
 * 
 * @param {Function} handleDelete
 *    Handler function which reduces the quantity of a product in cart by 1
 * 
 * 
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
}) => { 
  let qty;
  if(value){
 
  if((typeof value)==="number")
  {
    qty=value; 
  }else{ 
  qty=value.qty; 
  }
}




  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {qty}
      </Box>
      <IconButton size="small" color="primary" onClick={handleAdd}>
        <AddOutlined />
      </IconButton>
    </Stack>
  );
};

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 * 
 * 
 */
const Cart = ({
  products,
  items = [],
  handleQuantity,
}) => {
  const hist = useHistory();
  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {  items.map((element)=>(  
          
<Box key={element.productId} display="flex" alignItems="flex-start" padding="1rem">
    <Box className="image-container">
        <img
            // Add product image
            src={element.image}
            // Add product name as alt eext
            alt={element.name}
            width="100%"
            height="100%"
        />
    </Box>
    <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="6rem"
        paddingX="1rem"
    >
        <div>{ element.name}</div>
        <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
        <ItemQuantity
        // Add required props by checking implementation
        value={element.qty}
        handleDelete={()=> handleQuantity(element.productId,localStorage.token,-1) }
        handleAdd={()=>handleQuantity(element.productId,localStorage.token,1)}
        />
        <Box padding="0.5rem" fontWeight="700">
            ${element.cost}
        </Box>
        </Box>
    </Box>
</Box>
         
         ) )}
        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => hist.push("/checkout")}
          >
            Checkout
           
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Cart;
