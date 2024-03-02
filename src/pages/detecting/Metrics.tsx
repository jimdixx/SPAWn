import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Metric, fetchMetrics, fetchMetricDetail, deleteMetric } from "../../api/detecting/APIDetectingMetrics";

const Metrics = () => {
    const [metrics, setMetrics] = useState<Metric[]>([]);

    const fetchData = async () => {
        try {
            const data = await fetchMetrics();
            setMetrics(data);
        } catch (error) {
            console.error("Error fetching metrics:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDetail = async (id: number) => {
        try {
            const metricDetail = await fetchMetricDetail(id);
            console.log("Detail for metric with id:", id, metricDetail);
        } catch (error) {
            console.error("Error fetching metric detail:", error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMetric(id);
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
