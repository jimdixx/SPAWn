import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const ACTIVITY_URL = "/management/activity_list";
const WU_UPDATE_RUL = "/management/activity_work_units"
export interface ActivityDto {
    name:string
    description:string,
    externalId:number,
    startDate:string,
    endDate:string
}

export const fetchActivities = async (projectId: number | undefined): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({projectId:projectId});
    return await ApiCaller(data, ACTIVITY_URL, HTTP_METHOD.GET);
}
