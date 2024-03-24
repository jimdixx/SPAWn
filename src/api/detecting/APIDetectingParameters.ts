import ApiCaller, { HTTP_METHOD, API_RESPONSE } from "../../components/api/ApiCaller";

const CREATE_PARAMETER_URL = "http://localhost:8080/v2/detecting/parameters/create";
const FETCH_PARAMETER_TYPES_URL = "http://localhost:8080/v2/detecting/parametertypes";
const PARAMETERS_URL = "http://localhost:8080/v2/detecting/parameters";
const UPDATE_PARAMETERS_URL = "http://localhost:8080/v2/detecting/parameters/updateAll";

export interface Parameter {
    id: number;
    name: string;
    parameterType: {
        id: number;
        type: string;
    }
    description: string;
    defaultValue: string;
    indicatorId: number
}

export interface ParameterType {
    id: number;
    type: string;
}

export const createParameter = async (parameter: Parameter, token: string): Promise<API_RESPONSE> => {
    return await ApiCaller(parameter, CREATE_PARAMETER_URL, HTTP_METHOD.POST, token);
};

export const fetchParameterTypes = async (token: string): Promise<ParameterType[]> => {
    const response = await ApiCaller([], FETCH_PARAMETER_TYPES_URL, HTTP_METHOD.GET, token);
    return response.response.data as ParameterType[];
};

export const fetchParametersByIndicatorId = async (id: string, token: string): Promise<API_RESPONSE> => {
    const url = `${PARAMETERS_URL}/byindicator/${id}`;
    return await ApiCaller([], url, HTTP_METHOD.GET, token);
};

export const updateParameter = async (id: number, parameter: Parameter, token: string): Promise<API_RESPONSE> => {
    const url = `${PARAMETERS_URL}/update/${id}`;
    return await ApiCaller(parameter, url, HTTP_METHOD.POST, token);
};

export const deleteParameter = async (id: number, token: string): Promise<API_RESPONSE> => {
    const url = `${PARAMETERS_URL}/delete/${id}`;
    return await ApiCaller([], url, HTTP_METHOD.POST, token);
};

export const updateAllParameters = async (parameters : Parameter[], token: string): Promise<API_RESPONSE> => {
    const url = `${UPDATE_PARAMETERS_URL}`;
    return await ApiCaller(parameters, url, HTTP_METHOD.POST, token);
};