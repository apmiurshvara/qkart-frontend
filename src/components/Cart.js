import {
  AddOutlined,
  RemoveOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Button, IconButton, Stack } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useHistory } from "react-router-dom";
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
  if(!cartData) {
    return;
  }
 
  let allProddata = [];
 
  for(let i = 0;i < cartData.length;i++){
    let currProd = cartData[i];
 
    for(let j = 0;j < productsData.length;j++)
    {
      if(productsData[j]._id === currProd.productId)
      {
        allProddata.push({...productsData[j], "qty": currProd.qty});
      }
    }
  }
 
  console.log(allProddata);
  return allProddata;
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
  console.log(items);
  let total = 0;
 
  for(let i = 0;i < items.length;i++) {
    let currCost = items[i].cost;
    let currQty = items[i].qty;
   
    total += currCost * currQty;
  }
 
  return total;
};

export const getTotalItems=(items) => {
  
  let total= items.reduce((total,item)=>{
    return total + item.qty
  },0)
  console.log(total);
  return total
}
 
 
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
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const ItemQuantity = ({
  value,
  handleAdd,
  handleDelete,
  isReadOnly=false,
}) => {
  if(isReadOnly) {
    return (<Box>Qty: ${value}</Box>);
  }
 
  return (
    <Stack direction="row" alignItems="center">
      <IconButton size="small" color="primary" onClick={handleDelete}>
        <RemoveOutlined />
      </IconButton>
      <Box padding="0.5rem" data-testid="item-qty">
        {value}
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
 * @param {Function} handleQuantity
 *    Current quantity of product in cart
 *
 * @param {Function} handleDelete
 *    Current quantity of product in cart
 *
 * @param {Boolean} isReadOnly
 *    If product quantity on cart is to be displayed as read only without the + - options to change quantity
 *
 */
const Cart = ({
  isReadOnly=false,
  products,
  items = [],
  handleQuantity
}) => {
 
  const history = useHistory();

 
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
        {items.map((cartItem) => (
        <Box key={cartItem._id}>
          {cartItem.qty>0 ?
          <Box display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
              <img
                  // Add product image
                  src={cartItem.image}
                  // Add product name as alt eext
                  alt={cartItem.name}
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
              <div>{cartItem.name}</div>
              <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
              >
                <ItemQuantity
                // Add required props by checking implementation
                  value={cartItem.qty}
                  handleAdd={async () => {
                    await handleQuantity(
                      window.localStorage.getItem('token'),
                      items,
                      products,
                      cartItem._id,
                      cartItem.qty + 1
                    );
                  }}
                  handleDelete={async () => {
                    await handleQuantity(
                      window.localStorage.getItem('token'),
                      items,
                      products,
                      cartItem._id,
                      cartItem.qty - 1
                    );
                  }}
                  isReadOnly={isReadOnly}
                />
                <Box padding="0.5rem" fontWeight="700">
                    ${cartItem.cost}
                </Box>
              </Box>
            </Box>
          </Box> : null}
        </Box>
        ))}
       
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
 
        {(!isReadOnly) ? (
          <Box display="flex" justifyContent="flex-end" className="cart-footer">
            <Button
              color="primary"
              variant="contained"
              startIcon={<ShoppingCart />}
              className="checkout-btn"
              onClick={() => {
                history.push("/checkout")
              }}
            >
              Checkout
            </Button>
          </Box>
        ) : (<Box>
           </Box>)}    
      </Box>
      {isReadOnly && <Box display="flex" flexDirection={"column"} className="orderDetails">
        <Stack spacing={1}>
          <h2>Order Details</h2>
          <Box display="flex" justifyContent="space-between">
          <p>Products</p>
          <p>{getTotalItems(items)}</p>
          </Box>
          <Box display="flex" justifyContent="space-between">
          <p>Subtotal</p>
          <p>${getTotalCartValue(items)}</p>
          </Box>
          <Box display="flex" justifyContent="space-between">
          <p>Shipping Charges</p>
          <p>$0</p>
          </Box>
          <Box display="flex" justifyContent="space-between">
          <h3>Total</h3>
          <h3>${getTotalCartValue(items)}</h3>
          </Box>
          <Box></Box>

        </Stack>
        </Box>}
    </>
  );
};
 
export default Cart;
 















// import {
//   AddOutlined,
//   RemoveOutlined,
//   ShoppingCart,
//   ShoppingCartOutlined,
// } from "@mui/icons-material";
// import { Button, IconButton, Stack } from "@mui/material";
// import { Box } from "@mui/system";
// import React from "react";
// import { useHistory } from "react-router-dom";
// import "./Cart.css";

// // Definition of Data Structures used
// /**
//  * @typedef {Object} Product - Data on product available to buy
//  * 
//  * @property {string} name - The name or title of the product
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} _id - Unique ID for the product
//  */

// /**
//  * @typedef {Object} CartItem -  - Data on product added to cart
//  * 
//  * @property {string} name - The name or title of the product in cart
//  * @property {string} qty - The quantity of product added to cart
//  * @property {string} category - The category that the product belongs to
//  * @property {number} cost - The price to buy the product
//  * @property {number} rating - The aggregate rating of the product (integer out of five)
//  * @property {string} image - Contains URL for the product image
//  * @property {string} productId - Unique ID for the product
//  */

// /**
//  * Returns the complete data on all products in cartData by searching in productsData
//  *
//  * @param { Array.<{ productId: String, qty: Number }> } cartData
//  *    Array of objects with productId and quantity of products in cart
//  * 
//  * @param { Array.<Product> } productsData
//  *    Array of objects with complete data on all available products
//  *
//  * @returns { Array.<CartItem> }
//  *    Array of objects with complete data on products in cart
//  *
//  */

