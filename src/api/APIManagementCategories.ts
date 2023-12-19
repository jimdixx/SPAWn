import { Projects, fetchProjects } from "./APIManagementPerson";
import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";

const CATEGORIES_URL = "management/getCategories";
const CATEGORIES_CHANGE_URL = "management/changeCategory";

export interface Category {
    id: number,
    name: string,
    description: string
}

export interface ApiResponse {
    message: string | null;
    responseBody: Category[] | null
    additionalInformation: AdditionalInformation | null;
}

export interface AdditionalInformation {
    additionalFields: AdditionalFields | null;
}

export interface AdditionalFields {
    successMessage: string | null;
    informMessage: string | null;
    message: string | null;
}

export const fetchCategories = async (token: string, username?:string, prjId?:number): Promise<API_RESPONSE> => {
    const data = {
        name: username,
        projectId: prjId,
    };
    return await ApiCaller(data, CATEGORIES_URL, HTTP_METHOD.POST, token);
}

export const requestChangeCategories = async (token: string, categoriesArr?:Category[], subType?:number, prjId?:number): Promise<API_RESPONSE> => {
    const data = {
        categories: categoriesArr,
        submitType: subType,
        projectId: prjId,
    };
    return await ApiCaller(data, CATEGORIES_CHANGE_URL, HTTP_METHOD.POST, token);
}