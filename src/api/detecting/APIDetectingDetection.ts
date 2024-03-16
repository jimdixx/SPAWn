import ApiCaller, { HTTP_METHOD, API_RESPONSE } from "../../components/api/ApiCaller";

const EXECUTE_MULTIPLE_DETECTIONS_URL = "http://localhost:8080/v2/detecting/detection/multiple";

interface DetectionParameters {
  [indicatorName: string]: {
    [parameterName: string]: any;
  };
}

interface DetectionRequest {
  projectIds: number[];
  indicators: string[];
  parameters: DetectionParameters;
}

export const executeMultipleDetections = async (request: DetectionRequest, token: string): Promise<API_RESPONSE> => {
    return await ApiCaller(request, EXECUTE_MULTIPLE_DETECTIONS_URL, HTTP_METHOD.POST, token);
};
