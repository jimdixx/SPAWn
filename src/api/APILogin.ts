import axios from "./axios";
const LOGIN_URL = '/user/login';
export const login = async (username:string,password:string): Promise<{message:string; status:number; token:string}> =>{
    //response from server
    let message: string = "";
    //status code from server
    let status: number = 0;

    let token: string = "";
    let response;
    try {
        response = await axios.post(LOGIN_URL,
            JSON.stringify({name: username, password: password}), {
                headers: {'Content-Type': 'application/json'},
                withCredentials: true
            });
        token = response.data.jwtToken;
        status = response.status;
        message = response.data.message;
    }
    catch (e: any) {
        const response = e.response;
        message = response.data.message;
        status = response.status;
    }

    return {message,status,token};
}