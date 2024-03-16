import ApiCaller, { HTTP_METHOD, API_RESPONSE } from "../../components/api/ApiCaller";

const PROJECTS_URL = "http://localhost:8080/v2/detecting/projects";

export interface Project {
    id: number,
    externalId: number,
    name: string,
    description: string,
    endDate: string,
    startDate: string,
    superProjectId: number
}

export const fetchProjects = async (token: string): Promise<Project[]> => {
    const response = await ApiCaller([], PROJECTS_URL, HTTP_METHOD.GET, token);
    return response.response.data as Project[];
};

