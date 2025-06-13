import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Reducer";
import {Provider} from 'react-redux';
import {Toaster} from 'react-hot-toast';

const store = configureStore({
  reducer:rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}>
      <Provider store={store}>
        <BrowserRouter>
          <Toaster/>
          <App/>
        </BrowserRouter>
      </Provider>
    </GoogleOAuthProvider>
);
