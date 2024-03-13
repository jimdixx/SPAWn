import ApiCaller, { HTTP_METHOD, API_RESPONSE } from "../../components/api/ApiCaller";

const INDICATORS_URL = "http://localhost:8080/v2/detecting/indicators";
const DELETE_INDICATOR_URL = "http://localhost:8080/v2/detecting/indicators/delete/{id}";
const CREATE_INDICATOR_URL = "http://localhost:8080/v2/detecting/indicators/create";
const SCRIPT_TYPES_URL = "http://localhost:8080/v2/detecting/scripttypes";
const INDICATOR_TYPES_URL = "http://localhost:8080/v2/detecting/indicatortypes";
const UPDATE_INDICATOR_URL = "http://localhost:8080/v2/detecting/indicators/update/{id}";

export interface Indicator {
    id: number;
    name: string;
    description: string;
    scriptCode: string;
    indicatorType: {
        id: number;
        type_name: string;
    };
    scriptType: {
        id: number;
        type_name: string;
    };
}

export interface ScriptType {
    id: number;
    type_name: string;
}

export interface IndicatorType {
    id: number;
    type_name: string;
}

export const fetchIndicators = async (token: string): Promise<API_RESPONSE> => {
    return await ApiCaller([], INDICATORS_URL, HTTP_METHOD.GET, token);
};

export const deleteIndicator = async (id: number, token: string): Promise<void> => {
    const url = DELETE_INDICATOR_URL.replace("{id}", id.toString());
    await ApiCaller([], url, HTTP_METHOD.POST, token);
};

export const createIndicator = async (indicator: Indicator, token: string): Promise<API_RESPONSE> => {
    const requestBody = {
        name: indicator.name,
        description: indicator.description,
        scriptCode: indicator.scriptCode,
        indicatorType: {
            id: indicator.indicatorType.id,
            type_name: indicator.indicatorType.type_name,
        },
        scriptType: {
            id: indicator.scriptType.id,
            type_name: indicator.scriptType.type_name,
        },
    };

    return await ApiCaller(requestBody, CREATE_INDICATOR_URL, HTTP_METHOD.POST, token);
};

export const fetchScriptTypes = async (token: string): Promise<ScriptType[]> => {
    const response = await ApiCaller([], SCRIPT_TYPES_URL, HTTP_METHOD.GET, token);
    return response.response.data as ScriptType[];
};

export const fetchIndicatorTypes = async (token: string): Promise<IndicatorType[]> => {
    const response = await ApiCaller([], INDICATOR_TYPES_URL, HTTP_METHOD.GET, token);
    return response.response.data as IndicatorType[];
};

export const fetchIndicatorById = async (id: string, token: string): Promise<API_RESPONSE> => {
    const url = `${INDICATORS_URL}/${id}`;
    return await ApiCaller([], url, HTTP_METHOD.GET, token);
};

export const updateIndicator = async (id: number, updatedIndicator: Indicator, token: string): Promise<API_RESPONSE> => {
    const url = UPDATE_INDICATOR_URL.replace("{id}", id.toString());
    return await ApiCaller(updatedIndicator, url, HTTP_METHOD.POST, token);
};
