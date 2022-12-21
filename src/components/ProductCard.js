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
import React from "react";
import "./ProductCard.css";
 
const ProductCard = ({ product, handleAddToCart }) => {
  console.log(product);
  return (
    <Card className="card">
      <CardMedia
        component="img"
        height="140"
        image={product.image}
        alt={product.name}
      />
      <CardActions>
        <CardContent>
          <Typography gutterBottom variant="h6" component="div">
            {product.name}
          </Typography>
          <Typography variant="h5">
            {"$" + product.cost}
          </Typography>
          <Rating
            name="read-only"
            value={product.rating}
            readOnly
          />
        </CardContent>
      </CardActions>
      <Button variant="contained" className="card-button" onClick={handleAddToCart}>
        ADD TO CART
      </Button>
    </Card>
  );
};
 
export default ProductCard;
 




// import { AddShoppingCartOutlined } from "@mui/icons-material";
// import {
//   Button,
//   Card,
//   CardActions,
//   CardContent,
//   CardMedia,
//   Rating,
//   Typography,
// } from "@mui/material";
// import React from "react";
// import "./ProductCard.css";

// const ProductCard = ({ product, handleAddToCart }) => {
//   const token = localStorage.getItem("token");

//   function addToCartHandler (){
//     handleAddToCart(token,null,null,product._id,null,null)
//   }
//   return (
//     <Card className="card">
//       <CardMedia 
//       component="img"
  
//       image={product.image}
//       alt={product.name}
//       />
//       <CardContent>
//         <Typography
//         variant="h5"
//         component="div"
//         >
//         {product.name}
//         </Typography>
//         <Typography
//         variant="h6"
//          fontWeight={'bold'}
//         >
//         $ {product.cost}
//         </Typography>
//         <Rating name="read-only" value={product.rating} readOnly/>
        
//       </CardContent>
//       <CardActions>
//       <Button
//       variant="contained"
//       className="card-button"
//       startIcon={<AddShoppingCartOutlined />}
//       onClick={addToCartHandler}

//         >
//           ADD TO CART
//         </Button>
//       </CardActions>
     
//     </Card>
//   );
// };

// export default ProductCard;
