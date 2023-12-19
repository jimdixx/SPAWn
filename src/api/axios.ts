import axios, {AxiosInstance} from 'axios';
import {retrieveBearerCookie, retrieveJwtToken} from "../context/LocalStorageManager";
const BASE_URL = 'http://localhost:8080/v2';



export default axios.create({
   baseURL: BASE_URL
});


// if the user doesnt have token, we will create request w/o authorization header
const createUnauthorizedRequest = () => {
   const axiosObject:AxiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {'Content-Type': 'application/json'},
      withCredentials: true
   });
   return axiosObject;
}


//entry point for creating axios instances
//this 'function' SHOULD always be used when creating HTTP request
export const axiosPrivate = (token: string | null) => {
   //const token = retrieveJwtToken();
   //I dont have a token => my request will be created as unauthorized
   if(token == null || token === "") {
      return createUnauthorizedRequest();
   }
   //I have a token => I can have Authorization header in my request with bearer token
   const axiosObject:AxiosInstance = axios.create({
      baseURL: BASE_URL,
      headers: {'Content-Type': 'application/json',Authorization: `Bearer ${token}`},
      withCredentials: true
   });


   return axiosObject;
}

