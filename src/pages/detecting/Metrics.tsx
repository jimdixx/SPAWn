import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Metric, fetchMetrics, fetchMetricDetail, deleteMetric } from "../../api/detecting/APIDetectingMetrics";
import {useAuth} from "react-oidc-context";
import {useNavigate} from "react-router-dom";

const Metrics = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const navigate = useNavigate();
    const auth = useAuth();

    const fetchMetricsData = async () => {
        const token = auth?.user?.access_token;
        if (!token) return;

        const response = await fetchMetrics(token);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            const fetchedData = response.response.data as Metric[];
            setMetrics(fetchedData);
        }
    };

    useEffect(() => {
        fetchMetricsData();
    }, []);

    const handleDetail = async (id: number) => {
        try {
            navigate("/metricdetail/" + id);
        } catch (error) {
            console.error("Error fetching metric detail:", error);
        }
    };

    const handleDelete = async (id: number) => {
        const token = auth?.user?.access_token;
        if (!token) return;

        try {
            await deleteMetric(id, token);
            const updatedMetrics = metrics.filter(metric => metric.id !== id);
            setMetrics(updatedMetrics);
            console.log("Metric with id", id, "deleted successfully.");
        } catch (error) {
            console.error("Error deleting metric:", error);
        }
    };

    return (
        <Container>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> / <a href="/metrics">Metrics</a> </p>
            <h1>Metrics</h1>
            <a href="/createmetric"><Button variant="success" className="mb-3">Create New Metric</Button></a>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map((metric) => (
                        <tr key={metric.id}>
                            <td>{metric.id}</td>
                            <td>{metric.name}</td>
                            <td>{metric.description}</td>
                            <td>
                                <Button variant="primary" className="me-2" onClick={() => handleDetail(metric.id)}>Detail</Button>
                                <Button variant="danger" onClick={() => handleDelete(metric.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Metrics;
