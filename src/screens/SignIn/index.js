import React, { useState, useEffect } from 'react';
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
  IconButton,
  InputLabel,
  FormControl,
  OutlinedInput
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

import FacebookLogin from 'react-facebook-login';
import { FacebookLoginButton,GoogleLoginButton } from 'react-social-login-buttons';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth  } from "react-oidc-context";
// import GoogleIcon from '@mui/icons-material/Google';  // Or your preferred Google icon
// import FacebookIcon from '@mui/icons-material/Facebook'; 



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
  const auth = useAuth();

  const IDENTITY_PROVIDERS = {
    GOOGLE: 'Google',
    FACEBOOK: 'Facebook'
  };

  useEffect(() => {
    // Parse the URL hash for tokens
    // console.log('SignIn component mounted');
    // console.log('Current URL:', window.location.href);

    const hash = window.location.hash;
    const isRedirect = hash && hash.includes('access_token');

    if (!isRedirect && !sessionStorage.getItem('loginAttempted')) {
      localStorage.clear();
      sessionStorage.clear();
     }

    if (isRedirect) {
      sessionStorage.removeItem('loginAttempted');
    }

    if (hash) {
      // Extract tokens from URL hash
      const tokens = hash.substring(1).split('&').reduce((result, item) => {
        const parts = item.split('=');
        result[parts[0]] = parts[1];
        return result;
      }, {});
      
      // console.log('tokens',tokens)

      if (tokens.access_token) {
        localStorage.setItem('accessToken', tokens.access_token);
        
        // Clear the URL hash
        window.location.hash = '';
        
        dispatch(setUserDetails());
        replace('/');
      }
    }
  }, []);

  const signOut= () => {
    const clientId = "45v61q97j0kbt5j8v84muqfv6e";
    const logoutUri = "https://localhost:3000/signin";
    const cognitoDomain = "https://eu-north-1o3prs94nj.auth.eu-north-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  const handleClickShowPassword = () => {
    console.log('toggling show password')
    console.log(!showPassword)
    setShowPassword(!showPassword);
  };
  
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleCognitoLogin = (provider) => {
      // Cognito hosted UI URL with Facebook as identity provider
      sessionStorage.setItem('loginAttempted', 'true');

      console.log(provider)
      const cognitoUrl = 'https://eu-north-1o3prs94nj.auth.eu-north-1.amazoncognito.com/oauth2/authorize';
      const params = {
        identity_provider: provider,
        response_type: 'token',
        client_id: '45v61q97j0kbt5j8v84muqfv6e',
        redirect_uri: 'http://localhost:3000/',
        scope: 'aws.cognito.signin.user.admin openid profile email'
      };
  
      // Build the URL with query parameters
      const queryString = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      
      // Redirect to Cognito hosted UI
      window.location.href = `${cognitoUrl}?${queryString}`;
      console.log('redirect successful after login')
    };
  

  const handleSignIn = async (values, { setSubmitting }) => {
    try {
      setError(null);
      const { username, password } = values;
      //http://localhost:5001/users/login
      const { statusCode, data } = await Api.postRequest('/users/login', {
        username,
        password,
      });

      console.log(data)

      if (statusCode === 400 || statusCode === 500 || statusCode === 403) {
        setError(data);
        return;
      }
      const { access_token } = data;
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
                  // variant="outlined"
                  fullWidth
                  id="username"
                  name="username"
                  label="Username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  margin="normal"
                />
        

                <TextField 
                  // variant="outlined"
                  fullWidth
                  id="password"
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={values.password}
                  onChange={handleChange}
                  // onBlur={handleBlur}
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
                          {showPassword ? <Visibility /> : <VisibilityOff />}
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
            {/* <Typography className={classes.dividerText}>
              OR
            </Typography> */}
            <Divider className={classes.dividerLine} />
          </Box>

          {/* <div>
            <button onClick={() => auth.signinRedirect()}>Sign in</button>
            <button onClick={() => signOutRedirect()}>Sign out</button>
          </div> */}

          <Box className={classes.socialLoginContainer}>
            <GoogleLoginButton
              className="socialLoginButton googleButton"
              onClick={() => handleCognitoLogin(IDENTITY_PROVIDERS.GOOGLE)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:'32px'
              }}
            >
              <span style={{ flex: 1, textAlign: 'center' }}>Sign in with Google</span>
            </GoogleLoginButton>
          </Box>
          <Box className={classes.socialLoginContainer}>
            <FacebookLoginButton
              className="socialLoginButton facebookButton"
              onClick={() => handleCognitoLogin(IDENTITY_PROVIDERS.FACEBOOK)}
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height:'32px',
                backgroundColor: '#1877f2'
              }}
            >
              <span style={{ flex: 1, textAlign: 'center' }}>Sign in with Facebook</span>
            </FacebookLoginButton>
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
