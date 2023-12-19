import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const ACTIVITY_URL = "/management/activity_list";
const WU_UPDATE_RUL = "/management/activity_work_units"
export interface ActivityDto {
    name:string
    description:string,
    externalId:number,
    startDate:string,
    endDate:string,
    id: number
}

export const fetchActivities = async (projectId: number | undefined, token: string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({projectId:projectId});
    return await ApiCaller(data, ACTIVITY_URL, HTTP_METHOD.GET, token);
}
export const updateWuActivity = async(body:{activityId:number, wuIds:number[]}, token: string) =>{
    const data:{} = JSON.stringify(body);
    return await ApiCaller(data, WU_UPDATE_RUL, HTTP_METHOD.PUT, token);

}