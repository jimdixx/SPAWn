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

export const fetchProjects = async (username?:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({name:username});
    return await ApiCaller(data, PROJECTS_URL, HTTP_METHOD.GET);
}

export const fetchPersons = async (username?:string, prjId?:number): Promise<API_RESPONSE> => {
    const data = {
        name: username,
        projectId: prjId,
    };
    return await ApiCaller(data, PERSONS_URL, HTTP_METHOD.POST);
}

export const mergePersons = (project: number, personsToMerge: Persons[], personToMergeIn?: Persons, newName?: string): Promise<API_RESPONSE> => {
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

    return ApiCaller(data, MERGE_PERSONS_URL, HTTP_METHOD.POST);
};