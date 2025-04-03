import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
  logoContainer: {
    textAlign: 'center',
  },
  logo: {
    width: '120px',
    height: 'auto',
    marginBottom: theme.spacing(1)
  },
  form: {
    width: '100%'
  },
  socialLoginContainer:{
    width:'100%',
    padding: '0 16px',
    marginBottom: theme.spacing(2),
    '& button': {  
      width: '100% !important',  
      height: '40px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '& div': {  
      width: '100%',
    }
  },
  socialButton: {
    width: '100% !important',
    maxWidth: 'none !important',
    margin: '8px 0 !important',
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
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
  socialIcon: {
    width: '40px',
    height: '40px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)'
    }
  }
}));
