import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const ACTIVITY_URL = "management/activity_list";

export interface ActivityDto {
    name:string
    description:string,
    externalId:number,
    startDate:string,
    endDate:string
}

export const fetchActivities = async (selectedProjectId: number | undefined): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({selectedProjectId:selectedProjectId});
    return await ApiCaller(data, ACTIVITY_URL, HTTP_METHOD.GET);
}