// export const generateCartItemsFrom =  (cartData, productsData) => {
//   let CARTITEMS = []
//   // console.log(productsData)
//   for(let i=0;i<cartData.length;i++){
//     let item  = productsData.find(product => product._id === cartData[i].productId);
//     item = {
//       ...item,qty:cartData[i].qty
//     }
    
//     CARTITEMS.push(item)
   
//   }
//   return CARTITEMS

// };

// /**
//  * Get the total value of all products added to the cart
//  *
//  * @param { Array.<CartItem> } items
//  *    Array of objects with complete data on products added to the cart
//  *
//  * @returns { Number }
//  *    Value of all items in the cart
//  *
//  */
// export const getTotalCartValue = (items = []) => {
 
//   const total = items.reduce((total,items)=>{
//     return total + (items.cost*items.qty)
//   },0)

//   return total
 
// };


// /**
//  * Component to display the current quantity for a product and + and - buttons to update product quantity on cart
//  * 
//  * @param {Number} value
//  *    Current quantity of product in cart
//  * 
//  * @param {Function} handleAdd
//  *    Handler function which adds 1 more of a product to cart
//  * 
//  * @param {Function} handleDelete
//  *    Handler function which reduces the quantity of a product in cart by 1
//  * 
//  * 
//  */
// const ItemQuantity = ({
//   value,
//   handleAdd,
//   handleDelete,
// }) => {
 
//   return (
//     <Stack direction="row" alignItems="center">
//       <IconButton size="small" color="primary" onClick={handleDelete}>
//         <RemoveOutlined />
//       </IconButton>
//       <Box padding="0.5rem" data-testid="item-qty">
//         {value}
//       </Box>
//       <IconButton size="small" color="primary" onClick={handleAdd}>
//         <AddOutlined />
//       </IconButton>
//     </Stack>
//   );
// };

// /**
//  * Component to display the Cart view
//  * 
//  * @param { Array.<Product> } products
//  *    Array of objects with complete data of all available products
//  * 
//  * @param { Array.<Product> } items
//  *    Array of objects with complete data on products in cart
//  * 
//  * @param {Function} handleDelete
//  *    Current quantity of product in cart
//  * 
//  * 
//  */
// const Cart = ({
//   products,
//   items = [],
//   handleQuantity,
 
// }) => {
// const history = useHistory()

// const token = localStorage.getItem("token")

// // const handleAdd = (id,qty) =>{ 
// // qty = qty + 1;
// // handleQuantity(token,items,products,id,qty,null)
// // }

// // const handleDelete = (id,qty)=>{
// // qty = qty-1;
// // handleQuantity(token,items,products,id,qty,null)
// // }

// const goToCheckoutHandler = () => {
// history.push("/checkout")
// }
//   if (!items.length) {
//     return (
//       <Box className="cart empty">
//         <ShoppingCartOutlined className="empty-cart-icon" />
//         <Box color="#aaa" textAlign="center">
//           Cart is empty. Add more items to the cart to checkout.
//         </Box>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <Box className="cart">
//         {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
//         {items.map(item =>  
//         item.qty !== 0 &&
//           <Box display="flex" alignItems="flex-start" padding="1rem" key={item._id}>
//     <Box className="image-container">
//         <img
//             // Add product image
//             src={item.image}
//             // Add product name as alt eext
//             alt={item.name}
//             width="100%"
//             height="100%"
//         />
//     </Box>
//     <Box
//         display="flex"
//         flexDirection="column"
//         justifyContent="space-between"
//         height="6rem"
//         paddingX="1rem"
//     >
//         <div>{item.name}</div>
//         <Box
//             display="flex"
//             justifyContent="space-between"
//             alignItems="center"
//         >
//         {/* <ItemQuantity
//         value={item.qty}
//         handleAdd={()=>{handleAdd(item._id,item.qty)}}
//         handleDelete = {()=>{handleDelete(item._id,item.qty)}}
//         // Add required props by checking implementation
//         /> */}
//         <ItemQuantity
//                 // Add required props by checking implementation
//                   value={item.qty}
//                   handleAdd={async () => {
//                     await handleQuantity(
//                       window.localStorage.getItem('token'),
//                       items,
//                       products,
//                       item._id,
//                       item.qty + 1
//                     );
//                   }}
//                   handleDelete={async () => {
//                     await handleQuantity(
//                       window.localStorage.getItem('token'),
//                       items,
//                       products,
//                       item._id,
//                       item.qty - 1
//                     );
//                   }}
//                   // isReadOnly={isReadOnly}
//                 />
//         <Box padding="0.5rem" fontWeight="700">
//         {`$${item.cost}`}
//         </Box>
//         </Box>
//     </Box>
// </Box>
//         )}
//         <Box
//           padding="1rem"
//           display="flex"
//           justifyContent="space-between"
//           alignItems="center"
//         >
//           <Box color="#3C3C3C" alignSelf="center">
//             Order total
//           </Box>
//           <Box
//             color="#3C3C3C"
//             fontWeight="700"
//             fontSize="1.5rem"
//             alignSelf="center"
//             data-testid="cart-total"
//           >
//             ${getTotalCartValue(items)}
//           </Box>
//         </Box>

//         <Box display="flex" justifyContent="flex-end" className="cart-footer">
//           <Button
//             color="primary"
//             variant="contained"
//             startIcon={<ShoppingCart />}
//             className="checkout-btn"
//             onClick={goToCheckoutHandler}
//           >
//             Checkout
//           </Button>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default Cart;
