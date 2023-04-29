import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';
//third party library that manages authentication
import {AuthProvider} from "react-auth-kit"

import '@fortawesome/fontawesome-free/css/all.min.css';


const initializeApp = async() =>{
    //[JT]
    //auth type can be cookie or localstorage
    //cookie is safer but localstorage can be used aswell
    root.render(
        <React.StrictMode>
            <AuthProvider
                authType={"cookie"}
                authName={"token"}
                cookieDomain={window.location.hostname}
                cookieSecure={false}
            >
                <App />
            </AuthProvider>
        </React.StrictMode>
    );
}




const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
initializeApp();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
