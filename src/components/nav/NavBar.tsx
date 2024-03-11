import React, {useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import {Button} from "react-bootstrap";
import { useAuth } from "react-oidc-context"

const NavBar = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const authenticated = useAuth();

    //read username from localstorage - only invoked when username is authed.
    const fetchUserName = () => {
        const userName = authenticated?.user?.profile?.preferred_username;

        if (userName) {
            setUserName(userName);
        }
    }


    const isUser = (): boolean => {
        const user = authenticated.user;

        // Check if user is defined and not null or undefined
        if (user) {
            return true;
        }

        return false;
    }

    useEffect(() => {
        const isAuthed = isUser();
        setAuthenticated(isAuthed);

        if (isAuthed) {
            fetchUserName();
        } else {
            setUserName("");
            setAuthenticated(false);
        }
    }, [authenticated, fetchUserName, isAuthenticated, isUser])

    return (
        <Navbar expand="lg" className="bg-opacity-75 bg-dark text-white">
            <Container fluid>
                <Navbar.Brand href="/"> <i className={"fas fa-chevron-left"}/>{" SPADe Software "} <i
                    className={"fas fa-chevron-right"}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav text-white">
                    <Nav className="me-auto text-white">
                        <Nav.Link href="/about" className="text-white">About</Nav.Link>
                        <NavDropdown title="Manage" id="collapsible-nav-dropdown" className="text-white" style={{
                            color: "white !important"
                        }}>
                            <NavDropdown.Item href="/project">Project</NavDropdown.Item>
                            <NavDropdown.Item href="/person">Person</NavDropdown.Item>
                            <NavDropdown.Item href="/enums">Enums</NavDropdown.Item>
                            <NavDropdown.Item href="/categories">Categories</NavDropdown.Item>
                            <NavDropdown.Item href="/iterations">Iterations and Phases</NavDropdown.Item>
                            <NavDropdown.Item href="/activities">Activities</NavDropdown.Item>
                            <NavDropdown.Item href="/release">Release</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/signpost">Signpost</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="/detecting" className="text-white">Anti-patterns</Nav.Link>
                    </Nav>
                    {
                        isAuthenticated ?
                            (
                                <>
                                    <span style={{marginRight: "1em", marginLeft: "1em"}}>
                                        <i className={"fa fa-user"} style={{color: "red"}}/> {userName}
                                    </span>
                                    <Button className="btn btn-secondary"
                                        onClick={() => authenticated.signoutRedirect()}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )
                            : (
                                <Button className="btn btn-secondary"
                                    onClick={() => authenticated.signinRedirect()}
                                >
                                    Sign in
                                </Button>
                            )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
