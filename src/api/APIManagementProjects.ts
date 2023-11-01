import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const PROJECT_URL = "management/projects"
const SAVE_PROJECTS_URL = "management/saveProjects"

export interface ProjectData {
    project: {
        id: number,
        name: string,
        description: string
    },
    children: ProjectData[],
    parent?: ProjectData
}

export const fetchProjects = async (username?:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({name:username});
    return await ApiCaller(data, PROJECT_URL, HTTP_METHOD.GET);
}

export const saveProjects = (username?: string, projectsData?: ProjectData[]): Promise<API_RESPONSE> => {
    // iterate over projects and remove parent property - causes cycling
    const modifiedDataArray = removeParentPropertiesFromArray(projectsData);

    const data = {
        name: username,
        projects: modifiedDataArray,
    };

    return ApiCaller(data, SAVE_PROJECTS_URL, HTTP_METHOD.POST);
}

const removeParentProperty = (data: ProjectData): ProjectData => {
    const newData = { ...data };
    delete newData.parent;
    if (newData.children && newData.children.length > 0) {
        newData.children = newData.children.map(removeParentProperty);
    }
    return newData;
}

const removeParentPropertiesFromArray = (dataArray: ProjectData[] | undefined): ProjectData[] | undefined => {
    if(dataArray) {
        return dataArray.map(removeParentProperty);
    }
    else {
        return undefined;
    }
}