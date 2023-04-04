import React from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form'

const NavBar = () => {
    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/about">About</Nav.Link>
                        <Nav.Link href="/detect">Detect</Nav.Link>
                        <Nav.Link href="/configuration">Configuration</Nav.Link>
                    </Nav>
                    <Nav.Link href="/auth">Sign in</Nav.Link>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;