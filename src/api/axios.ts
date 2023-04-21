import axios from 'axios';
import {retrieveBearerCookie, retrieveJwtToken} from "../context/LocalStorageManager";
const BASE_URL = 'http://localhost:8080/v2';



export default axios.create({
   baseURL: BASE_URL
});

export const axiosPrivate = () => {
   //const token = retrieveJwtToken();
   const token = retrieveBearerCookie();
   if(token == null) {
      //non existent token
      //user must first log in
      return null;
   }
   return axios.create({
      baseURL: BASE_URL,
      headers: {'Content-Type': 'application/json', Authorization: `Bearer ${token}`},
      withCredentials: true
   });
}

