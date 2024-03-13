import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Dropdown } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { API_RESPONSE } from "../../components/api/ApiCaller";
import { fetchIndicatorById, updateIndicator, fetchIndicatorTypes, fetchScriptTypes } from "../../api/detecting/APIDetectingIndicators";
import { fetchParametersByIndicatorId, updateAllParameters, deleteParameter } from "../../api/detecting/APIDetectingParameters";
import { Indicator, IndicatorType, ScriptType } from "../../api/detecting/APIDetectingIndicators";
import { Parameter, ParameterType, fetchParameterTypes } from "../../api/detecting/APIDetectingParameters";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const IndicatorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [initialIndicator, setInitialIndicator] = useState<Indicator | null>(null);
    const [indicator, setIndicator] = useState<Indicator | null>(null);
    const [parameters, setParameters] = useState<Parameter[]>([]);
    const [initialParameters, setInitialParameters] = useState<Parameter[]>([]);
    const [editable, setEditable] = useState<boolean>(false);
    const [indicatorTypes, setIndicatorTypes] = useState<IndicatorType[]>([]);
    const [scriptTypes, setScriptTypes] = useState<ScriptType[]>([]);
    const [parameterTypes, setParameterTypes] = useState<ParameterType[]>([]);
    const [deletedParameters, setDeletedParameters] = useState<number[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const token = user?.access_token;
            if (!token || !id) return;

            try {
                const indicatorResponse: API_RESPONSE = await fetchIndicatorById(id, token);
                if (indicatorResponse && indicatorResponse.response && indicatorResponse.response.data) {
                    const indicatorData = indicatorResponse.response.data as Indicator;
                    setInitialIndicator(indicatorData);
                    setIndicator(indicatorData);
                }

                const parameterResponse: API_RESPONSE = await fetchParametersByIndicatorId(id, token);
                if (parameterResponse && parameterResponse.response && parameterResponse.response.data) {
                    const parametersData = parameterResponse.response.data as Parameter[]
                    setParameters(parametersData);
                    setInitialParameters(parametersData);
                }

                const indicatorTypesResponse = await fetchIndicatorTypes(token);
                const scriptTypesResponse = await fetchScriptTypes(token);
                const parameterTypesResponse = await fetchParameterTypes(token);

                setIndicatorTypes(indicatorTypesResponse);
                setScriptTypes(scriptTypesResponse);
                setParameterTypes(parameterTypesResponse);

            } catch (error) {
                console.error("Error fetching indicator detail:", error);
            }
        };

        fetchData();
    }, [id, user]);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleSave = async () => {
        try {
            const token = user?.access_token;
            if (!token || !indicator) return;

            const response: API_RESPONSE = await updateIndicator(indicator.id, indicator, token);
            if (response.response.status === 200 && response.response.data) {
                setInitialIndicator(response.response.data as Indicator);
                setIndicator(response.response.data as Indicator);
                setEditable(false);
            }

            const parametersResponse: API_RESPONSE = await updateAllParameters(parameters, token);
            if (parametersResponse.response.status === 200 && parametersResponse.response.data) {
                setInitialParameters(parametersResponse.response.data as Parameter[]);
                setParameters(parametersResponse.response.data as Parameter[]);
                setEditable(false);
            }

            for (const deletedParamId of deletedParameters) {
                await deleteParameter(deletedParamId, token);
            }
            setDeletedParameters([]);
        } catch (error) {
            console.error("Error updating indicator:", error);
        }
    };

    const handleCancel = () => {
        setIndicator(initialIndicator);
        setParameters(initialParameters);
        setEditable(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setIndicator(prevState => ({
            ...(prevState as Indicator),
            [name]: value
        }));
    };

    const handleIndicatorTypeChange = (type: IndicatorType | null) => {
        if (type) {
            setIndicator(prevState => ({
                ...(prevState as Indicator),
                indicatorType: type
            }));
        }
    };

    const handleScriptTypeChange = (type: ScriptType | null) => {
        if (type) {
            setIndicator(prevState => ({
                ...(prevState as Indicator),
                scriptType: type
            }));
        }
    };

    const handleAddNewParameter = () => {
        setParameters(prevParameters => [
            ...prevParameters,
            {
                id: 0,
                name: "",
                parameterType: { id: 1, type: "TEXT" },
                description: "",
                defaultValue: "",
                indicatorId: indicator?.id || 0
            }
        ]);
    }

    const handleDeleteParameter = (parameter: Parameter) => {
        if (parameter.id !== 0) {
            setDeletedParameters(prevDeletedParams => [...prevDeletedParams, parameter.id]);
        }
        setParameters(prevParameters => prevParameters.filter(param => param !== parameter));
    }

    const handleChangeParameter = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setParameters(prevParameters => {
            const updatedParameters = [...prevParameters];
            updatedParameters[index] = {
                ...updatedParameters[index],
                [name]: value
            };
            return updatedParameters;
        });
    };

    const handleParameterTypeChange = (index: number, type: ParameterType | null) => {
        if (type) {
            setParameters(prevParameters => {
                const updatedParameters = [...prevParameters];
                updatedParameters[index] = {
                    ...updatedParameters[index],
                    parameterType : type
                };
                return updatedParameters;
            });
        }
    };

    return (
        <Container style={{ marginTop: "20px" }}>
            <p>/ <Link to="/detecting">Detecting</Link> / <Link to="/definition">Definition</Link> / <Link to="/indicators">Indicators</Link> / <Link to={`/indicator/${indicator?.id}`}>{indicator?.id}</Link> </p>
            <h1>Indicator Detail</h1>
            {indicator && (
                <div style={{ margin: "20px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>ID:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.id}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Name:</strong> {editable ? <textarea name="name" value={indicator.name} onChange={handleChange} style={{ width: "100%", resize: "none" }} /> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.name}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Description:</strong> {editable ? <textarea name="description" value={indicator.description} onChange={handleChange} style={{ width: "100%", resize: "none" }} /> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.description}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Indicator Type:</strong> {editable ? <Dropdown onSelect={(eventKey: string | null) => handleIndicatorTypeChange(indicatorTypes.find(type => type.type_name === eventKey) || null)}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {indicator.indicatorType?.type_name || 'Select Indicator Type'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {indicatorTypes.map((type, index) => (
                                    <Dropdown.Item key={index} eventKey={type.type_name}>{type.type_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.indicatorType?.type_name}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Script Type:</strong> {editable ? <Dropdown onSelect={(eventKey: string | null) => handleScriptTypeChange(scriptTypes.find(type => type.type_name === eventKey) || null)}>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {indicator.scriptType?.type_name || 'Select Script Type'}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {scriptTypes.map((type, index) => (
                                    <Dropdown.Item key={index} eventKey={type.type_name}>{type.type_name}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.scriptType?.type_name}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Script Code:</strong> {editable ? <textarea name="scriptCode" value={indicator.scriptCode} onChange={handleChange} style={{ width: "100%", resize: "vertical" }} rows={10}/> : <SyntaxHighlighter language="groovy" customStyle={{ padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                            {indicator.scriptCode}
                        </SyntaxHighlighter>}
                    </div>
                </div>
            )}
            <h4>Parameters</h4>
            {parameters.length === 0 ? (
                <p className="m-4">No parameters</p>
            ) : (
                parameters.map((parameter, index) => (
                    <div key={index} style={{ marginBottom: "20px", border: "1px solid #ccc", borderRadius: "5px", padding: "10px" }}>
                        <Row>
                            <Col>
                                <strong>Name:</strong> {editable ? <textarea name="name" value={parameter.name} onChange={(e) => handleChangeParameter(index, e)} style={{ width: "100%", resize: "none" }}/> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.name}</div>}
                            </Col>
                            <Col>
                                <strong>Parameter Type:</strong> { editable ?
                                <Dropdown onSelect={(eventKey: string | null) => handleParameterTypeChange(index, parameterTypes.find(type => type.type === eventKey) || null)}>
                                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                        {parameter.parameterType.type || 'Select Parameter Type'}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        { parameterTypes.map((type, index) => (
                                            <Dropdown.Item key={index} eventKey={type.type}>{type.type}</Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                                : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.parameterType?.type}</div>}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <strong>Description:</strong> {editable ? <textarea name="description" value={parameter.description} onChange={(e) => handleChangeParameter(index, e)} style={{ width: "100%", resize: "none" }}/> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.description}</div>}
                            </Col>
                            <Col>
                                <strong>Default Value:</strong> {editable ? <textarea name="defaultValue" value={parameter.defaultValue} onChange={(e) => handleChangeParameter(index, e)} style={{ width: "100%", resize: "none" }}/> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.defaultValue}</div>}
                            </Col>
                        </Row>
                        {editable && <Button className="btn-sm mt-2" variant="danger" onClick={() => handleDeleteParameter(parameter)}>Delete This Parameter</Button>}
                    </div>
                ))
            )}
            { editable && <Button className="btn-sm mb-4" variant="primary" onClick={handleAddNewParameter}>Add New Parameter</Button>
            }
            {editable ? (
                <div>
                    <Button variant="success" onClick={handleSave}>Save Indicator</Button>{' '}
                    <Button variant="danger" onClick={handleCancel}>Cancel</Button>
                </div>
            ) : (
                <Button variant="primary" onClick={handleEdit}>Edit Indicator</Button>
            )}
        </Container>
    );
};

export default IndicatorDetail;
