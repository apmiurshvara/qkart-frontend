import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";
import { useHistory, Link } from "react-router-dom";
 
const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
 
  // Added: For using useHistory()
  const history = useHistory();
 
  // Added: States for username, password, confirmPassword
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
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
        onClick={() => validateInput({"username": username, "password": password, "confirmPassword": confirmPassword})}>
        Register Now
      </Button>
    );
  }
  //
 
  // Added: Event handlers for change in username, password and confirmPassword
  const handleInput = (event) => {
    if(event.target.name === "username")
    {
      setUsername(event.target.value);
    }
    if(event.target.name === "password")
    {
      setPassword(event.target.value);
    }
    if(event.target.name === "confirmPassword")
    {
      setConfirmPassword(event.target.value);
    }
  };
  //
 
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    // console.log(formData);
    setIsLoading(true);
    // error handling for registration, using try-catch
    try {
      // POST request using axios.
     
      const response = await axios.post(`${config.endpoint}/auth/register`, formData);
      console.log(response);
 
      // If status code 201 (successful POST), display success banner.
      if(response.status === 201)
      {
        setIsLoading(false);
        enqueueSnackbar('Registered successfully', {
          autoHideDuration: 3000, variant: "success"
        })
        history.push("/login", { from: "Register" });
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
 
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
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
    if(data.confirmPassword !== data.password)
    {
      enqueueSnackbar('Passwords do not match', {
        autoHideDuration: 3000, variant: "warning"
      })
      return false;
    }
 
    register({"username": data.username, "password": data.password});
    return true;
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
          <h2 className="title">Register</h2>
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
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
 
            value={password}
            onChange={handleInput}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
 
            value={confirmPassword}
            onChange={handleInput}
          />
          {buttonEle}
          <p className="secondary-action">
            Already have an account?{" "}
             <Link to="/login">
              Login here
             </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};
 
export default Register;




// import { Button, CircularProgress, Stack, TextField } from "@mui/material";
// import { Box } from "@mui/system";
// import axios from "axios";
// import { useSnackbar } from "notistack";
// import React, { useState } from "react";
// import { config } from "../App";
// import Footer from "./Footer";
// import Header from "./Header";
// import "./Register.css";
// import { useHistory, Link } from "react-router-dom";

// const Register = (props) => {
//   const { enqueueSnackbar } = useSnackbar();
//   const [registerationData , setRegisterationData] = useState({
//     username:"",
//     password:"",
//     confirmPassword:"",
//   })
//   const [showCircularProgress,setShowCircularprogress] = useState(false)
//   const history = useHistory()
//   const registerationDataHandler = (e)=>{
//    //console.log(e.target.value);
//    setRegisterationData((prevData)=>({...prevData,[e.target.id]:e.target.value}))
//   }

//   // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
//   /**
//    * Definition for register handler
//    * - Function to be called when the user clicks on the register button or submits the register form
//    *
//    * @param {{ username: string, password: string, confirmPassword: string }} formData
//    *  Object with values of username, password and confirm password user entered to register
//    *
//    * API endpoint - "POST /auth/register"
//    *
//    * Example for successful response from backend for the API call:
//    * HTTP 201
//    * {
//    *      "success": true,
//    * }
//    *
//    * Example for failed response from backend for the API call:
//    * HTTP 400
//    * {
//    *      "success": false,
//    *      "message": "Username is already taken"
//    * }
//    */
//   const register = async (formData) => {
   
//     try{
//     const {username,password} = registerationData
//     const url = `${config.endpoint}/auth/register`
//     const data = JSON.stringify({username:username,password:password});
//     const headers= {
//       "Content-Type":"application/json"
//     }
//     const response = await axios.post(url,data,{headers})
    
//     enqueueSnackbar("Registered successfully",{
//         variant : "success"
//       })
//       history.push("/login")
//       return ;
    
//   }catch(error){
//     if(error.response.status === 400){
//       //console.log(error.response)
//       const errorMesssage = error.response.data.message
//       return enqueueSnackbar(errorMesssage,{variant:"error"})
//     }
//       enqueueSnackbar( "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",{
//         variant:"error"
//       })
    
//     }finally{
//       setShowCircularprogress(false)
//     }
  
   
  
//   };

//   // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
//   /**
//    * Validate the input values so that any bad or illegal values are not passed to the backend.
//    *
//    * @param {{ username: string, password: string, confirmPassword: string }} data
//    *  Object with values of username, password and confirm password user entered to register
//    *
//    * @returns {boolean}
//    *    Whether validation has passed or not
//    *
//    * Return false if any validation condition fails, otherwise return true.
//    * (NOTE: The error messages to be shown for each of these cases, are given with them)
//    * -    Check that username field is not an empty value - "Username is a required field"
//    * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
//    * -    Check that password field is not an empty value - "Password is a required field"
//    * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
//    * -    Check that confirmPassword field has the same value as password field - Passwords do not match
//    */
//   const validateInput = (data) => {
//     setShowCircularprogress(true)
//     const {username,password,confirmPassword} = registerationData;
//     if(username.trim() === ""){
//        enqueueSnackbar("Username is a required field",{variant:"warning"})
//     }else if(username.trim().length < 6){
//        enqueueSnackbar("Username must be at least 6 characters",{variant:"warning"})
//     }else if(password.trim()=== ""){
//        enqueueSnackbar("Password is a required field",{variant:"warning"})
//     }else if(password.trim().length < 6){
//        enqueueSnackbar("Password must be at least 6 characters",{variant:"warning"})
//     }else if(!(password.trim() === confirmPassword.trim())){
//        enqueueSnackbar("Passwords do not match",{variant:"warning"})
//     }else{
//     return register()
//     }
//     setShowCircularprogress(false)
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
//           <h2 className="title">Register</h2>
//           <TextField
//             id="username"
//             label="Username"
//             variant="outlined"
//             title="Username"
//             name="username"
//             placeholder="Enter Username"
//             fullWidth
//             value={registerationData.username}
//             onChange={registerationDataHandler}
//           />
//           <TextField
//             id="password"
//             variant="outlined"
//             label="Password"
//             name="password"
//             type="password"
//             helperText="Password must be atleast 6 characters length"
//             fullWidth
//             placeholder="Enter a password with minimum 6 characters"
//             value={registerationData.password}
//             onChange={registerationDataHandler}
//           />
//           <TextField
//             id="confirmPassword"
//             variant="outlined"
//             label="Confirm Password"
//             name="confirmPassword"
//             type="password"
//             fullWidth
//             value={registerationData.confirmPassword}
//             onChange={registerationDataHandler}
//           />
//           {showCircularProgress? <CircularProgress
//           className="root" variant="indeterminate"
//           ></CircularProgress>:
//           <Button className="button" variant="contained" onClick={validateInput}>
//             Register Now
//            </Button>
//            }
           
          
//           <p className="secondary-action">
//             Already have an account?{" "}
//             <Link 
//             to="/login"
//             className="link"
//             >
//              Login here
//              </Link>
//           </p>
//         </Stack>
//       </Box>
//       <Footer />
//     </Box>
//   );
// };

// export default Register;
