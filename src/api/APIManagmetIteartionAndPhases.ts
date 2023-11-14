import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const MANAGMENT = "/management";

const ITERATIONS_AND_PHASES_URL = "/segment-iteration-phase";

export interface Iteration {
    id: number;
    external: string;
    name: string;
    description :string
}

export interface Phase {
    id: number;
    external: string;
    name: string;
    description :string
}

export interface IterationAndPhases {
    iterationDtos: Iteration[];
    phaseDtos: Phase[];
}


export const fetchIterationsAndPhases = async (projectId:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({projectId:projectId});
    const response: API_RESPONSE = await ApiCaller(data, MANAGMENT + ITERATIONS_AND_PHASES_URL, HTTP_METHOD.GET);
    return response;
}

export const sendIterationOrPhase = async (Ids:string[], uri:string): Promise<API_RESPONSE> => {
    const data:{} = JSON.stringify({Ids:Ids});
    const response: API_RESPONSE = await ApiCaller(data, MANAGMENT + uri, HTTP_METHOD.POST);
    return response;
}