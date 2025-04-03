import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { 
  Button, 
  TextField, 
  CircularProgress, 
  Divider, 
  Box,
  Typography,
  InputAdornment, 
  IconButton
} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
// import { Visibility, VisibilityOff } from '@material-ui/icons-material';
import { Api } from '../../utils/Api';
import { setToken } from '../../utils/localstorage';
import { setUserDetails } from "../../redux/actions/userAction";
import { useStyles } from './signIn.styles';
import './signIn.css';
import { jwtDecode } from 'jwt-decode-es';

import FacebookLogin from 'react-facebook-login';
import { FacebookLoginButton,GoogleLoginButton } from 'react-social-login-buttons';
import { GoogleLogin } from '@react-oauth/google';



// Import social login images
import companyLogo from '../../assets/images/company-logo.png';

// Create Alert component
const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

// Validation Schema
const SignInSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

function SignIn() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { replace, push } = useHistory();
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleGoogleSignIn = (response) => {
    if (response.credential) {
      // Handle successful login
      // You can decode the credential to get user information
      const decoded = jwtDecode(response.credential);
      console.log('Decoded Google User:', decoded);
      // decoded will contain: email, name, picture, etc.
    }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    console.log('Google login success:', credentialResponse);
    // Handle the successful login here
    handleGoogleSignIn(credentialResponse);
  };
  
  const handleGoogleError = () => {
    console.log('Google login failed');
  };
  
  const handleFacebookSignIn = async (response) => {
    // Implement Facebook sign in logic
    console.log('Facebook sign in clicked');
    console.log(response)
      try {

        const { statusCode, data } = await Api.postRequest('http://localhost:5001/auth/login', {
          loginType: 'facebook',
          token: response.accessToken,
        });

        if (statusCode === 400 || statusCode === 500 || statusCode === 403) {
          setError(data);
          return;
        }
  
        const { access_token } = JSON.parse(data);
        setToken(access_token);
        dispatch(setUserDetails());
        replace('/');

        // Handle successful login (store tokens, redirect, etc.)
      } catch (error) {
        console.error('Login failed:', error);
      }
  };

  const handleSignIn = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const { username, password } = values;
      const { statusCode, data } = await Api.postRequest('http://localhost:5001/auth/login', {
        username,
        password,
      });

      if (statusCode === 400 || statusCode === 500 || statusCode === 403) {
        setError(data);
        return;
      }

      const { access_token } = JSON.parse(data);
      setToken(access_token);
      dispatch(setUserDetails());
      replace('/');
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="signinscreen" >
      <div className="container">
        <div className="innerContainer">

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Button
              onClick={() => push('/')}
              startIcon={<i className="fas fa-arrow-circle-left" />}
            >
              Back
            </Button>
            <h2>Sign In</h2>
          </Box>

          <Box className={classes.logoContainer}>
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className={classes.logo}
              />
          </Box>

          {error && (
            <Alert severity="error" className={classes.alert}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{ username: '', password: '' }}
            validationSchema={SignInSchema}
            onSubmit={handleSignIn}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur, values }) => (
              <Form className={classes.form}>
                <TextField
                  variant="outlined"
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  type="text"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  margin="normal"
                />

                <TextField
                  variant="outlined"
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  margin="normal"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <CircularProgress size={24} /> : 'Sign In'}
                </Button>
              </Form>
            )}
          </Formik>

          <Box className={classes.dividerContainer}>
            <Divider className={classes.dividerLine} />
            <Typography className={classes.dividerText}>
              OR
            </Typography>
            <Divider className={classes.dividerLine} />
          </Box>

          <Box className={classes.socialLoginContainer}>
              <GoogleLogin
                clientId="873030555216-cqldesg27nih66kbcmg6bp3135rokd4q.apps.googleusercontent.com"
                render={renderProps => (
                  <GoogleLoginButton
                    onClick={renderProps.onClick}
                    disabled={renderProps.disabled}
                    className="social-login-button" 
                    style={{ width: '100%', maxWidth: '450px'}}
                  >
                    Sign in with Google
                  </GoogleLoginButton>
                )}
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
              />
          </Box>
          <Box className={classes.socialLoginContainer}>
              <FacebookLogin
                  appId="551369100776958"
                  autoLoad={false}
                  fields="name,email,picture"
                  callback={handleFacebookSignIn}
                  render={renderProps => (
                    <FacebookLoginButton  className="social-login-button" 
                                           onClick={renderProps.onClick}
                                           style={{ width: '100%' , maxWidth: '450px'}}>
                      Sign in with Facebook
                    </FacebookLoginButton>
                  )}
                />
          </Box>

          <Box mt={3} textAlign="center">
            <Link to="/forgot-password" className="link">
              Forgot Password?
            </Link>
          </Box>

          <Box mt={2} textAlign="center">
            Don't have an account?{' '}
            <Link to="/signup" className="link">
              Create one now
            </Link>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
