import React from 'react';
import LoginForm from "../components/loginForm/LoginForm";
import {Container} from "react-bootstrap";

const Login = () => {

    return (
        <Container>
            <LoginForm />
            <p>Not a member yet? <a href="/signup">Sign up now!</a> </p>
        </Container>
    );

};

export default Login;