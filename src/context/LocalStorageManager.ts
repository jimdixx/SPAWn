import {axiosPrivate} from "../api/axios";
import {AxiosInstance, AxiosResponse} from "axios";
import jwt_decode from "jwt-decode";

const TOKEN_URL = "/user/refresh";

    const saveToLocalStorage = (key:string,value:string) => {
        localStorage.setItem(key,value);
    }

    const saveNewToken = (token:string)=> {
        let userInfo:string|null = retrieveFromLocalStorage("user_info");
        if(userInfo == null) {
            return null;
        }
        let userInfoParsed = JSON.parse(userInfo);
        userInfoParsed.jwt = token;
        saveUserInfoToStorage(JSON.stringify(userInfoParsed));

    }

    const parseJwtToken = (token:string) => {
        return jwt_decode(token);
    }

    const getTokenExpirationTime = (responseJWT:string)=> {
        const parsedJWT:any = parseJwtToken(responseJWT);
        //const expirationTimeSec = parsedJWT.exp - parsedJWT.iat;
        return parsedJWT.exp * 1_000;
    }

    const getTokenIatTime = (responseJWT:string)=> {
        const parsedJWT:any = parseJwtToken(responseJWT);
        //const expirationTimeSec = parsedJWT.exp - parsedJWT.iat;
        return parsedJWT.iat * 1_000;
    }


    const retrieveFromLocalStorage = (key:string) => {
        return localStorage.getItem(key);
    }

    const isTokenValid = (userToken:string) => {
        const time = Date.now();
        const tokenExpTime = getTokenExpirationTime(userToken);
        const tokenIatTime = getTokenIatTime(userToken);
        const timeRemaining = tokenExpTime - time;
        // token life is greater than half of the lifespan of token, user is considered to be logged in
        // user has a lot of time to do some action to get refreshed token
        if(timeRemaining > ((tokenExpTime - tokenIatTime) / 2)) {
            return true;
        }
        return false;
    }


    export const hasUserToken = () => {
        const userToken: string = retrieveJwtToken();
        //user is not logged in
        if(userToken == null) {
            return false;
        }
       return isTokenValid(userToken);
    }

    //refresh token after @param timeOut ms passed
    export const isUserLoggedIn = async () => {
        const userToken: string = retrieveJwtToken();
        //user is not logged in
        if(userToken == null) {
            return false;
        }
        if(!isTokenValid(userToken)) {
            return await refreshToken();
        }

        return true;
    }

    const refreshToken = async ()=>{
    //token is still valid but is about to expire - refresh it
        const el: AxiosInstance | null = axiosPrivate();
        //server fault, we are all going to die here
        if (el == null) {
            return false;
        }
        //get new token from server and save hin into local storage
        const response: AxiosResponse = await el?.get(TOKEN_URL);
        const responseJWT: string = response.data.jwtToken;
        saveNewToken(responseJWT);
        return true;

    }


    export const saveUserInfoToStorage = (value:string) => {
        if(value == null) {
            return null;
        }
        saveToLocalStorage("user_info",value);
    }

    export const retrieveJwtToken =  () => {
        const jsonInfo = retrieveFromLocalStorage("user_info");
        //no user info exists in local storage
        //user is not logged in
        if(jsonInfo == null) {
            return null;
        }
        const userInfo = JSON.parse(jsonInfo);
        return userInfo.jwt;
    }