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
import { PrivateRoute } from './components/helperFunctions/PrivateRoute';
import {RequireAuth} from "react-auth-kit";
//<PrivateRoute component={Detect}/>
//TODO logout
const App = () => {


    return (

        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/about' element=
                    {
                    <RequireAuth loginPath={"/login"}>
                        <About/>
                    </RequireAuth>
                }
                />
                <Route path="/detect" element={<Detect/>}/>
                <Route path='/configuration' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Configuration/>
                        </RequireAuth>
                }
                />

                <Route path="/logout" Component={Logout}/>
                <Route path='/login' element={<LoginComponent/>}/>

            </Routes>
        </Router>


    );
};


export default App;
