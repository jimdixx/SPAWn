import ApiCaller, { HTTP_METHOD, API_RESPONSE } from "../../components/api/ApiCaller";

const INDICATORS_URL = "http://localhost:8080/v2/detecting/indicators";
const DELETE_INDICATOR_URL = "http://localhost:8080/v2/detecting/indicators/delete/{id}";

export interface Indicator {
    id: number;
    name: string;
    description: string;
    scriptCode: string;
    indicatorType: string;
    scriptType: string;
}

export const fetchIndicators = async (token: string): Promise<API_RESPONSE> => {
    return await ApiCaller([], INDICATORS_URL, HTTP_METHOD.GET, token);
};

export const deleteIndicator = async (id: number, token: string): Promise<void> => {
    const url = DELETE_INDICATOR_URL.replace("{id}", id.toString());
    await ApiCaller([], url, HTTP_METHOD.POST, token);
};
