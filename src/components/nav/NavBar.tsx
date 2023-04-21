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
    })
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/detect">Detect</Nav.Link>
                        <Nav.Link href="/configuration">Configuration</Nav.Link>
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