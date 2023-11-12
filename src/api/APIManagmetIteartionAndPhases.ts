import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

const ITERATIONS_AND_PHASES_URL = "/management/segment-iteration-phase";

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
    const response: API_RESPONSE = await ApiCaller(data, ITERATIONS_AND_PHASES_URL, HTTP_METHOD.GET);
    return response;
}