// import ApiCaller, { API_RESPONSE, HTTP_METHOD } from "../components/api/ApiCaller";

// Zakomentované importy, dokud není implementováno API
// const ACTIVITY_URL = "/management/activity_list";
// const WU_UPDATE_RUL = "/management/activity_work_units";

export interface Metric {
    id: number;
    name: string;
    description: string;
    sql_query: string;
}

export const fetchMetrics = async (): Promise<Metric[]> => {
    const mockMetrics: Metric[] = [
        {
            id: 1,
            name: "selectNumberOfIterations",
            description: "Select number of iterations for given project id",
            sql_query: "select COUNT(id) as 'numberOfIterations' from iter...",
        },
        {
            id: 2,
            name: "selectIterationsWithSubstring",
            description: "select iterations with given substring",
            sql_query: "select iterationName as 'iterationName', count(nam...",
        },
    ];

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockMetrics);
        }, 1000); // Simulace 1 sekundy zpoždění
    });

    // Skutečné volání API - zakomentováno
    // return await ApiCaller({}, METRICS_URL, HTTP_METHOD.GET, token);
};

export const fetchMetricDetail = async (metricId: number): Promise<Metric | null> => {
    const mockMetric: Metric | null = {
        id: metricId,
        name: "selectNumberOfIterations",
        description: "Select number of iterations for given project id",
        sql_query: "select COUNT(id) as 'numberOfIterations' from iter...",
    };

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockMetric);
        }, 500);
    });

    // Skutečné volání API - zakomentováno
    // return await ApiCaller({}, METRIC_DETAIL_URL, HTTP_METHOD.GET, token);
};


export const deleteMetric = async (metricId: number): Promise<void> => {
    console.log("Deleting metric with ID:", metricId);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });

    // Skutečné volání API - zakomentováno
    // return await ApiCaller({}, DELETE_METRIC_URL, HTTP_METHOD.DELETE, token);
};

export const updateMetric = async (metricId: number, updatedMetric: Metric): Promise<void> => {
    console.log("Updating metric with ID:", metricId, "to:", updatedMetric);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });

    // Skutečné volání API - zakomentováno
    // return await ApiCaller(updatedMetric, UPDATE_METRIC_URL, HTTP_METHOD.PUT, token);
};
