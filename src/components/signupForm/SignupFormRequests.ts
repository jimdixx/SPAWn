import axios, {AxiosResponse} from 'axios';

interface DataToSend {
    name: string,
    email: string,
    password: string
}

interface ErrorResponse {
    status: number,
    message: string
}

interface DataToObtain {
    status: number,
    message: string
}

const postData = async (url: string, d: DataToSend): Promise<DataToObtain | ErrorResponse> => {
    try {
        const response: AxiosResponse<DataToObtain> = await axios.post<DataToObtain>(url, d);
        const { status, data } = response;
        return {status, message: data.message};
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                return { status, message: data.message || 'Something went wrong!' };
            } else {
                return { status: 500, message: 'Server error' };
            }
        } else {
            throw error;
        }
    }
};

export default postData;