import axios, {AxiosResponse} from 'axios';

interface DataToSend {
    name: string,
    password: string
}

interface DataToObtain {
    status: number,
    jwtToken: string,
    msg: string
}

const login = async(url: string, d: DataToSend): Promise<DataToObtain> => {
    try {
        const response: AxiosResponse<DataToObtain> = await axios.post<DataToObtain>(url, d);
        const { status, data } = response;
        return {status, jwtToken: data.jwtToken, msg: data.msg};
    } catch(error: any) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                const { status, data } = error.response;
                return { status, jwtToken: "", msg: data.msg};
            } else {
                return { status: 500, jwtToken: "", msg: 'Server error' };
            }
        } else {
            throw error;
        }
    }
};

export default login;