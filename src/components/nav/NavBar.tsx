import React, {useEffect, useState} from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import {Button} from "react-bootstrap";
import { useAuth } from "react-oidc-context"
import {fetchConfigurationNames} from "../../api/APIConfiguration";
import {useQuery} from "react-query";
import Form from 'react-bootstrap/Form';
import {useNavigate} from "react-router-dom";
import {Spinner} from 'react-bootstrap';
import "./style.css"

import {
    getConfigurationNameFromLocalstorage,
    saveConfigurationNameToLocalstorage
} from "../helperFunctions/ConfigurationSelectEvent";

const NavBar = () => {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [selectedConfiguration, setSelectedConfiguration] = useState<string | undefined>(getConfigurationNameFromLocalstorage());
    const [configurationNames, setNames] = useState<string []>([]);
    const [configurationIds, setIds] = useState<string []>([]);
    const [userName, setUserName] = useState("");
    const [loadingConfigurations, setLoadingConfigurations] = useState(true);
    const [loadingUserInfo, setLoadingUserInfo] = useState(true);
    const authenticated = useAuth();
    const navigate = useNavigate();
    const createOptions = () => {
        let configurationId: string | undefined = getConfigurationNameFromLocalstorage();
        const options = configurationNames.map((configurationName, index) => {
            if (!configurationId) {
                saveConfigurationNameToLocalstorage(configurationIds[index]);
                configurationId = configurationIds[index];
            }
            return <option key={index} value={configurationIds[index]}>{configurationName}</option>
        });
        return (
            <div className="d-flex align-items-center">
                <Form.Select
                    aria-label="Default select example"
                    onChange={(event) => {
                        setSelectedConfiguration(event.target.value);
                        saveConfigurationNameToLocalstorage(event.target.value);
                        window.dispatchEvent(new Event("configuration_changed"));
                    }}
                    value={selectedConfiguration}
                    className="ms-2 custom-select"
                    style={{maxWidth: "100%"}}
                >
                    {options}
                </Form.Select>
            </div>
        );

    }

    useEffect(() => {
        window.addEventListener('configuration_add',(event:any) => {
            event.preventDefault();
            refetch().then(() => {
                setSelectedConfiguration(event.id);
                saveConfigurationNameToLocalstorage(event.id);
            });
        })
    },[])

    // fetch configuration names from server to be rendered in select
    const fetchConfigurationName = async () => {
        let token = authenticated?.user?.access_token;
        if (!token) token = "";

        const response = await fetchConfigurationNames(userName, token);
        console.log(response);
        if (response.redirect) {
            navigate(response.redirect);
            return;
        } else {
            setLoadingConfigurations(false);
            return response.response;
        }
    }

    //read username from localstorage - only invoked when username is authed.
    const fetchUserName = () => {
        const userName = authenticated?.user?.profile?.preferred_username;

        setLoadingUserInfo(false);

        if (userName) {
            setUserName(userName);
        }
    }


    const {data, status, refetch, isFetching} = useQuery(
        "configuration_names", fetchConfigurationName,
        {
        refetchOnWindowFocus: false,
        enabled: !!userName
    });

    const isUser = (): boolean => {
        const user = authenticated.user;

        // Check if user is defined and not null or undefined
        if (user) {
            console.log("true");
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


    useEffect(() => {
        // user is not logged in, do nothing
        if (!data) {
            setAuthenticated(false);
            setLoadingConfigurations(false);
            setLoadingUserInfo(false);
            return;
        }

        const responseData = data.data as { message: string, configuration_names: string[], configuration_ids: string[] };
        const configurationNames: string[] = responseData.configuration_names || [];
        const configurationIds: string[] = responseData.configuration_ids || [];
        setNames(configurationNames);
        setIds(configurationIds);
        setLoadingConfigurations(false);  // Set loading to false when configurations are loaded
    }, [data]);


    return (
        <Navbar expand="lg" className="bg-opacity-75 bg-dark text-white">
            <Container fluid>
                <Navbar.Brand href="/"> <i className={"fas fa-chevron-left"}/>{" SPADe Software "} <i
                    className={"fas fa-chevron-right"}/></Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                <Navbar.Collapse id="responsive-navbar-nav text-white">
                    <Nav className="me-auto text-white">
                        <Nav.Link href="/test" className="text-white">Test</Nav.Link>
                        <Nav.Link href="/detect" className="text-white">Detect</Nav.Link>
                        <Nav.Link href="/configuration" className="text-white">Configuration</Nav.Link>
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
                    </Nav>
                    {
                        data && isAuthenticated ?
                            (
                                <>
                                    {loadingConfigurations &&
                                        <div className="d-flex justify-content-center align-items-center">
                                            <Spinner animation="border" variant="primary"/>
                                        </div>
                                    }
                                    {configurationNames.length > 0 && (
                                        <>
                                        {createOptions()}
                                        <span style={{marginRight: "1em", marginLeft: "1em"}}>
                                            <i className={"fa fa-user"} style={{color: "red"}}/> {userName}
                                        </span>
                                        </>
                                    )}
                                    <Button
                                        onClick={() => authenticated.signoutRedirect()}
                                    >
                                        Logout
                                    </Button>
                                </>
                            )
                            : (
                                <Nav.Link href="/login">Sign in</Nav.Link>
                            )
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
