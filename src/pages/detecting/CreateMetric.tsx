import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Metric, createMetric } from "../../api/detecting/APIDetectingMetrics";
import { useAuth } from "react-oidc-context";
import { API_RESPONSE } from "../../components/api/ApiCaller";

interface APIMetricResponse {
  status: number;
  data?: Metric;
}

interface APICreateMetricResponse {
  redirect?: string;
  response?: APIMetricResponse;
}


const CreateMetric = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sqlQuery: ""
    });
    const navigate = useNavigate();
    const auth = useAuth();

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
            const token = auth?.user?.access_token;
            if (!token) return;

            const metricData: Metric = {
                id: 0,
                name: formData.name,
                description: formData.description,
                sqlQuery: formData.sqlQuery
            };


            const apiResponse: API_RESPONSE = await createMetric(metricData, token);
            const response: APICreateMetricResponse = {
              redirect: apiResponse.redirect,
              response: {
                status: apiResponse.response.status,
                data: apiResponse.response.data as Metric | undefined
              }
            };

            if (response.redirect) {
                navigate(response.redirect);
            } else {
                const responseData = response.response?.data;
                if (responseData) {
                    const createdMetricId = responseData.id;
                    navigate(`/metricDetail/${createdMetricId}`);
                } else {
                    console.error("Invalid response data:", response.response);
                }
            }
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
