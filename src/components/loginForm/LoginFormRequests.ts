import axios, {AxiosResponse} from 'axios';

interface DataToSend {
    name: string,
    password: string
}

interface DataToObtain {
    status: number,
    jwtToken: string,
    message: string
}

const login = async(url: string, d: DataToSend): Promise<DataToObtain> => {
    try {
        const response: AxiosResponse<DataToObtain> = await axios.post<DataToObtain>(url, d);
        const { status, data } = response;
        return {status, jwtToken: data.jwtToken, message: data.message};
    } catch(error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                return { status, jwtToken: "", message: data.message};
            } else {
                return { status: 500, jwtToken: "", message: 'Server error' };
            }
        } else {
            throw error;
        }
    }
};

export default login;