import React, {useEffect, useState} from 'react';
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
import {RequireAuth} from "react-auth-kit";
import Footer from "./components/footer/CustomFooter";
import Login from "./pages/Login";
//<PrivateRoute component={Detect}/>
//TODO logout
const App = () => {


    return (

        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path="/detect" element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Detect/>
                        </RequireAuth>
                    }
                />
                <Route path='/configuration' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Configuration/>
                        </RequireAuth>
                    }
                />

                <Route path="/logout" element={<Logout />}/>
                <Route path='/login' element={<Login/>}/>
                <Route path='/signup' element={<Signup/>}/>
            </Routes>
            <Footer />
        </Router>
    );
};


export default App;
