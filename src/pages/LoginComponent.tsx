import React, {useRef, useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import AuthContext from "../context/AuthProvider";

import axios from '../api/axios';

const LOGIN_URL = '/user/login';

const LoginComponent = () => {
    const { setAuth } = useContext(AuthContext);

    const userRef = useRef<any>();
    const errRef = useRef<any>();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({ name: user, password: pwd}), {
                    headers: { 'Content-Type': 'application/json'},
                    withCredentials: true
                });
            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.jwtToken;
            // setAuth({ user, pwd, accessToken})

            const data = {
                name: user,
                jwtToken: accessToken
            };

            localStorage.setItem("user", JSON.stringify(data));

            setUser('');
            setPwd('');
            setSuccess(true);
        } catch (error: any) {
            if (!error?.reponse) {
                setErrMsg('No Server Response');
            } else if (error.response?.status === 400) {
                setErrMsg('Missing Username or Password');
            } else if (error.response?.status === 401) {
                setErrMsg('Unauthorized');
            } else {
                setErrMsg('Login Failed');
            }
            errRef.current.focus();
        }

    }

    return (
        <>
            {success ? (
                    <section>
                        <h1>You are logged in!</h1>
                        <br />
                        <p>
                            jdi do prčič.
                        </p>
                    </section>
                ) : (
                <section>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live={"assertive"}>{errMsg}</p>
                    <h1>Sign in</h1>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            ref={userRef}
                            autoComplete={"off"}
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                        />
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                        />
                        <button>Sign In</button>
                    </form>
                    <p>
                        Need an Account? <br/>
                        <span className="line">
                    <Link to="/signup">Sign Up</Link>
                </span>
                    </p>
                </section>
                )
            }
        </>
    );

}

export default LoginComponent;