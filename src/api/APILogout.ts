import {axiosPrivate} from "../api/axios";
import {AxiosInstance} from "axios";

const LOGOUT_URL = '/user/logout';
export const logoutUser = async (username:string)=>{
    if(!username)return false;
    const el: AxiosInstance | null = axiosPrivate(null);

    const response = el?.post(LOGOUT_URL,{name: username});
    console.log(response);
    /*
    const response = await axios.post(LOGOUT_URL,
            JSON.stringify({name: username} ), {
            headers: {'Content-Type': 'application/json'},
            withCredentials: true
    });*/
    return true;
}