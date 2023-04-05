import React, {ChangeEvent, useState} from "react";
import {Form, Button} from "react-bootstrap";
import {validateEmail, validatePassword} from "../helperFunctions/signupFormValidator";
import SignupFormRequests from "./SignupFormRequests";
import postData from "./SignupFormRequests";
const SignupForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRepeat, setPasswordRepeat] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(true);
    const [passwordMatches, setPasswordMatches] = useState(true);
    const [status, setStatus] = useState("");
    const [error, setError] = useState(null);



    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {

        const url = "http://localhost:8080/v2/user/register";

        e.preventDefault();
        if (validatePassword(password, passwordRepeat) && validateEmail(email)) {
            // TODO validovat / nevalidovat?

            const data = {
                name: username,
                email: email,
                password: password
            }

            let response = postData(url, data);
            response
                .then((result) => {
                    setStatus(result.data.message);
                })
                .catch((error) => {
                    setStatus("An error has occurred");
                })

        }
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setEmail(value);
        if (value.trim() === "" || validateEmail(value)) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
        console.log(value);
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPassword(value);
        console.log(value);
    }

    const handlePasswordRepeatChange = (event: ChangeEvent<HTMLInputElement>) => {
        const {value} = event.target;
        setPasswordRepeat(value);
        if (value !== "") {
            let passwordValid = validatePassword(password, value);
            setPasswordMatches(passwordValid);
        } else {
            setPasswordMatches(true);
        }
    }

    const emailStyle = {
        backgroundColor: isEmailValid ? "white" : "red"
    };

    const passwordStyle = {
        backgroundColor: passwordMatches ? "white" : "red"
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

            <Form.Group controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={handleEmailChange}
                    style={emailStyle}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePasswordChange}
                />
            </Form.Group>

            <Form.Group controlId="formBasicPasswordRepeat">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password Again"
                    value={passwordRepeat}
                    onChange={handlePasswordRepeatChange}
                    style={passwordStyle}
                />
            </Form.Group>

            <Button variant="primary" type="submit">
                Submit
            </Button>
            {status === "" ? "" : status}
        </Form>
    );
};

export default SignupForm;