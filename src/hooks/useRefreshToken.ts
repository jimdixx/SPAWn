import axios from "../api/axios"
import useAuth from "./useAuth"
import AuthContext from "../context/AuthProvider";
import {useContext} from "react";
const useRefreshToken = () => {

    const { auth } = useContext(AuthContext);
    const { setAuth } = useAuth();



    const refresh = async () => {

        const response = await axios.get('/user/refresh', {
            headers: { Authorization: `Bearer ${auth.accessToken}` },
            withCredentials: true
        });
        setAuth((prev: any) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.jwtToken);
            return { ...prev, jwtToken: response.data.jwtToken }
        });
        return response.data.jwtToken;
    }

    return refresh;

};
export default useRefreshToken;