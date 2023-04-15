import {axiosPrivate} from "../api/axios";
import {AxiosInstance} from "axios";
import jwt_decode from "jwt-decode";

const TOKEN_URL = "/user/refresh";

const saveToLocalStorage = (key:string,value:string) => {
    localStorage.setItem(key,value);
}

//refresh token after @param timeOut ms passed
export const refreshToken = (timeOut:number) => {
    let userToken:string = retrieveJwtToken();

    setTimeout(async () => {
        const currentUserToken = retrieveJwtToken();
        if(currentUserToken !== userToken) {
            return;
        }
        // call refresh token axios request
        // refreshToken(1h)

        const el:AxiosInstance|null = axiosPrivate();
        //user does not have token
        //he must first log in
        if(el == null) {
            return;
        }
        const response = await el?.get(TOKEN_URL);
        //todo parse
        let responseJson:string = response.data.jwtToken;
        const parsedJWT:any = parseJwtToken(responseJson);

        const expirationDate = new Date(parsedJWT.exp * 1000);

        //saveNewToken(response);
        console.log(response);

        //TODO parse jwt token
        //refreshToken(100000000000);

    }, timeOut);


}

export const parseJwtToken = (token:string) => {
    return jwt_decode(token);
}

export const saveUserInfoToStorage = (value:string) => {
    if(value == null) {
        return null;
    }
    saveToLocalStorage("user_info",value);
}

const isUserInfoEmpty = () => {
    return retrieveFromLocalStorage("user_info") == null;
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
const retrieveFromLocalStorage = (key:string) => {
    const value = localStorage.getItem(key);
    return value;
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