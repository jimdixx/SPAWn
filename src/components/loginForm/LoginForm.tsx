import React, {useState} from "react";
import {Form, Button} from "react-bootstrap";
import login from "./LoginFormRequests";


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [data, setData] = useState({
        status: 0,
        jwtToken: "",
        msg: ""
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const url = "http://localhost:8080/v2/user/login";

        const data = {
            name: username,
            password: password
        }

        let response = login(url, data);
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
        </Form>
    );
};

export default LoginForm;