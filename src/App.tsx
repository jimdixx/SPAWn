import React from 'react';
import NavBar from "./components/nav/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import Configuration from "./pages/Configuration";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import LoginComponent from "./pages/LoginComponent";

const App = () => {

    return (
        <Router>
            <NavBar/>
            <Routes>
                <Route path='/' element={<MainPage/>}/>
                <Route path='/about' element={<About/>}/>
                <Route path='/detect' element={<Detect/>}/>
                <Route path='/configuration' element={<Configuration/>}/>
                <Route path='/login' element={<LoginComponent/>}/>
                <Route path='/signup' element={<Signup/>}/>
            </Routes>
        </Router>
    );
};


export default App;
