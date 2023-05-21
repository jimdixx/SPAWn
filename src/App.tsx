import React, {useEffect, useState, Component, ReactComponentElement} from 'react';
import NavBar from "./components/nav/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import Configuration from "./pages/Configuration";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import LoginComponent from "./components/loginForm/LoginComponent";
import {PrivateRoute} from './components/helperFunctions/PrivateRoute';
import {RequireAuth,useIsAuthenticated} from "react-auth-kit";
import Footer from "./components/footer/CustomFooter";
import Login from "./pages/Login";
import Results from "./pages/Results";
import NotFound from "./pages/error_pages/404";
import Forbidden from "./pages/error_pages/403";
import InternalServerError from "./pages/error_pages/500";
import {Navigate} from "react-router-dom";
//<PrivateRoute component={Detect}/>
//TODO logout
const App = () => {
    //https://github.com/react-auth-kit/react-auth-kit/issues/1023
    const PrivateRoute = ({ Component }:any) => {
        const isAuthenticated = useIsAuthenticated();
        const auth = isAuthenticated();
        return auth ? <Component /> : <Navigate to="/login" />;
    };

    return (

        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path="/detect" element=
                    {
                        <PrivateRoute Component={Detect}/>
                        /*<RequireAuth loginPath={"/login"}>
                            <Detect/>
                        </RequireAuth>*/
                    }
                />
                <Route path="/results" element=
                    {
                        <PrivateRoute Component={Results}/>/*
                        <RequireAuth loginPath={"/login"}>
                            <Results />
                        </RequireAuth>*/
                    }
                />
                <Route path='/configuration' element=
                    {
                        <PrivateRoute Component={Configuration}/>/*
                        <RequireAuth loginPath={"/login"}>
                            <Configuration/>
                        </RequireAuth>*/
                    }
                />

                <Route path="/logout" element={<Logout redirect={true}/>}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>

                <Route path='/403' element={<Forbidden />}/>
                <Route path='/404' element={<NotFound />}/>
                <Route path='/500' element={<InternalServerError />}/>
            </Routes>
            <Footer />
        </Router>
    );
};


export default App;
