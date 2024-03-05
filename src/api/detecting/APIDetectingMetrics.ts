import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../../components/api/ApiCaller";

const METRICS_URL = "http://localhost:8080/v2/detecting/metrics";
const DELETE_METRIC_URL = "http://localhost:8080/v2/detecting/metrics/delete/{id}";
const CREATE_METRIC_URL = "http://localhost:8080/v2/detecting/metrics/create";
const METRIC_DETAIL_URL = "http://localhost:8080/v2/detecting/metrics/{id}";
const METRIC_UPDATE_URL = "http://localhost:8080/v2/detecting/metrics/update/{id}";
const TEST_METRIC_URL = "http://localhost:8080/v2/detecting/metrics/test/{id}";

export interface Metric {
    id: number;
    name: string;
    description: string;
    sqlQuery: string;
}

export const fetchMetrics = async (token: string): Promise<API_RESPONSE> => {
    return await ApiCaller({}, METRICS_URL, HTTP_METHOD.GET, token);
}

export const deleteMetric = async (metricId: number, token: string): Promise<API_RESPONSE> => {
    const url = DELETE_METRIC_URL.replace("{id}", metricId.toString());
    return await ApiCaller({}, url, HTTP_METHOD.POST, token);
}

export const createMetric = async (metric: Metric, token: string): Promise<API_RESPONSE> => {
    return await ApiCaller(metric, CREATE_METRIC_URL, HTTP_METHOD.POST, token);
}

export const fetchMetricDetail = async (metricId: number, token: string): Promise<API_RESPONSE> => {
    const url = METRIC_DETAIL_URL.replace("{id}", metricId.toString());
    return await ApiCaller({}, url, HTTP_METHOD.GET, token);
};

export const updateMetric = async (metricId: number, updatedMetric: Metric, token: string): Promise<API_RESPONSE> => {
    const url = METRIC_UPDATE_URL.replace("{id}", metricId.toString());
    return await ApiCaller(updatedMetric, url, HTTP_METHOD.POST, token);
};

export const testSqlQuery = async (id: number, params: string, token: string): Promise<API_RESPONSE> => {
    const url = TEST_METRIC_URL.replace("{id}", id.toString());

    let requestBody: any = null;

    if (params) {
        requestBody = [params];
    }

    return await ApiCaller(requestBody, url, HTTP_METHOD.POST, token);
};


