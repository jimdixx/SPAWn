import React, {useRef, useState, useEffect, useContext} from 'react';
import {Link} from "react-router-dom";
import {Container} from "react-bootstrap";
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
        const responseWrapper: {message:string; status:number; token:string} = await login(user,pwd);
        const accessToken:string = responseWrapper.token;
        const statusCode:number = responseWrapper.status;
        //login went well
        if(statusCode<400){
            signIn({
                token:accessToken,
                expiresIn: 3600,
                tokenType: "Bearer",
                authState: {userName:user}
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
            {success ? (
                    <Container>
                        <h1 style={{color:"green"}}><u>You are logged in! </u></h1>
                        <br />
                        <p>
                            jdi do prčič. hello world!
                        </p>
                    </Container>
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