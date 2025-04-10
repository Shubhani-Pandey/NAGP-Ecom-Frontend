import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  logoContainer: {
    textAlign: 'center',
  },
  logo: {
    width: '90px',
    height: 'auto',
    marginBottom: theme.spacing(1)
  },
  form: {
    width: '100%'
  },
  socialLoginButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  socialLoginContainer:{
    width:'100% !important',
    padding: '0 0px',
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(1),
    '& button': {  
      width: '100% !important',  
      height: '30px',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: '#1877f2 !important',
  },
  alert: {
    marginBottom: theme.spacing(2)
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  dividerContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: theme.spacing(3, 0),
  },
  dividerLine: {
    flex: 1,
  },
  dividerText: {
    margin: theme.spacing(0, 2),
    color: theme.palette.text.secondary,
  },
}));
