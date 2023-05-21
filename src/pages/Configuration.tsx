import React, {useEffect, useState} from 'react';
import {useQuery} from "react-query";
import {fetchConfigurations} from "../api/APIConfiguration";
import {retrieveUsernameFromStorage} from "../context/LocalStorageManager";
import {useNavigate} from "react-router-dom";

const Configuration = () => {
    const navigate = useNavigate();
    const fetchConfiguration = async () => {
        const userName = retrieveUsernameFromStorage();
        const response = await fetchConfigurations(userName);
        if(response.redirect) {
            navigate(response.redirect);
        }
        else {
            return response.response;
        }
    }

    const {data, status} = useQuery("configurations",fetchConfiguration,{ refetchOnWindowFocus: false});


    return (
        <div>
            {status === "error" && <p>error</p>}
            {status === "loading" && <p>vykresli kolecko z bootstrapu</p>}
            {status === "success" && <p>nacteno</p>}
            <h1>CONFIGURATION PAGE</h1>
        </div>
    );
    
};

export default Configuration;