import React, { useState, useEffect } from "react";
import { Container, Table, Form, Alert, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { fetchParametersByIndicatorId, Parameter } from "../../api/detecting/APIDetectingParameters";
import { Indicator } from "../../api/detecting/APIDetectingIndicators";
import { executeMultipleDetections } from "../../api/detecting/APIDetectingDetection";

interface IndicatorWithParameters {
    indicator: Indicator;
    parameters: Parameter[];
}

interface ParametersState {
  [indicatorName: string]: {
    [paramName: string]: string;
  };
}

const SetParameters = () => {
    const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
    const [indicatorsWithParameters, setIndicatorsWithParameters] = useState<IndicatorWithParameters[]>([]);
    const [parameters, setParameters] = useState<ParametersState>({});
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loadedSelectedProjects = JSON.parse(localStorage.getItem('selectedProjects') || '[]');
        const loadedSelectedIndicators = JSON.parse(localStorage.getItem('selectedIndicators') || '[]');
        const loadedIndicators: Indicator[] = JSON.parse(localStorage.getItem('indicators') || '[]');

        setSelectedProjects(loadedSelectedProjects);

        if (auth?.user?.access_token) {
            loadParametersForSelectedIndicators(loadedSelectedIndicators, loadedIndicators, auth.user.access_token);
        }
    }, [auth?.user?.access_token]);

    const loadParametersForSelectedIndicators = async (indicatorIds: number[], loadedIndicators: Indicator[], token: string) => {
        const indicatorsWithParams: IndicatorWithParameters[] = [];

        for (let id of indicatorIds) {
            const indicator = loadedIndicators.find(ind => ind.id === id);
            if (!indicator) continue;
            const response = await fetchParametersByIndicatorId(String(id), token);
            indicatorsWithParams.push({
                indicator: indicator,
                parameters: response && response.response.data && Array.isArray(response.response.data) ? response.response.data as Parameter[] : [],
            });
        }

        setIndicatorsWithParameters(indicatorsWithParams);
    };

    const handleParameterChange = (indicatorName: string, paramName: string, value: string) => {
      setParameters(prev => ({
        ...prev,
        [indicatorName]: {
          ...(prev[indicatorName] || {}),
          [paramName]: value,
        },
      }));
    };


    const startDetection = async () => {
      if (!auth?.user?.access_token) {
        console.error("No access token available");
        return;
      }

      setIsLoading(true); // Zapnout indikátor načítání

      const detectionRequest = {
        projectIds: selectedProjects,
        indicators: indicatorsWithParameters.map(item => item.indicator.name),
        parameters: parameters
      };

      try {
        const response = await executeMultipleDetections(detectionRequest, auth.user.access_token);
        localStorage.setItem('detectionResults', JSON.stringify(response));
        navigate('/detectionResults');
      } catch (error) {
        console.error("Error executing detection:", error);
      } finally {
        setIsLoading(false); // Vypnout indikátor načítání
      }
    };


    return (
        <Container>
            <h1>Set Parameters</h1>
            <div>
                <h5>Selected Projects IDs:</h5> {selectedProjects.join(', ')}
            </div>
            <hr/>
            {indicatorsWithParameters.map((item) => (
                <div key={item.indicator.id}>
                    <h5>{item.indicator.name} (ID: {item.indicator.id})</h5>
                    {item.parameters.length > 0 ? (
                        <Table bordered>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Default Value</th>
                                    <th>Set Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {item.parameters.map((param) => (
                                    <tr key={param.id}>
                                        <td>{param.name}</td>
                                        <td>{param.parameterType.type}</td>
                                        <td>{param.defaultValue}</td>
                                        <td>
                                            <Form.Control
                                              type="text"
                                              defaultValue={param.defaultValue}
                                              onChange={(e) => handleParameterChange(item.indicator.name, param.name, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : <Alert variant="info">No parameters</Alert>}
                </div>
            ))}

            <div className="text-center mt-4">
                <Button variant="success" onClick={startDetection} disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Start Detection'}
                </Button>
            </div>
            {isLoading && (
                <div className="text-center mt-4">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            )}
        </Container>
    );
};

export default SetParameters;
