import React, {useEffect, useState} from 'react';
import NavBar from "./components/nav/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import Configuration from "./pages/configuration/Configuration";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import LoginComponent from "./components/loginForm/LoginComponent";
import {PrivateRoute} from './components/helperFunctions/PrivateRoute';
import {RequireAuth} from "react-auth-kit";
import Footer from "./components/footer/CustomFooter";
import Login from "./pages/Login";
import Results from "./pages/Results";
import NotFound from "./pages/error_pages/404";
import Forbidden from "./pages/error_pages/403";
import InternalServerError from "./pages/error_pages/500";
import Signpost from "./pages/manage/Signpost";
import Project from "./pages/manage/Projects";
import Person from "./pages/manage/Person";
import Enums from "./pages/manage/Enums";
import Categories from "./pages/manage/Categories";
import Iterations from "./pages/manage/Iterations";
import Activities from "./pages/manage/Activities";
import Release from "./pages/manage/Release";

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
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
                <Route path="/results" element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Results />
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

                <Route path='/signpost' element={ <Signpost /> }/>

                <Route path='/project' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <DndProvider backend={HTML5Backend}>
                                <Project />
                            </DndProvider>
                        </RequireAuth>
                    }
                />

                <Route path='/person' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Person />
                        </RequireAuth>
                    }
                />

                <Route path='/enums' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Enums />
                        </RequireAuth>
                    }
                />

                <Route path='/categories' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Categories />
                        </RequireAuth>
                    }
                />

                <Route path='/iterations' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Iterations />
                        </RequireAuth>
                    }
                />

                <Route path='/activities' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Activities />
                        </RequireAuth>
                    }
                />

                <Route path='/release' element=
                    {
                        <RequireAuth loginPath={"/login"}>
                            <Release />
                        </RequireAuth>
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
