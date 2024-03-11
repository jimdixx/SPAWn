import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { API_RESPONSE } from "../../components/api/ApiCaller";
import { fetchIndicatorById } from "../../api/detecting/APIDetectingIndicators";
import { fetchParametersByIndicatorId } from "../../api/detecting/APIDetectingParameters";
import { Indicator } from "../../api/detecting/APIDetectingIndicators";
import { Parameter } from "../../api/detecting/APIDetectingParameters";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const IndicatorDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [indicator, setIndicator] = useState<Indicator | null>(null);
    const [parameters, setParameters] = useState<Parameter[]>([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            const token = user?.access_token;
            if (!token || !id) return;

            try {
                const indicatorResponse: API_RESPONSE = await fetchIndicatorById(id, token);
                if (indicatorResponse && indicatorResponse.response && indicatorResponse.response.data) {
                    setIndicator(indicatorResponse.response.data as Indicator);
                }

                const parameterResponse: API_RESPONSE = await fetchParametersByIndicatorId(id, token);
                if (parameterResponse && parameterResponse.response && parameterResponse.response.data) {
                    setParameters(parameterResponse.response.data as Parameter[]);
                }
            } catch (error) {
                console.error("Error fetching indicator detail:", error);
            }
        };

        fetchData();
    }, [id, user]);

    const isGroovyScript = indicator?.scriptType?.type_name === "GROOVY";

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
                        <strong>Name:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.name}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Description:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.description}</div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <strong>Indicator Type:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.indicatorType?.type_name}</div>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        <strong>Script Type:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{indicator.scriptType?.type_name}</div>
                    </div>
                    {isGroovyScript && (
                        <div style={{ marginBottom: "10px" }}>
                            <strong>Script Code:</strong>
                            <SyntaxHighlighter language="groovy" customStyle={{ borderRadius: "5px" }}>
                                {indicator.scriptCode}
                            </SyntaxHighlighter>
                        </div>
                    )}
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
                                <strong>Name:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.name}</div>
                            </Col>
                            <Col>
                                <strong>Parameter Type:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.parameterType?.type}</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <strong>Description:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.description}</div>
                            </Col>
                            <Col>
                                <strong>Default Value:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{parameter.defaultValue}</div>
                            </Col>
                        </Row>
                    </div>
                ))
            )}
            <Link to="/indicators">
                <Button variant="primary">Back to Indicators</Button>
            </Link>
        </Container>
    );
};

export default IndicatorDetail;
