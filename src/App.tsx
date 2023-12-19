import React from 'react';
import NavBar from "./components/nav/NavBar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import About from "./pages/About";
import Detect from "./pages/Detect";
import Configuration from "./pages/configuration/Configuration";
import MainPage from "./pages/MainPage";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
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
import OAuth2PrivateRoute from './context/OAuth2PrivateRoute';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Test from "./pages/Test";
//TODO logout
const App = () => {


    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={ <MainPage /> } />
                <Route path="/about" element={ <About /> } />
                <Route path="/detect" element={ <OAuth2PrivateRoute><Detect /></OAuth2PrivateRoute> }/>
                <Route path="/results" element={ <OAuth2PrivateRoute><Results /></OAuth2PrivateRoute> }/>
                <Route path="/configuration" element={ <OAuth2PrivateRoute><Configuration /></OAuth2PrivateRoute> } />
                <Route path="/signpost" element={ <OAuth2PrivateRoute><Signpost /></OAuth2PrivateRoute> } />
                <Route path="/project" element={ <OAuth2PrivateRoute><DndProvider backend={ HTML5Backend }><Project /></DndProvider></OAuth2PrivateRoute> }/>
                <Route path="/person" element={<OAuth2PrivateRoute><Person /></OAuth2PrivateRoute>} />
                <Route path="/enums" element={<OAuth2PrivateRoute><Enums /></OAuth2PrivateRoute>} />
                <Route path="/categories" element={<OAuth2PrivateRoute><Categories /></OAuth2PrivateRoute>} />
                <Route path="/iterations" element={<OAuth2PrivateRoute><Iterations /></OAuth2PrivateRoute>} />
                <Route path="/activities" element={<OAuth2PrivateRoute><Activities /></OAuth2PrivateRoute>} />
                <Route path="/release" element={<OAuth2PrivateRoute><Release /></OAuth2PrivateRoute>} />
                <Route path="/logout" element={<Logout redirect={true} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/403" element={<Forbidden />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="/500" element={<InternalServerError />} />

                <Route path="/test" element={<OAuth2PrivateRoute><Test /></OAuth2PrivateRoute>} />

            </Routes>
            <Footer />
        </Router>
    );
};


export default App;
