import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";
 
const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
 
  // Added: For using useHistory()
  const history = useHistory();
 
  // Added: States for username, password
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  //
 
  // Added: State for whether API response data is loading or loaded
  let [isLoading, setIsLoading] = useState(false);
  //
 
  // Added: Conditional Rendering for Register Now button
  let buttonEle;
  if(isLoading)
  {
    buttonEle = (
      <Box sx={{ display: 'flex' }}>
        <CircularProgress />
      </Box>
    );
  }
  else
  {
    buttonEle = (
      <Button className="button" variant="contained"
        onClick={() => validateInput({"username": username, "password": password})}>
        LOGIN TO QKART
      </Button>
    );
  }
  //
 
  // Added: Event handlers for change in username, password
  const handleInput = (event) => {
    if(event.target.name === "username")
    {
      setUsername(event.target.value);
    }
    if(event.target.name === "password")
    {
      setPassword(event.target.value);
    }
  };
  //
 
  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    // console.log(formData);
    setIsLoading(true);
    // error handling for registration, using try-catch
    try {
      // POST request using axios.
     
      const response = await axios.post(`${config.endpoint}/auth/login`, formData);
      console.log(response);
 
      // If status code 201 (successful POST), display success banner.
      if(response.status === 201)
      {
        setIsLoading(false);
        persistLogin(response.data.token, response.data.username, response.data.balance);
        enqueueSnackbar('Logged in successfully', {
          autoHideDuration: 3000, variant: "success"
        })
        history.push("/", { from: "Login" });
      }
    } catch(err) {
      // console.log(err.response);
     
      if(err.response.status === 400)
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
    }
    setIsLoading(false);
  };
 
  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if(data.username.length === 0)
    {
      enqueueSnackbar('Username is a required field', {
        autoHideDuration: 3000, variant: "warning"
      })
      return false;
    }
    if(data.username.length < 6)
    {
      enqueueSnackbar('Username must be at least 6 characters', {
        autoHideDuration: 3000, variant: "warning"
      })
      return false;
    }
    if(data.password.length === 0)
    {
      enqueueSnackbar('Password is a required field', {
        autoHideDuration: 3000, variant: "warning"
      })
      return false;
    }
    if(data.password.length < 6)
    {
      enqueueSnackbar('Password must be at least 6 characters', {
        autoHideDuration: 3000, variant: "warning"
      })
      return false;
    }
 
    login({"username": data.username, "password": data.password});
    return true;
  };
 
  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    window.localStorage.setItem('username', username);
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('balance', balance);
  };
 
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
 
            value={username}
            onChange={handleInput}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
 
            value={password}
            onChange={handleInput}
          />
          {buttonEle}
          <p>Don’t have an account? <Link to="/register">Register Now</Link></p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};
 
export default Login;


// import { Button, CircularProgress, Stack, TextField } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useState } from "react";
// import { useHistory, Link } from "react-router-dom";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Login.css";


// const Login = () => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [loading,setLoading] = useState(false)
//   const [loginData,setLoginData] = useState({
//     username:"",
//     password:""
//   })
//   const history = useHistory()
//   const getDataHandler=(e)=>{
// setLoginData(prev =>({
//   ...prev,
//   [e.target.id] : e.target.value,
// }))
//   }

//   // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
//   /**
//    * Perform the Login API call
//    * @param {{ username: string, password: string }} formData
//    *  Object with values of username, password and confirm password user entered to register
//    *
//    * API endpoint - "POST /auth/login"
//    *
//    * Example for successful response from backend:
//    * HTTP 201
//    * {
//    *      "success": true,
//    *      "token": "testtoken",
//    *      "username": "criodo",
//    *      "balance": 5000
//    * }
//    *
//    * Example for failed response from backend:
//    * HTTP 400
//    * {
//    *      "success": false,
//    *      "message": "Password is incorrect"
//    * }
//    *
//    */
//   const login = async (formData) => {
//     setLoading(true)
//     const isValidData = validateInput(loginData);
//     if(isValidData.isValid){
//       try{
//         const url = `${config.endpoint}/auth/login`
//         const body = JSON.stringify(loginData)
//         const headers = {
//           "Content-Type" :"application/json"
//         }
//        const response = await  axios.post(url,body,{headers});
//        //console.log(response)
//        const token = response.data.token;
//        const username = response.data.username;
//        const balance = response.data.balance;
//        if(response.data.success){
//         persistLogin(token,username,balance);
//         enqueueSnackbar("Logged in successfully",{
//         variant : "success"
//        })
//        history.push("/")
//        return ;
//       }
//       }catch(error){
//        if(error.response.status === 400){
//         const errormessage = error.response.data.message
//         return enqueueSnackbar(errormessage,{
//           variant : "error"
//         })
//        }
//        return enqueueSnackbar( "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{
//         variant : 'error'
//        })
//       }finally{
//         setLoading(false)
//       }
//     }
      
