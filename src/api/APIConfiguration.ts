import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";

const CONFIGURATION_URL = '/configuration/configuration';
const CONFIGURATION_NAME_URL = '/configuration/configuration_name';

export const fetchOneConfiguration = async (username:string, configurationId:string): Promise<API_RESPONSE> => {
    const requestBody:{} = {user:{name:username},id:configurationId};
    const data:{} = JSON.stringify(requestBody);
    const response: API_RESPONSE = await ApiCaller(data, CONFIGURATION_URL, HTTP_METHOD.POST);
    return response;
}


export const fetchConfigurationNames = async (username:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({name:username});
    const response: API_RESPONSE = await ApiCaller(data, CONFIGURATION_NAME_URL, HTTP_METHOD.POST);
    return response;
}





