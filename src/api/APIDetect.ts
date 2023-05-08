import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";

const CONFIGURATION_NAME_URL = '/detect/analyze';


export const sendProjectsForAnalysation = async (body:{configurationId:string,userName:string,selectedProjects:number[],selectedAntipatterns:number[]}): Promise<API_RESPONSE> => {
    const data = JSON.stringify(body);
    const response: API_RESPONSE = await ApiCaller(data, CONFIGURATION_NAME_URL, HTTP_METHOD.POST);
    return response;
}





