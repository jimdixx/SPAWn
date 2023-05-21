import React, {useRef, useState, useEffect} from 'react';
import {Link, useNavigate} from "react-router-dom";
import {Alert, Button, Col, Container, Form} from "react-bootstrap";
import {login} from "../../api/APILogin";
import {useSignIn} from "react-auth-kit";
import {saveUserInfoToStorage} from "../../context/LocalStorageManager";
import Logout from "../../pages/Logout";
import jwt, {JwtPayload} from "jwt-decode";
import jwtDecode from "jwt-decode";

const LoginComponent = () => {
    const userRef = useRef<any>();
    const errRef = useRef<any>();
    const signIn = useSignIn();
    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    // useEffect(() => {
    //     // in case user gets 400, 401, ... from spade so the token is not valid anymore.
    //     Logout(false);
    // }, []);

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

            const token = jwt<JwtPayload>(accessToken);
            if (!token.exp) {
                navigate("/500");
                return;
            }

            const currTime = Math.floor(Date.now() / 1000);
            const expTime = token.exp;
            const expTimeMinutes = Math.floor((expTime - currTime) / 60);

            signIn({
                token: accessToken,
                expiresIn: expTimeMinutes,
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
        console.log("Jsem tady");
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