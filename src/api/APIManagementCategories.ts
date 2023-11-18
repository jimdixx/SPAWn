import { Projects, fetchProjects } from "./APIManagementPerson";
import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";

const CATEGORIES_URL = "management/getCategories";

export interface Category {
    id: number,
    name: string,
    description: string
}

export interface ApiResponse {
    message: string | null;
    responseBody: Category[] | null
}

export const fetchProjectsList = async (username?:string): Promise<API_RESPONSE> => {
    return await fetchProjects(username);
}

export const fetchCategories = async (username?:string, prjId?:number): Promise<API_RESPONSE> => {
    const data = {
        name: username,
        projectId: prjId,
    };
    return await ApiCaller(data, CATEGORIES_URL, HTTP_METHOD.POST);
}