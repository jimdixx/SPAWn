import React, {useEffect, useState} from "react";
import {Form, Button, Alert} from "react-bootstrap";
import login from "./LoginFormRequests";
import {isEmpty} from "../helperFunctions/stringUtility"
import { useNavigate } from 'react-router-dom';
import AlertComponent from "../alerts/AlertComponent";

const LoginForm = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState({
        status: 200,
        jwtToken: "",
        msg: ""
    });

    useEffect(() => {

        if (!isEmpty(data.jwtToken)) {
            navigate('/', {replace: true})
        }

    }, [navigate, data.jwtToken]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();



        const url = "http://localhost:8080/v2/user/login";

        const loginData = {
            name: username,
            password: password
        }

        let response = login(url, loginData);
        response
            .then((result) => {
                setData(result);
            })
            .catch((error) => setError(error))
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
            {data.status !== 200 ? <AlertComponent type='danger' message={data.msg} /> : <></>}
        </Form>
    );
};

export default LoginForm;