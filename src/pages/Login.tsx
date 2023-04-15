import React from 'react';
import {Container} from "react-bootstrap";
import LoginComponent from "../components/loginForm/LoginComponent";

const Login = () => {

    return (
        <Container>
            <LoginComponent />
            <p>Not a member yet? <a href="/signup">Sign up now!</a> </p>
        </Container>
    );

};

export default Login;