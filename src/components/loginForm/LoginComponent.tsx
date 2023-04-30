import React, {useRef, useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import {Alert, Button, Col, Container, Form} from "react-bootstrap";
import {login} from "../../api/APILogin";
import {useSignIn} from "react-auth-kit";
import {saveUserInfoToStorage} from "../../context/LocalStorageManager";

const LoginComponent = () => {
    const userRef = useRef<any>();
    const errRef = useRef<any>();
    const signIn = useSignIn();
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    //TODO nekdy hazi uplne mega spiralu erroru
    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        //send login request to server
        //todo define custom interface for return type
        //todo i am very lazy to do that
        const responseWrapper: { message: string; status: number; token: string } = await login(user, pwd);
        const accessToken: string = responseWrapper.token;
        const statusCode: number = responseWrapper.status;
        //login went well
        if (statusCode < 400) {
            signIn({
                token: accessToken,
                expiresIn: 10,
                tokenType: "Bearer",
                authState: {userName: user}
            });
            const dataToStore = {userName: user};
            //store user date in memory for further use
            saveUserInfoToStorage(JSON.stringify(dataToStore));
            setUser('');
            setPwd('');
            setSuccess(true);
            return;
        }
        //something went terribly wrong
        setErrMsg(responseWrapper.message);
        errRef.current.focus();
    }

    return (
        <>

            {errMsg && (
                <Alert variant="danger" className="my-3">
                    {errMsg}
                </Alert>
            )}

            {success ? (
                <Container>
                    <h1 style={{color: "green", textAlign: "center"}}>
                        <u>You are logged in! </u>
                    </h1>
                </Container>
            ) : (
                <Container>
                    <h1 style={{textAlign: "center"}}>Sign in</h1>
                    <Form onSubmit={handleSubmit}>
                        <Col md={{span: 6, offset: 3}}>
                            <Form.Group controlId="formUsername">
                                <Form.Label>Username:</Form.Label>
                                <Form.Control
                                    type="text"
                                    ref={userRef}
                                    autoComplete="off"
                                    onChange={(e) => setUser(e.target.value)}
                                    value={user}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control
                                    type="password"
                                    onChange={(e) => setPwd(e.target.value)}
                                    value={pwd}
                                    required
                                />
                            </Form.Group>

                            <Button type="submit" style={{marginTop: "1em"}}>Sign In</Button>

                            <p>Need an Account? <br/>
                                <span className="line">
                                    <Link to="/signup">Sign Up</Link>
                                </span>
                            </p>
                        </Col>
                    </Form>
                </Container>
            )}
        </>
    );

}

export default LoginComponent;