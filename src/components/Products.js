import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment, Stack,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState, useCallback } from "react";
import { createTrue } from "typescript";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { Container } from "react-dom";
import Cart from "./Cart";
import { generateCartItemsFrom } from "./Cart";
import { isAwaitExpression } from "typescript";




/**
 * @typedef {Object} Product - Data on product available to buy
 * 
 * @property {string} name - The name or title of the product


/**
 * @typedef {Object} CartItem -  - Data on product added to cart
 * 
 * @property {string} name - The name or title of the product in cart
 * @property {string} qty - The quantity of product added to cart
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */


const Products = () => {

   const[data2,setData2]=useState([]);
   const[apiCall,setApiCall]=useState(false);
   const[cartItem,setCartItem]=useState([]);
   const[cartData,setCartData]=useState([]);

   const { enqueueSnackbar } = useSnackbar();

  useEffect(()=>{
    setApiCall(true)
    performAPICall().then((data) => {
      setData2(data)
      setApiCall(false)
    });
  },[])

  useEffect(()=>{
    fetchCart(localStorage.token)
  //  .then((data)=>{
    //  setCartItem(data);
    },[])


 




  // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
  /**
   * Make API call to get the products list and store it to display the products
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on all available products
   *
   * API endpoint - "GET /products"
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "name": "iPhone XR",
   *          "category": "Phones",
   *          "cost": 100,
   *          "rating": 4,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "v4sLtEcMpzabRyfx"
   *      },
   *      {
   *          "name": "Basketball",
   *          "category": "Sports",
   *          "cost": 100,
   *          "rating": 5,
   *          "image": "https://i.imgur.com/lulqWzW.jpg",
   *          "_id": "upLK9JbQ4rMhTwt4"
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 500
   * {
   *      "success": false,
   *      "message": "Something went wrong. Check the backend console for more details"
   * }
   */
  const performAPICall =async () => {
      try{ 
        const res=await axios.get(`${config.endpoint}/products`)
        return res.data;
      } catch(e){ 
        enqueueSnackbar(e.message)
        return []
      }
  };

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
  /**
   * Definition for search handler
   * This is the function that is called on adding new search keys
   *
   * @param {string} text
   *    Text user types in the search bar. To filter the displayed products based on this text.
   *
   * @returns { Array.<Product> }
   *      Array of objects with complete data on filtered set of products
   *
   * API endpoint - "GET /products/search?value=<search-query>"
   *
   */
  const performSearch = async (text) => {
   
     const res=await axios.get(`${config.endpoint}/products/search?value=${text}`)
    .then((e)=>{  return e.data; }).catch(e=>{   setData2([]); enqueueSnackbar(e.message, {
      variant: "failed",
      autoHideDuration: 1000,
    });  })
    if(res)
    {
     setData2(res); 
    }
  
  };
  

  // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
  /**
   * Definition for debounce handler
   * With debounce, this is the function to be called whenever the user types text in the searchbar field
   *
   * @param {{ target: { value: string } }} event
   *    JS event object emitted from the search input field
   *
   * @param {NodeJS.Timeout} debounceTimeout
   *    Timer id set for the previous debounce call
   *
   */
 

 

  
 const debounceSearch = (event, debounceTimeout=500) => {
 
 const timeId=setTimeout(()=>{
  performSearch(event.target.value);
 },500);
};


  /**
   * Perform the API call to fetch the user's cart and return the response
   *
   * @param {string} token - Authentication token returned on login
   *
   * @returns { Array.<{ productId: string, qty: number }> | null }
   *    The response JSON object
   *
   * Example for successful response from backend:
   * HTTP 200
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 401
   * {
   *      "success": false,
   *      "message": "Protected route, Oauth2 Bearer token not found"
   * }
   */
  const fetchCart = async (token) => {
    if (!token) return;
    
    try {  
      // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
      const result=await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
       setCartData(generateCartItemsFrom(result,await performAPICall()))
       setCartItem(result.data);
 
      return result.data;
    } catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
  /**
   * Return if a product already is present in the cart
   *
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { String } productId
   *    Id of a product to be checked
   *
   * @returns { Boolean }
   *    Whether a product of given "productId" exists in the "items" array
   *
   */
  const isItemInCart = (items, productId) => {
    let i=0;
    for(i=0;i<items.length;i++)
    { 
      if(items[i].productId===productId)
      {
        return true;
      }
    }
    return false;
  };

  /**
   * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
   *
   * @param {string} token
   *    Authentication token returned on login
   * @param { Array.<{ productId: String, quantity: Number }> } items
   *    Array of objects with productId and quantity of products in cart
   * @param { Array.<Product> } products
   *    Array of objects with complete data on all available products
   * @param {string} productId
   *    ID of the product that is to be added or updated in cart
   * @param {number} qty
   *    How many of the product should be in the cart
   * @param {boolean} options
   *    If this function was triggered from the product card's "Add to Cart" button
   *
   * Example for successful response from backend:
   * HTTP 200 - Updated list of cart items
   * [
   *      {
   *          "productId": "KCRwjF7lN97HnEaY",
   *          "qty": 3
   *      },
   *      {
   *          "productId": "BW0jAAeDJmlZCF8i",
   *          "qty": 1
   *      }
   * ]
   *
   * Example for failed response from backend:
   * HTTP 404 - On invalid productId
   * {
   *      "success": false,
   *      "message": "Product doesn't exist"
   * }
   */
  const addToCart = async (
    productId,
    token,
    qty,
    items,
    products,
    options = { preventDuplicate: false }
  ) => {
    console.log(qty);
    if(localStorage.username)
    {
  
    if(isItemInCart(cartItem, productId)===false)
    {  const res=await axios.post(`${config.endpoint}/cart`, 
      {"productId":productId,"qty": qty }, { headers: { 'Authorization': `Bearer ${token}` }});
   
      setCartData(generateCartItemsFrom(res,data2))
      console.log(cartData)
   
      
    }
    else
    {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{
        variant: "warning",
        autoHideDuration: 1000,
      })
    }
  }
  else
  {
    enqueueSnackbar("Login to add an item to the Cart",{ variant:"error",autoHideDuration:1000 })
  } 
  };

  const updateAndDelete = async (
    productId,
    token,
    qty,
    options = { preventDuplicate: false }
  ) => {
    console.log(productId,qty);
   
      const itemToBeUpdated=cartData.find((e)=> e.productId===productId );
     console.log("here");
     console.log(itemToBeUpdated)
      const res=await axios.post(`${config.endpoint}/cart`, 
      {"productId":productId,"qty": itemToBeUpdated.qty+qty }, { headers: { 'Authorization': `Bearer ${token}` }});
   
      setCartData(generateCartItemsFrom(res,data2))
     
   
      
    
 
  
 
  };


  return (
    <div>
        <Header  children={<TextField
        className="search-desktop"
        size="small"
        md={6}
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        onChange={ (e)=> debounceSearch(e)  }
        
        /> } />

      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        
        onChange={ (e)=> debounceSearch(e) }
      />
     <Grid container direction="row"> 
       <Grid item  md={(localStorage.username)?9:12} xs={12} >
         <Grid item className="product-grid">
           <Box className="hero">
             <p className="hero-heading">
               India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
               to your door step
             </p>
           </Box>  
           
          {(apiCall===true)?<div>
            <CircularProgress className="loading" />
            <p>Loading ... </p>
          </div>:
            (
            
              (data2.length===0)?<div className="zeroProduct"><SentimentDissatisfied /><p>No Products Found</p></div> :
              <Grid container direction="row" spacing={2}>{
              data2.map((element)=>(     
              <Grid item  xs={6}  md={3}  key={element._id}>    
                <ProductCard  product={element} handleAddToCart={ addToCart} /> 
              </Grid> 
              )) 
             }</Grid>  
            )
          }  
          
      
         </Grid>
       </Grid>

      {localStorage.username &&   <Grid item md={3} xs={12}>
          <Grid item>  
       
         <Cart  products={ data2 } items={ cartData } handleQuantity={ updateAndDelete} /> 
          
       </Grid>
       </Grid>  
       }

    </Grid>

      <Footer />
    </div>
  );
};

export default Products;

