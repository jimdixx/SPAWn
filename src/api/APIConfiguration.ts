import axios from "./axios";
import { axiosPrivate } from "./axios";
import  { useNavigate } from 'react-router-dom';
import {AxiosResponse} from "axios";

const CONFIGURATION_URL = '/configuration/get_configuration';



const fetchConfigurations = async (username:string): Promise<{message:string; status:number;configurations:string[];}> =>{
    //response from server
    let message: string = "";
    //status code from server
    let status: number = 0;
    let configurations: string[] = [];
    let response;
    try {

        response = await axiosPrivate().post(CONFIGURATION_URL,
            JSON.stringify({name: username}), {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
        status = response.status;
        message = response.data.message;
        configurations = response.data.configurations;
    }
    catch (e: any) {
        const response = e.response;
        message = response.data.message;
        status = response.status;
    }

    return {message,status,configurations};
}



