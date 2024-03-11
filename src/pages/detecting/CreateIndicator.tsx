import React, { useState, useEffect } from "react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import { Indicator, createIndicator } from "../../api/detecting/APIDetectingIndicators";
import { fetchScriptTypes, fetchIndicatorTypes, ScriptType, IndicatorType } from "../../api/detecting/APIDetectingIndicators";
import { createParameter, Parameter, fetchParameterTypes, ParameterType } from "../../api/detecting/APIDetectingParameters";
import { API_RESPONSE } from "../../components/api/ApiCaller";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

interface APIIndicatorResponse {
  status: number;
  data?: Indicator;
}

interface APICreateIndicatorResponse {
  redirect?: string;
  response?: APIIndicatorResponse;
}

interface NewParameter {
    name: string;
    parameterType: number;
    description: string;
    defaultValue: string;
}

const CreateIndicator = () => {
    const [formData, setFormData] = useState<Indicator>({
        id: 0,
        name: "",
        description: "",
        scriptCode: "",
        indicatorType: { id: 0, type_name: "" },
        scriptType: { id: 0, type_name: "" }
    });
    const [scriptTypes, setScriptTypes] = useState<ScriptType[]>([]);
    const [indicatorTypes, setIndicatorTypes] = useState<IndicatorType[]>([]);
    const [parameterTypes, setParameterTypes] = useState<ParameterType[]>([]);
    const [parameters, setParameters] = useState<NewParameter[]>([]);
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTypes = async () => {
            const token = auth?.user?.access_token;
            if (!token) return;

            const scriptTypesResponse = await fetchScriptTypes(token);
            const indicatorTypesResponse = await fetchIndicatorTypes(token);
            const parameterTypesResponse = await fetchParameterTypes(token);

            setScriptTypes(scriptTypesResponse);
            setIndicatorTypes(indicatorTypesResponse);
            setParameterTypes(parameterTypesResponse);
        };

        fetchTypes();
    }, [auth]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: name === "indicatorType" || name === "scriptType"
                ? { id: Number(value), type_name: (e.target as HTMLSelectElement).selectedOptions[0].text }
                : value
        }));
    };

    const handleAddParameter = () => {
        setParameters([...parameters, { name: "", parameterType: 0, description: "", defaultValue: "" }]);
    };

    const handleParameterChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedParameters = [...parameters];
        updatedParameters[index] = {
            ...updatedParameters[index],
            [name]: name === "parameterType" ? Number(value) : value
        };
        setParameters(updatedParameters);
    };

    const handleRemoveParameter = (index: number) => {
        const updatedParameters = [...parameters];
        updatedParameters.splice(index, 1);
        setParameters(updatedParameters);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = auth?.user?.access_token;
            if (!token) return;

            const indicatorData: Indicator = {
                id: 0,
                name: formData.name,
                description: formData.description,
                scriptCode: formData.scriptCode,
                indicatorType: formData.indicatorType,
                scriptType: formData.scriptType
            };

            const apiResponse: API_RESPONSE = await createIndicator(indicatorData, token);
            const response: APICreateIndicatorResponse = {
              redirect: apiResponse.redirect,
              response: {
                status: apiResponse.response.status,
                data: apiResponse.response.data as Indicator | undefined
              }
            };

            const newIndicatorId = response.response?.data?.id;

            if (newIndicatorId) {
                for (const parameter of parameters) {
                    const parameterData: Parameter = {
                        id: 0,
                        name: parameter.name,
                        parameterType: { id: parameter.parameterType, type: "" },
                        description: parameter.description,
                        defaultValue: parameter.defaultValue,
                        indicatorId: newIndicatorId
                    };
                    await createParameter(parameterData, token);
                }

                navigate(`/indicators/${newIndicatorId}`);
            } else {
                console.error("Invalid response data:", apiResponse.response);
            }
        } catch (error) {
            console.error("Error creating indicator:", error);
        }
    };

    return (
        <Container>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> / <a href="/indicators">Indicators</a> / <a href="/createindicator">Create New Indicators</a></p>
            <h1>Create New Indicator</h1>
            <Form onSubmit={handleFormSubmit} style={{ padding: "20px" }}>
                <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control type="text" name="description" value={formData.description} onChange={handleInputChange} required />
                </Form.Group>
                <Form.Group controlId="formIndicatorType">
                    <Form.Label>Indicator Type</Form.Label>
                    <Form.Control as="select" name="indicatorType" value={formData.indicatorType.id} onChange={handleInputChange} required>
                        <option value="">Select Indicator Type</option>
                        {indicatorTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type_name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formScriptType">
                    <Form.Label>Script Type</Form.Label>
                    <Form.Control as="select" name="scriptType" value={formData.scriptType.id} onChange={handleInputChange} required>
                        <option value="">Select Script Type</option>
                        {scriptTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.type_name}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="formScriptCode" className="mb-4">
                    <Form.Label>Script Code</Form.Label>
                    <Form.Control as="textarea" rows={3} name="scriptCode" value={formData.scriptCode} onChange={handleInputChange} required />
                </Form.Group>
                {parameters.map((parameter, index) => (
                    <div key={index}>
                        <h5>Parameter {index + 1}</h5>
                        <Row>
                            <Col>
                                <Form.Group controlId={`formParameterName-${index}`}>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name="name" value={parameter.name} onChange={(e) => handleParameterChange(index, e)} required />
                                </Form.Group>
                            </Col>
                            <Col className="col-2">
                                <Form.Group controlId={`formParameterType-${index}`}>
                                    <Form.Label>Parameter Type</Form.Label>
                                    <Form.Control as="select" name="parameterType" value={parameter.parameterType} onChange={(e) => handleParameterChange(index, e)} required>
                                        <option value="">Select Parameter Type</option>
                                        {parameterTypes.map(type => (
                                            <option key={type.id} value={type.id}>{type.type}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId={`formParameterDescription-${index}`}>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control type="text" name="description" value={parameter.description} onChange={(e) => handleParameterChange(index, e)} required />
                                </Form.Group>
                            </Col>
                            <Col className="col-2">
                                <Form.Group controlId={`formParameterDefaultValue-${index}`}>
                                    <Form.Label>Default Value</Form.Label>
                                    <Form.Control type="text" name="defaultValue" value={parameter.defaultValue} onChange={(e) => handleParameterChange(index, e)} required />
                                </Form.Group>
                            </Col>
                            <Col className="col-1 pe-4 pt-4">
                                <Button variant="danger" onClick={() => handleRemoveParameter(index)} style={{ float: "right", marginBottom: "5px" }}>Delete</Button>
                            </Col>
                        </Row>
                    </div>
                ))}
                <div>
                    <Button variant="secondary" onClick={handleAddParameter} style={{ marginTop: "10px" }}>Add Parameter</Button>
                </div>
                <Button variant="success" type="submit" style={{ marginRight: "10px", marginTop: "20px" }}>
                    Create Indicator
                </Button>
                <a href="/indicators"><Button variant="danger" style={{ marginTop: "20px" }}>Cancel</Button></a>
            </Form>
        </Container>
    );
};

export default CreateIndicator;
