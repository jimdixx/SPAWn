import React, {useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {useIsAuthenticated} from "react-auth-kit";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {fetchConfigurationNames} from "../../api/APIConfiguration";
import {useQuery} from "react-query";
import Form from 'react-bootstrap/Form';
import {useNavigate} from "react-router-dom";
import {
    getConfigurationNameFromLocalstorage,
    saveConfigurationNameToLocalstorage
} from "../helperFunctions/ConfigurationSelectEvent";

const NavBar = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [selectedConfiguration, setSelectedConfiguration] = useState<string|undefined>(getConfigurationNameFromLocalstorage());
    const [configurationNames,setNames] = useState<string []>([]);
    const [userName, setUserName] = useState("");
    const authenticated = useIsAuthenticated();

    useEffect(()=>{
        const isAuthed = authenticated();
        setAuthenticated(isAuthed);
        if(isAuthed)
            fetchUserName();
        else setUserName("");
    },[authenticated, isAuthenticated])


    useEffect(() => {
        //user is not logged in, do nothing
        if(!data) {
            return;
        }
        const responseData = data.data as {message:string, configuration_names:string[]};
        const configurationNames:string[] = responseData.configuration_names;
        setNames(configurationNames);
    },[data]);




    return (
        <Navbar expand="lg" className="bg-opacity-75 bg-dark text-white">
            <Container fluid>
                <Navbar.Brand href="/"> <i className={"fas fa-chevron-left"} />{" SPADe Software "} <i className={"fas fa-chevron-right"} /></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto text-white">
                        <Nav.Link href="/detect" className="text-white">Detect</Nav.Link>
                        <Nav.Link href="/configuration" className="text-white">Configuration</Nav.Link>
                        <Nav.Link href="/about" className="text-white">About</Nav.Link>
                    </Nav>
                    {
                        isAuthenticated?
                                <>
                                    {configurationNames.length && createOptions()}
                                <span>{userName}</span>
                                <Nav.Link href="/logout">Logout</Nav.Link>
                                </>
                            :
                            <Nav.Link href="/login">Sign in</Nav.Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;