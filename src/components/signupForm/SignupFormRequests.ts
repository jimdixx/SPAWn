import axios, {AxiosResponse} from 'axios';

interface DataToSend {
    name: string,
    email: string,
    password: string
}

interface ErrorResponse {
    status: number,
    msg: string
}

interface DataToObtain {
    status: number,
    msg: string
}

const postData = async (url: string, d: DataToSend): Promise<DataToObtain | ErrorResponse> => {
    try {
        const response: AxiosResponse<DataToObtain> = await axios.post<DataToObtain>(url, d);
        const { status, data } = response;
        return {status, msg: data.msg};
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                return { status, msg: data.msg || 'Something went wrong!' };
            } else {
                return { status: 500, msg: 'Server error' };
            }
        } else {
            throw error;
        }
    }
};

export default postData;