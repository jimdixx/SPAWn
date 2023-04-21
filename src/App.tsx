import React from 'react';
import NavBar from "./components/nav/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import Configuration from "./pages/Configuration";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import LoginComponent from "./components/loginForm/LoginComponent";
import { PrivateRoute } from './components/helperFunctions/PrivateRoute';
import {RequireAuth,useSignOut} from "react-auth-kit";
//<PrivateRoute component={Detect}/>
//TODO logout
const App = () => {
const signOut = useSignOut();
//TODO move router to child component
//render signout <a> if user is logged in
const logout = ()=>{
    //signout user - ie invalidate localstorage/cookies
    signOut();
}
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
                <Route path='/login' element={<LoginComponent/>}/>
                <Route path='/signup' element={<Signup/>}/>
            </Routes>
        </Router>
    );
};


export default App;
