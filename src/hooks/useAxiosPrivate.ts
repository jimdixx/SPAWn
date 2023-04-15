import { axiosPrivate } from "../api/axios";
import { useEffect, useState } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();
    const [tokenExpiration, setTokenExpiration] = useState<{
        timeoutId: NodeJS.Timeout;
        expirationTime: number;
    } | null>(null);

    useEffect(() => {
        if (auth) {
            // Calculate the time when the token will expire
            const expiration = new Date(auth.expiresAt).getTime();
            const currentTime = new Date().getTime();
            const timeUntilExpiration = expiration - currentTime;

            // Schedule a refresh token request approximately 1 minute before the token expires
            const timeoutId = setTimeout(async () => {
                console.log("Refresh token scheduled");
                const newAccessToken = await refresh();
                setAuth({
                    ...auth,
                    accessToken: newAccessToken,
                });
                setTokenExpiration(null);
                axiosPrivate.defaults.headers.common[
                    "Authorization"
                    ] = `Bearer ${newAccessToken}`;
            }, timeUntilExpiration - 60 * 1000);

            // Store the timeout ID and the token expiration time in state
            setTokenExpiration({
                timeoutId,
                expirationTime: expiration,
            });

            // Set the authorization header for the initial request
            axiosPrivate.defaults.headers.common[
                "Authorization"
                ] = `Bearer ${auth.accessToken}`;
        }

        return () => {
            // Cancel the scheduled refresh token request if the component is unmounted
            if (tokenExpiration) {
                clearTimeout(tokenExpiration.timeoutId);
            }
        };
    }, [auth, refresh, setAuth, tokenExpiration]);

    return axiosPrivate;
};

export default useAxiosPrivate;