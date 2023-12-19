import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const PROJECTS_URL = "management/projectsList";
const PERSONS_URL = "management/personsFromProject";
const MERGE_PERSONS_URL = "management/mergePersons";

export interface Projects {
    id: number,
    name: string,
    description: string
}

export interface Persons {
    id: number,
    name: string,
    identities: Identity[]
}

export interface Identity {
    id:number,
    name: string,
    description: string,
    email: string
}

export const fetchProjects = async (token: string, username?:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({name:username});
    return await ApiCaller(data, PROJECTS_URL, HTTP_METHOD.GET, token);
}

export const fetchPersons = async (token: string, username?:string, prjId?:number): Promise<API_RESPONSE> => {
    const data = {
        name: username,
        projectId: prjId,
    };
    return await ApiCaller(data, PERSONS_URL, HTTP_METHOD.POST, token);
}

export const mergePersons = (token: string, project: number, personsToMerge: Persons[], personToMergeIn?: Persons, newName?: string): Promise<API_RESPONSE> => {
    const data: any = {
      projectId: project,
      persons: personsToMerge,
    };

    if (personToMergeIn !== undefined) {
      data.person = personToMergeIn;
    }

    if (newName !== undefined) {
      data.newPersonName = newName;
    }

    return ApiCaller(data, MERGE_PERSONS_URL, HTTP_METHOD.POST, token);
};