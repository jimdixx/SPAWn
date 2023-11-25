import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const WORKUNIT_URL = "/management/activity_work_units";

export interface WorkUnitDto {
    assignee:string
    type:string,
    activity:string,
    id:number,
    startDate:string,
    endDate:string,
    category:string[]
}

export const fetchWorkUnits = async (projectId: number | undefined): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({projectId:projectId});
    return await ApiCaller(data, WORKUNIT_URL, HTTP_METHOD.GET);
}
