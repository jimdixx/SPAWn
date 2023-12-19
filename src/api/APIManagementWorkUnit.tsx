import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const WORKUNIT_URL = "/management/activity_work_units";
export interface filterObject {
    [key:string] : boolean
}
export interface WorkUnitDto {
    assignee:string,
    type:string,
    activity:string,
    id:number,
    startDate:string,
    endDate:string,
    category:string[]
}

export interface UnitsData {
    units:WorkUnitDto[],
    unit_distinct_categories:string[],
    unit_distinct_types:string[]
}

export const fetchWorkUnits = async (token: string, projectId: number | undefined, category_filter:filterObject, type_filter:filterObject): Promise<API_RESPONSE> => {
    //pouziju ";" jako delimiter, protoze "," se objevuje v datech - nedokazu rozparsovat na serveru smysluplne
    const data:{} = JSON.stringify({projectId:projectId,
        category:Object.keys(category_filter).join(";"),type:Object.keys(type_filter)
    });
    return await ApiCaller(data, WORKUNIT_URL, HTTP_METHOD.GET, token);
}
