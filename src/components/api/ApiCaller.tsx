import { AxiosResponse } from "axios";
import { axiosPrivate } from "../../api/axios";

export enum HTTP_METHOD {
    "POST",
    "GET"
}

const doApiCall = async (data: {}, url: string, httpMethod: HTTP_METHOD) => {
    switch (httpMethod) {
        case HTTP_METHOD.POST:
            return await axiosPrivate().post(url, data);
        case HTTP_METHOD.GET:
            return await axiosPrivate().get(url);
    }
}

function handleResponse(result: AxiosResponse): boolean {
    if (!result) throw new Error("Unexpected api call error");

    const statusCode = result.status;

    switch (statusCode) {
        case 400:
            //bad request
            return false;
        case 401:
            //unauthenticated request => token is invalid
            return true;
        case 403:
            //unauthorized request
            return false;
        case 404:
            //resource not found
            return false;
        case 500:
            //internal server error
            return false;
    }

    return false;
}

export interface API_RESPONSE {
    authenticated: boolean,
    redirect?: string,
    response: {
        status:number,
        data?: {}
    }
}

const doCall = async (data: {}, url: string, httpMethod: HTTP_METHOD) : Promise<API_RESPONSE> => {

        let response;
        try {
            response = await doApiCall(data, url, httpMethod);
        } catch (error: any) {
            response = error.response;
        }

        const requiresSignIn = handleResponse(response);

        if (requiresSignIn) {
           return {
               authenticated: false,
               redirect: "/login",
               response: {
                   status: response.status
               }
           }
        } else {
            switch (response.status) {
                case 403:
                    return {
                        authenticated: false,
                        redirect: "/403",
                        response: {
                            status: response.status
                        }
                    }
                case 404:
                    return {
                        authenticated: true,
                        redirect: "/404",
                        response: {
                            status: response.status,
                            data: response.data
                        }
                    }
                case 500:
                    return {
                        authenticated: true, // it does not matter if the 500 is authenticated or not. It's application failure anyway
                        redirect: "/500",
                        response: {
                            status: response.status
                        }
                    }
                default:
                    return {
                        authenticated: true,
                        response:{
                            status: response.status,
                            data: response.data
                        }
                    };
            }
        }

}

export default doCall;