import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack, InputAdornment, 
  TextField, } from "@mui/material"; // eslint-disable-next-line no-use-before-define
import Box from "@mui/material/Box";
import React from "react";
import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { Search, SentimentDissatisfied } from "@mui/icons-material";


import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const hist = useHistory();

   const logout=()=>{
    localStorage.clear();
    window.location.reload();
   }
    return (
      <Box className="header">
        <Box className="header-title">
            <img src="logo_dark.svg" alt="QKart-icon"></img>
        </Box>
        { (children) && 
          <div>{children}</div>
       }
        {
          (children)?

          ((localStorage.username)?
          <div>
         <Button className="explore-button"><img src="avatar.png" alt={localStorage.username}></img></Button>
         <Button className="explore-button" variant="text">{localStorage.username}</Button>
         <Button className="explore-button" variant="text" onClick={logout}> LOGOUT </Button>
          </div>
          : 
          <div> <Button className="explore-button"variant="text"  name="login"  onClick={() => hist.push("/login")}>LOGIN</Button> 
         <Button className="button" variant="contained"  name="register" onClick={() => hist.push("/register")}>Register</Button> 
         </div>)

       : <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => 
            hist.push("/")
        }
        >
         Back to explore
        </Button> 
        }
        
      </Box>
    );
};

export default Header;
