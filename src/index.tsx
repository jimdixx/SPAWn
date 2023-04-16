import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.css';
import AuthProvider from "./context/AuthProvider";
import {isUserLoggedIn} from "././context/LocalStorageManager";


const initializeApp = async() =>{
    const isLogged:any = await isUserLoggedIn();
    if(!isLogged) {
        console.log("not logged in");
        //vykresli modalni formular
    }
    else
        console.log("logged in");
    root.render(
        <React.StrictMode>
            <AuthProvider>
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
