import React, { useEffect } from 'react';
import {useSignOut,useIsAuthenticated} from "react-auth-kit";
import {logoutUser} from "../api/APILogout";
import {retrieveUsernameFromStorage,invalidateLocalStorage} from "../context/LocalStorageManager";
function Logout(props: {redirect: boolean}) {
    const isAuthenticated = useIsAuthenticated();
    const signOut = useSignOut();

    useEffect(()=>{
        const userName: string = retrieveUsernameFromStorage();
        if(isAuthenticated()){
            //no reason logout should ever fail for valid user that is logged in, therefore we don´t
            //have to wait for server response
            //if we ever have to wait for response, then this all needs to be moved to component
            logoutUser(userName);
            invalidateLocalStorage();
            signOut();
        }
        //ref back to root page
        if(props.redirect)
            window.location.href = '/';
    },[])

    return null;
}

export default Logout;