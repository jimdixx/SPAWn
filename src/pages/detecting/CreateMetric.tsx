import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Hook pro historii navigace

const CreateMetric = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sqlQuery: ""
    });

    const navigate = useNavigate(); // Získání instance historie pro navigaci

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Zde by mělo být volání API pro vytvoření nové metriky s formData
            // Po vytvoření nové metriky získáte ID a můžete přesměrovat uživatele na její detail
            const createdMetricId = 1; // Předpokládáme získání ID nové metriky z API

            // Přesměrování na detail nově vytvořené metriky
            navigate(`/metricDetail/${createdMetricId}`);
        } catch (error) {
            console.error("Error creating metric:", error);
        }
    };

    return (
        <Container style={{ marginTop: "20px" }}>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> / <a href="/metrics">Metrics</a> / <a href="/createmetric">Create New Metric</a></p>
            <h1>Create New Metric</h1>
            <form onSubmit={handleFormSubmit} style={{ padding: "20px" }}>
                <div style={{ marginBottom: "10px" }}>
                    <strong>Name:</strong>{" "}
                    <textarea
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                        rows={1}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <strong>Description:</strong>{" "}
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                        rows={2}
                        required
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <strong>SQL Query:</strong>{" "}
                    <textarea
                        name="sqlQuery"
                        value={formData.sqlQuery}
                        onChange={handleInputChange}
                        style={{ width: "100%" }}
                        rows={5}
                        required
                    />
                </div>
                <Button variant="success" type="submit" style={{ marginRight: "10px" }}>Create Metric</Button>
                <a href="/metrics"><Button variant="danger">Cancel</Button></a>
            </form>
        </Container>
    );
};

export default CreateMetric;
