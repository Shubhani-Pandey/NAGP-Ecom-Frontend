import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import store from "./redux/store";
import { AuthProvider } from "react-oidc-context";

// const cognitoAuthConfig = {
//   authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_7IM3lJU4T",
//   client_id: "7fuk2g86cq43ctmpkgauganm3v",
//   redirect_uri: "https://www.nagpecom.click/",
//   response_type: "code",
//   scope: "email openid phone profile",
// };

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      {/* <AuthProvider {...cognitoAuthConfig}> */}
        <App />
      {/* </AuthProvider> */}
    </React.StrictMode>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
