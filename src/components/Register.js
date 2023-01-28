import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import { useHistory, Link } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [formDataObj, setFormData] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const history = useHistory()
  const [loading,setLoading] = React.useState(false)

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
    try {
      let validInput = validateInput(formData);
      if (validInput === true) {
        setLoading(true)
        let response = await axios.post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        });
        enqueueSnackbar("User registered successfully", {
          variant: "success",
          autoHideDuration: 1000,
        });
        setLoading(false)
        history.push("/login")
      }
    } catch (err) {
      setLoading(false)
      if (err.response.status >= 400) {
        enqueueSnackbar(`${err.response.data.message}`, {
          variant: "error",
          autoHideDuration: 1000,
        });
      }
    }
    // if(response.data.success=== true) {
    //   enqueueSnackbar("User registered successfully",{autoHideDuration:1000,variant:"success"})
    // } else if(response.data.success === false) {
    //   enqueueSnackbar(`${re}`)
    // }
  };

  const handleInput = (event, field) => {
    setFormData((prevState) => ({ ...prevState, [field]: event.target.value }));
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
    if (data?.username === "") {
      enqueueSnackbar("Username is required field", {
        variant: "warning",
        autoHideDuration: 1000,
      });
      return false;
    }
    if (data?.username?.length < 6) {
      enqueueSnackbar("Username must be atleast 6 characters", {
        variant: "warning",
        autoHideDuration: 1000,
      });
      return false;
    }

    if (data?.password === "") {
      enqueueSnackbar("Password is required field", {
        variant: "warning",
        autoHideDuration: 1000,
      });
      return false;
    }

    if (data?.password?.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
        autoHideDuration: 1000,
      });
      return false;
    }

    if (data?.password !== data?.confirmPassword) {
      console.log(data?.password,data?.confirmPassword)
      enqueueSnackbar("Passwords do not match", {
        variant: "warning",
        autoHideDuration: 1000,
      });
      return false;
    }
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
            onChange={(e) => handleInput(e, "username")}
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
            onChange={(e) => handleInput(e, "password")}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={(e) => handleInput(e, "confirmPassword")}
          />
          {loading  ? <CircularProgress /> :
          <Button
            className="button"
            variant="contained"
            onClick={() => register(formDataObj)}
          >
            Register Now
          </Button>
          }
          <p className="secondary-action">
            Already have an account?{" "}
            {/* <a className="link" href="#">
              Login here
            </a> */}
            <Link to="/login" replace>Login here</Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