//     enqueueSnackbar(isValidData.message,{variant:"error"})
//     setLoading(false);
//     return ;
      
    
//   };

//   // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
//   /**
//    * Validate the input values so that any bad or illegal values are not passed to the backend.
//    *
//    * @param {{ username: string, password: string }} data
//    *  Object with values of username, password and confirm password user entered to register
//    *
//    * @returns {boolean}
//    *    Whether validation has passed or not
//    *
//    * Return false and show warning message if any validation condition fails, otherwise return true.
//    * (NOTE: The error messages to be shown for each of these cases, are given with them)
//    * -    Check that username field is not an empty value - "Username is a required field"
//    * -    Check that password field is not an empty value - "Password is a required field"
//    */
//   const validateInput = (data) => {
//     const {username , password} = data;
//     if(username.trim().length === 0){
//       return {
//         isValid  : false,
//         message : "Username is a required field"
//       }
//     }else if(password.trim().length === 0){
//       return {
//         isValid : false,
//         message :"Password is a required field"
//       }
//     }
//     return {
//       isValid : true,
//     }
//   };

//   // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
//   /**
//    * Store the login information so that it can be used to identify the user in subsequent API calls
//    *
//    * @param {string} token
//    *    API token used for authentication of requests after logging in
//    * @param {string} username
//    *    Username of the logged in user
//    * @param {string} balance
//    *    Wallet balance amount of the logged in user
//    *
//    * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
//    * -    `token` field in localStorage can be used to store the Oauth token
//    * -    `username` field in localStorage can be used to store the username that the user is logged in as
//    * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
//    */
//   const persistLogin = (token, username, balance) => {
//     if(token !== null && username !== null && balance !== null){
//       const data = [{token:token},{username:username},{balance : balance}];
//       for(let i=0;i<data.length;i++){
//         for(const [key,value] of Object.entries(data[i])){
//           localStorage.setItem(key,value)
//         }
//       }
//       return ;
//     }
//     return ;
//   };

//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       justifyContent="space-between"
//       minHeight="100vh"
//     >
//       <Header hasHiddenAuthButtons={false} />
//       <Box className="content">
//         <Stack spacing={2} className="form">
//           <h2 className="title">Login</h2>
//           <TextField 
//           label="username"
//           id="username"
//           variant="outlined"
//           title="username"
//           name="username"
//           placeholder="Enter Username"
//           fullWidth
//           value={loginData.username}
//           onChange={getDataHandler}
//           />
//           <TextField
//           label="password"
//           id="password"
//           variant="outlined"
//           title="password"
//           name="password"
//           value={loginData.password}
//           placeholder="Enter Password"
//           fullWidth
//           onChange={getDataHandler}
//           />
//          {loading? 
//          <CircularProgress
//          className="root" variant="indeterminate"
//          ></CircularProgress>
//          :<Button
//           className="button"
//           variant="contained"
//           onClick={login}
//           >LOGIN TO QKART</Button>}
//           <p
//           className="secondary-action"
//           >Don't have an account
//           {" "}
//            {/* <a
//           className="link"
//           href="#"
//           >
//           Register now
//           </a> */}
//           <Link 
//           to="/register" 
//           className="link"
//           >
//            Register now 
//           </Link>
//           </p>
         
//         </Stack>
//       </Box>
//       <Footer />
//     </Box>
//   );
// };

// export default Login;
