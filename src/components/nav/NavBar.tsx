import React, {useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import {useIsAuthenticated} from "react-auth-kit";

/**
 * axios.create()
 * if null
 *    isLoggedIn = false
 * @constructor
 */


const NavBar = () => {
    const [isAuthenticated,setAuthenticated] = useState(false);
    const authenticated = useIsAuthenticated();

    useEffect(()=>{
        const isAuthed = authenticated();
        setAuthenticated(isAuthed);
    },[authenticated])
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
                            <Nav.Link href="/logout">Logout</Nav.Link>
                            :
                            <Nav.Link href="/login">Sign in</Nav.Link>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;