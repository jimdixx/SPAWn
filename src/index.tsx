import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.css';

import '@fortawesome/fontawesome-free/css/all.min.css';
import {QueryClient, QueryClientProvider} from 'react-query'
import {AuthProvider} from "react-oidc-context";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);


const oidcConfig = {
    authority: "http://localhost:9080/auth/realms/spade",
    client_id: "spade-client",
    redirect_uri: "http://localhost:3000",
    onSigninCallback: () => {
        window.history.replaceState(
            {},
            document.title,
            window.location.pathname
        )
    }
}

root.render(
        <QueryClientProvider client={queryClient}>
            <AuthProvider {...oidcConfig}>
                <React.StrictMode>
                    <App/>
                </React.StrictMode>
            </AuthProvider>
        </QueryClientProvider>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
