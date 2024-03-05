import React, { useState, useEffect } from "react";
import { Container, Button, Dropdown } from "react-bootstrap";
import { Metric, fetchMetricDetail, updateMetric, testSqlQuery } from "../../api/detecting/APIDetectingMetrics";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { API_RESPONSE } from "../../components/api/ApiCaller";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from "@codemirror/lang-sql";

const MetricDetail = () => {
    const { id } = useParams();
    const [metric, setMetric] = useState<Metric | null>(null);
    const [editable, setEditable] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [sqlTestResult, setSqlTestResult] = useState<string>("");
    const [originalMetric, setOriginalMetric] = useState<Metric | null>(null);
    const [params, setParams] = useState<string>("");
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const token = user?.access_token;
        if (!token || !id) return;

        const fetchMetric = async () => {
            try {
                const response: API_RESPONSE = await fetchMetricDetail(Number(id), token);
                if (response.response.status === 200 && response.response.data) {
                    setMetric(response.response.data as Metric);
                }
            } catch (error) {
                console.error("Error fetching metric detail:", error);
            }
        };

        fetchMetric();
    }, [id, user]);

    const handleEdit = () => {
        setOriginalMetric(metric);
        setEditable(true);
    };

    const handleSave = async () => {
    try {
        if (metric) {
            const token = user?.access_token;
            if (!token) return;

                const response: API_RESPONSE = await updateMetric(metric.id, metric, token);
                if (response.response.status === 200 && response.response.data) {
                    setMetric(response.response.data as Metric);
                    setEditable(false);
                }
            }
        } catch (error) {
            console.error("Error updating metric:", error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMetric(prevState => ({
            ...(prevState as Metric),
            [name]: value
        }));
    };

    const handleSqlQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMetric(prev => ({
            ...(prev as Metric),
            sqlQuery: value
        }));
    };


    const handleCancel = () => {
        setEditable(false);
        if (originalMetric) {
            setMetric(originalMetric); // Reset the metric to its original state
        }
        navigate("/metricdetail/" + (originalMetric?.id ?? '')); // Navigate back to the original URL
    };

    const handleTestSqlQuery = async () => {
    try {
        const token = user?.access_token;
        if (!token || !id) return;

            const response: API_RESPONSE = await testSqlQuery(Number(id), params, token);
            if (response.response.status === 200 && response.response.data) {
                setSqlTestResult(response.response.data as string);
            }
        } catch (error) {
            console.error("Error testing SQL query:", error);
        }
    };

    return (
        <Container style={{ marginTop: "20px" }}>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> / <a href="/metrics">Metrics</a> / <a href={`/metricdetail/${metric?.id}`}>{metric?.id}</a> </p>
            <h1>Metric Detail</h1>
            {metric && (
                <div style={{ margin: "20px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>ID:</strong> <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{metric.id}</div>
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Name:</strong> {editable ? <textarea name="name" value={metric.name} onChange={handleChange} style={{ width: "100%", resize: "none" }} /> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{metric.name}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>Description:</strong> {editable ? <textarea name="description" value={metric.description} onChange={handleChange} style={{ width: "100%", resize: "none" }} /> : <div style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{metric.description}</div>}
                    </div>
                    <div style={{ marginBottom: "10px" }}>
                        <strong>SQL Query:</strong>
                        {editable ? (
                            <textarea name="description" value={metric.sqlQuery} onChange={handleSqlQueryChange} style={{ width: "100%", resize: "none" }}/>
                        ) : (
                            <SyntaxHighlighter language="sql" customStyle={{ padding: "10px", backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                                {metric.sqlQuery}
                            </SyntaxHighlighter>

                        )}
                    </div>
                    {editable ? (
                        <>
                            <Button variant="success" className="me-2" onClick={handleSave}>Save Metric</Button>
                            <Button variant="danger" onClick={handleCancel}>Cancel</Button>
                        </>
                    ) : (
                        <Button variant="primary" className="mb-1" onClick={handleEdit}>Edit Metric</Button>
                    )}
                    {!editable &&
                    <div>
                        <hr/>
                        <div style={{ marginBottom: "20px" }}>
                            <Button variant="warning" className="me-2" onClick={handleTestSqlQuery}>Test SQL Query</Button>
                            <div>
                                <strong>Params:</strong> <textarea value={params} onChange={(e) => setParams(e.target.value)} rows={1} style={{ width: "100%", resize: "none" }} />
                            </div>
                        </div>
                        {sqlTestResult && (
                            <div style={{ marginBottom: "10px"}}>
                                <strong>SQL Test Result:</strong>
                                <textarea value={JSON.stringify(sqlTestResult, null, 2)} readOnly rows={8} style={{ width: "100%", resize: "vertical" }} />
                            </div>
                        )}
                    </div>}
                </div>
            )}
        </Container>
    );
};

export default MetricDetail;
