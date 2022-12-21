import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import ProductCard from "./ProductCard";
import "./Products.css";

// Added: to be able to use Cart component and to get all data about all cart added products.
import Cart, { generateCartItemsFrom } from "./Cart";

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


const Products = () => {

  // Added: To be able to use the snack bar.
  const { enqueueSnackbar } = useSnackbar();

  // Added to store and pass products data to ProductCard in conditional rendering.
  const [prodData, setProdData] = useState([]);

  // Added: To show loading when Products is being fetched, and to show 
  // products when they get fetched.
  const [isLoading, setIsLoading] = useState(true);

  // Added: To store and use the timer ID for Debouncing purpose.
  const [myTimer, setMyTimer] = useState(0);

  // Added: To store and use the data of products in cart for logged in user.
  const [cartData, setCartData] = useState([]);

  let prodGrid;
  if(isLoading) {
    console.log('if executed');
    prodGrid = (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 136 }}>
        <CircularProgress />
        <Box>
          Loading Products
        </Box>
      </Box>
    );
  }
  else {
    console.log('else executed', prodData);
    prodGrid = (
      <>
        {(prodData.length)?(
            prodData.map((prod) => (
              <Grid item xs={6} md={3} key={prod._id}>
                <ProductCard product={prod} handleAddToCart={async () => await addToCart(window.localStorage.getItem('token'), cartData, prodData, prod._id, 1, {preventDuplicate: true})} /> {/*Gave qty as 1, because when we add a product, automatically only 1 quantity of it is selected. */}
              </Grid>
            )
        )):(
          <Box className="loading">
            <SentimentDissatisfied color="action" />
            <h4 style={{ color: "#636363" }}>No Products Found</h4>
          </Box>
        )}
      </>
    );
  }

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
    return items.findIndex((item) => item.productId===productId) !== -1;
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
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    
    if(!token) {
      enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
      return;
    }

    // options.preventDuplicate : true: addToCart() called from ADD TO CART button
    if(options.preventDuplicate && isItemInCart(items, productId)) {
      enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
      return;
    }

    try{
      let res = await axios.post(`${config.endpoint}/cart`, {productId, qty},{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setCartData(res.data);
    } catch(e) {
      
      if (e.response && e.response.status === 404) {
        console.log(e.response)
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }
    
    console.log("Added to Cart ", productId);
  };


  // Added: Conditional Rendering for Cart:
  let cartNprod;
  if(window.localStorage.getItem('username')) {
    let cartProddata = generateCartItemsFrom(cartData, prodData);
   
    console.log('cartProddata', cartProddata);
    
    cartNprod = (
      <Grid container>
        <Grid container item md={9} xs={12} marginY="1rem" paddingX="1rem" spacing={2}>
          <Grid item className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                to your door step
              </p>
            </Box>
          </Grid>
          {prodGrid}
        </Grid>
        <Grid item md={3} xs={12} bgcolor="#E9F5E1">
          <Cart products={prodData} items={cartProddata} handleQuantity={addToCart} />
        </Grid>
      </Grid>
    );
  }
  else {
    cartNprod = (
      <Grid container marginY="1rem" paddingX="1rem" spacing={2}>
        <Grid item className="product-grid">
          <Box className="hero">
            <p className="hero-heading">
              India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
              to your door step
            </p>
          </Box>
        </Grid>
        {prodGrid}
      </Grid>
    );
  }

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
  const performAPICall = async () => {
    // setIsLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/products`);
      console.log(response.data);
      setProdData(response.data);
      
      setIsLoading(false);
      return response.data;
    } catch(err) {
      if(err.response.status === 500)
      {
        enqueueSnackbar(err.response.data.message, {
          autoHideDuration: 3000, variant: "error"
        })
      }
      else
      {
        enqueueSnackbar('Something went wrong. Check that the backend is running, reachable and returns valid JSON.', {
          autoHideDuration: 3000, variant: "error"
        })
      }
      setIsLoading(false);
      return null;
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
    const searchURL = `${config.endpoint}/products/search?value=${text}`;

    try {
      let searchedProds = await axios.get(searchURL);
      console.log(searchedProds);
      setProdData(searchedProds.data);
    } catch(err) {
      if (err.response.status === 404) {
        setProdData([]);
      }
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
  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeoutID = setTimeout(() => {
      performSearch(value);
    }, 500);

    setMyTimer(timeoutID);
  };

  // Added: To run code after page loads
  useEffect(() => {
    performAPICall();
    fetchCart(window.localStorage.getItem('token'));
  }, []);
  


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
      const res = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(res.data);
      setCartData(res.data);
    } catch (e) {
      console.log(e)
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


  return (
    <div>
      <Header>
        {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
        <TextField
          size="small"
          type="text"
          name="search-box"
          className="search-desktop"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          onChange={(e) => debounceSearch(e, myTimer)}
        />
      </Header>

      {/* Search view for mobiles */}
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

        onChange={(e) => debounceSearch(e, myTimer)}
      />
      {cartNprod}
      <Footer />
    </div>
  );
};

export default Products;






// import { Search, SentimentDissatisfied } from "@mui/icons-material";
// import {
//   CircularProgress,
//   Grid,
//   InputAdornment,
//   TextField,
// } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useEffect, useState } from "react";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Products.css";
// import ProductCard from "./ProductCard"
// import Cart from "./Cart";
// import {generateCartItemsFrom } from "./Cart"

// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  * 
//  * @property {string} name - The name or title of the product


// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  * 
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// let PRODUCTS;
// let CART;
// const Products = () => {
//   const {enqueueSnackbar} = useSnackbar()
//   const [showLoading,setShowLoading] = useState(false)
//   const [productsData , setProductsData] = useState([])
//   const [debounceTimeout , setDebounceTimeout] = useState(setTimeout(()=>{},500))
//   const [searchValue , setSearchValue]= useState("")
//   const [userIsLogged,setUserIsLogged] = useState(false)
//   const [rawCart , setRawCart] = useState([])
//   const [cartList , setCartList] = useState([])
  
  
  



//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Fetch products data and store it
//   /**
//    * Make API call to get the products list and store it to display the products
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on all available products
//    *
//    * API endpoint - "GET /products"
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "name": "iPhone XR",
//    *          "category": "Phones",
//    *          "cost": 100,
//    *          "rating": 4,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "v4sLtEcMpzabRyfx"
//    *      },
//    *      {
//    *          "name": "Basketball",
//    *          "category": "Sports",
//    *          "cost": 100,
//    *          "rating": 5,
//    *          "image": "https://i.imgur.com/lulqWzW.jpg",
//    *          "_id": "upLK9JbQ4rMhTwt4"
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 500
//    * {
//    *      "success": false,
//    *      "message": "Something went wrong. Check the backend console for more details"
//    * }
//    */
//    useEffect(()=>{
//     setShowLoading(true)
//     const token = localStorage.getItem("token");
//     if(token !== null){
//       fetchCart(token)
      
//     }
    
     
//       axios.get(`${config.endpoint}/products`).then((response)=>{
//         if(response.data.length>0){
         
//              setProductsData(response.data);
//            // products(response.data)
//             PRODUCTS = response.data
             
//              setShowLoading(false)
//       }}).catch(error =>{
//         enqueueSnackbar(error.response.message,{variant : "error"})
//         setShowLoading(false)
//         if(!error.response.success ){
//            enqueueSnackbar(error.response.message,{variant : "error"})
//            setShowLoading(false)
//            return;
//       }})

    
   
   
//   },[rawCart])
 

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Implement search logic
//   /**
//    * Definition for search handler
//    * This is the function that is called on adding new search keys
//    *
//    * @param {string} text
//    *    Text user types in the search bar. To filter the displayed products based on this text.
//    *
//    * @returns { Array.<Product> }
//    *      Array of objects with complete data on filtered set of products
//    *
//    * API endpoint - "GET /products/search?value=<search-query>"
//    *
//    */
//   const performSearch = (text) => {
   
  
//     const url = `${config.endpoint}/products/search?value=${text}`;
//     axios.get(url).then(response => {
//       //console.log(response)
//       setProductsData(response.data);
//     }).catch(error =>{
//       console.log("el")
//       setProductsData([]);
//       // if(error.reponse){
//       //   console.log(error.reponse)
        
//       // }
//     })
//   };

  

//   // TODO: CRIO_TASK_MODULE_PRODUCTS - Optimise API calls with debounce search implementation
//   /**
//    * Definition for debounce handler
//    * With debounce, this is the function to be called whenever the user types text in the searchbar field
//    *
//    * @param {{ target: { value: string } }} event
//    *    JS event object emitted from the search input field
//    *
//    * @param {NodeJS.Timeout} debounceTimeout
//    *    Timer id set for the previous debounce call
//    *
//    */
//   const debounceSearch = (event, debounceTimeout) => {
//     setSearchValue(event.target.value)
//    const text = event.target.value ;
   
//    const makeSearch = () => {
//     clearTimeout(debounceTimeout) ;
//     performSearch(text)

//    }   
//    clearTimeout(debounceTimeout)
//    setDebounceTimeout(setTimeout(makeSearch,500))


//   }
  

// /*********************CART****************/
// const userIsLoggedIn = (isLoggedIn)=>{
  
//   if(isLoggedIn !== null){
//     setUserIsLogged(true)
//   }
// }

  


//   /**
//    * Perform the API call to fetch the user's cart and return the response
//    *
//    * @param {string} token - Authentication token returned on login
//    *
//    * @returns { Array.<{ productId: string, qty: number }> | null }
//    *    The response JSON object
//    *
//    * Example for successful response from backend:
//    * HTTP 200
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 401
//    * {
//    *      "success": false,
//    *      "message": "Protected route, Oauth2 Bearer token not found"
//    * }
//    */
//   const fetchCart = async (token) => {
//     if (!token) return;

//     try {
//       // TODO: CRIO_TASK_MODULE_CART - Pass Bearer token inside "Authorization" header to get data from "GET /cart" API and return the response data
//       const url = `${config.endpoint}/cart`;
//       const headers = {
//         headers : {
//           Authorization : `Bearer ${token}`
//         }
//       }
      
//       const response = await axios.get(url,headers)
     
//       CART = response.data
      
//       setCartList(generateCartItemsFrom(response.data,productsData))
      
//     } catch (e) {
//       if (e.response && e.response.status === 400) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//       return null;
//     }
//   };


//   // TODO: CRIO_TASK_MODULE_CART - Return if a product already exists in the cart
//   /**
//    * Return if a product already is present in the cart
//    *
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { String } productId
//    *    Id of a product to be checked
//    *
//    * @returns { Boolean }
//    *    Whether a product of given "productId" exists in the "items" array
//    *
//    */
//   const isItemInCart = (items, productId) => {
    
//     let item = items.find(item => item.productId === productId);
//     if(item !== undefined){
//       return true
//     }
//     return false
//   };

//   /**
//    * Perform the API call to add or update items in the user's cart and update local cart data to display the latest cart
//    *
//    * @param {string} token
//    *    Authentication token returned on login
//    * @param { Array.<{ productId: String, quantity: Number }> } items
//    *    Array of objects with productId and quantity of products in cart
//    * @param { Array.<Product> } products
//    *    Array of objects with complete data on all available products
//    * @param {string} productId
//    *    ID of the product that is to be added or updated in cart
//    * @param {number} qty
//    *    How many of the product should be in the cart
//    * @param {boolean} options
//    *    If this function was triggered from the product card's "Add to Cart" button
//    *
//    * Example for successful response from backend:
//    * HTTP 200 - Updated list of cart items
//    * [
//    *      {
//    *          "productId": "KCRwjF7lN97HnEaY",
//    *          "qty": 3
//    *      },
//    *      {
//    *          "productId": "BW0jAAeDJmlZCF8i",
//    *          "qty": 1
//    *      }
//    * ]
//    *
//    * Example for failed response from backend:
//    * HTTP 404 - On invalid productId
//    * {
//    *      "success": false,
//    *      "message": "Product doesn't exist"
//    * }
//    */
//   // const addToCart = async (
//   //   token,
//   //   items,
//   //   products,
//   //   productId,
//   //   qty,
//   //   options = { preventDuplicate: false }
//   // ) => {
    
//   //  const url = `${config.endpoint}/cart`
//   //  const headers = {
//   //   headers :{
//   //     Authorization : `Bearer ${token}`,
//   //     "Content-Type":"application/json"
//   //   }
    
//   //  }
//   //  const body = {
//   //   productId : productId,
//   //   qty : qty === 1 ? 1 : qty
//   //  }
//   //   if(token === null){
//   //   return  enqueueSnackbar("Login to add an item to the Cart",{variant:"error"})
//   //   }
//   //  const isItemInTheCart = isItemInCart(CART,productId);
   
//   //  if(isItemInTheCart && qty === null){
//   //   return enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.",{variant:'warning'})
//   //  }
//   // axios.post(url,body,headers).then(response => {
//   //   CART = response.data
//   //  setRawCart(response.data)
//   // }).catch(error => {
//   //   console.log(error)
//   // })

//   // };

//   const addToCart = async (
//     token,
//     items,
//     products,
//     productId,
//     qty,
//     options = { preventDuplicate: false }
//   ) => {
//     if(!token) {
//       enqueueSnackbar("Login to add an item to the Cart", { variant: "warning" });
//       return;
//     }

//     // options.preventDuplicate : true: addToCart() called from ADD TO CART button
//     if(options.preventDuplicate && isItemInCart(items, productId)) {
//       enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "warning" });
//       return;
//     }

//     try{
//       let res = await axios.post(`${config.endpoint}/cart`, {productId, qty},{
//         headers: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//       setRawCart(res.data);
//     } catch(e) {
//       if (e.response && e.response.status === 404) {
//         enqueueSnackbar(e.response.data.message, { variant: "error" });
//       } else {
//         enqueueSnackbar(
//           "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
//           {
//             variant: "error",
//           }
//         );
//       }
//     }
    
//     console.log("Added to Cart ", productId);
//   };
//   return (
//     <div>
//       <Header userIsLoggedIn={userIsLoggedIn} hasHiddenAuthButtons={true}>
//         {/* TODO: CRIO_TASK_MODULE_PRODUCTS - Display search bar in the header for Products page */}
//         <TextField
//         className="search-desktop"
//         size="small"
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Search color="primary" />
//             </InputAdornment>
//           ),
//         }}
//         placeholder="Search for items/categories"
//         name="search"
//         value={searchValue}
//         onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
//       />
//       </Header>

      

//       <TextField
//         className="search-mobile"
//         size="small"
//         fullWidth
//         InputProps={{
//           endAdornment: (
//             <InputAdornment position="end">
//               <Search color="primary" />
//             </InputAdornment>
//           ),
//         }}
//         placeholder="Search for items/categories"
//         name="search"
//         value={searchValue}
//         onChange={(e)=>{debounceSearch(e,debounceTimeout)}}
//       />{!userIsLogged ?<Grid container spacing={2}>
//       <Grid item className="product-grid">
//         <Box className="hero">
//           <p className="hero-heading">
//             India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
//             to your door step
//           </p>
//         </Box>
//         </Grid>
//         {showLoading?<div className="loading">
//          <CircularProgress></CircularProgress>
//          <p>Loading Products...</p>
//         </div>
//         :
//         productsData.length>0?
//         productsData.map((product)=>{ return  <Grid key={product._id} item sm={6} md={3} >
//          <ProductCard handleAddToCart={addToCart} product={product}/>
//          </Grid>
       
// }):<div className="noProduct">
// <SentimentDissatisfied></SentimentDissatisfied>
// <p>No products found</p>
// </div>
//         }
        
      
//     </Grid>:
//     <Grid container spacing={2}>
//       <Grid container sm={12} md={9} spacing={2}>
//       <Grid item className="product-grid">
//       <Box className="hero">
//         <p className="hero-heading">
//           India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
//           to your door step
//         </p>
//       </Box>
//       </Grid >
      
//       {showLoading?<div className="loading">
//        <CircularProgress></CircularProgress>
//        <p>Loading Products...</p>
//       </div>
//       :
//       productsData.length>0?
//       productsData.map((product)=>{ return  <Grid key={product._id} item sm={6} md={3} >
//        <ProductCard handleAddToCart={async () => await addToCart(window.localStorage.getItem('token'), rawCart, productsData, product._id, 1, {preventDuplicate: true})} product={product}/>
//        </Grid>
     
// }):<div className="noProduct">
// <SentimentDissatisfied></SentimentDissatisfied>
// <p>No products found</p>
// </div>
//       }
      
//       </Grid>
//       <Grid item sm={12} md={3} columnSpacing={{xs:1 , md : 4}} className="cart-container">
       
//          <Cart   items={cartList} className="cart" products={productsData} handleQuantity={addToCart} />
        
        
//       </Grid>

   
      
    
//   </Grid>
//     }
       
      
//         {/* TODO: CRIO_TASK_MODULE_CART - Display the Cart component */}
//       <Footer />
//     </div>
//   )
    
//           }
// export default Products;
