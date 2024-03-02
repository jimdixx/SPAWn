import React, { useState, useEffect } from "react";
import { Container, Button, Dropdown, Row, Col } from "react-bootstrap";
import { Metric } from "../../api/detecting/APIDetectingMetrics";

const MetricDetail = () => {
    const [metric, setMetric] = useState<Metric | null>(null);
    const [editable, setEditable] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<string>("");
    const [sqlTestResult, setSqlTestResult] = useState<string>("");

    useEffect(() => {
        const fetchMetric = async () => {
            try {
                const mockMetric: Metric = {
                    id: 1,
                    name: "selectNumberOfIterations",
                    description: "Select number of iterations for given project id",
                    sql_query: "SELECT COUNT(id) AS 'numberOfIterations' FROM iter...",
                };
                setMetric(mockMetric);
            } catch (error) {
                console.error("Error fetching metric detail:", error);
            }
        };

        fetchMetric();
    }, []);

    const handleEdit = () => {
        setEditable(true);
    };

    const handleSave = async () => {
        try {
            if (metric) {
                console.log("Metric updated successfully.");
                setEditable(false);
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

    const handleTestSqlQuery = () => {
        const result = "Test result";
        setSqlTestResult(result);
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
                        <strong>SQL Query:</strong> {editable ? <textarea name="sql_query" value={metric.sql_query} onChange={handleChange} rows={5} style={{ width: "100%", resize: "none" }} /> : <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{metric.sql_query}</pre>}
                    </div>
                    {editable ? (
                        <Button variant="success" onClick={handleSave}>Save Metric</Button>
                    ) : (
                        <Button variant="primary" className="mb-4" onClick={handleEdit}>Edit Metric</Button>
                    )}
                    {!editable &&
                    <div>
                        <div style={{ display: "flex", marginBottom: "20px" }}>
                            <Button variant="warning" className="me-2" onClick={handleTestSqlQuery}>Test SQL Query</Button>
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    Select project to test on:
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => setSelectedProject("Project 1")}>Project 1</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedProject("Project 2")}>Project 2</Dropdown.Item>
                                    <Dropdown.Item onClick={() => setSelectedProject("Project 3")}>Project 3</Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        {sqlTestResult && (
                            <div style={{ marginBottom: "10px" }}>
                                <strong>SQL Test Result:</strong>
                                <pre style={{ background: "#f5f5f5", padding: "10px", borderRadius: "5px" }}>{sqlTestResult}</pre>
                            </div>
                        )}
                    </div>}
                </div>
            )}
        </Container>
    );
};

export default MetricDetail;
