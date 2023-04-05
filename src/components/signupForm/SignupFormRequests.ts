import axios, {Axios, AxiosResponse} from 'axios';

interface MyData {
    name: string,
    email: string,
    password: string
}


const postData = async (url: string, data: MyData): Promise<AxiosResponse<any>> => {
    try {
        let response = await axios.post<MyData>(url, data);
        return response;
    } catch (error: any) {
        return error;
    }
};

export default postData;