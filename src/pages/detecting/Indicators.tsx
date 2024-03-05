import React, { useState, useEffect } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchIndicators, deleteIndicator, Indicator } from "../../api/detecting/APIDetectingIndicators";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

const Indicators = () => {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const navigate = useNavigate();
    const auth = useAuth();

    const fetchIndicatorsData = async () => {
        const token = auth?.user?.access_token;
        if (!token) return;

        try {
            const response = await fetchIndicators(token);
            if (response.redirect) {
                navigate(response.redirect);
            } else {
                setIndicators(response.response.data as Indicator[]);
            }
        } catch (error) {
            console.error("Error fetching indicators:", error);
        }
    };

    useEffect(() => {
        fetchIndicatorsData();
    }, []);

    const handleDelete = async (id: number) => {
        const token = auth?.user?.access_token;
        if (!token) return;

        try {
            await deleteIndicator(id, token);
            const updatedIndicators = indicators.filter(indicator => indicator.id !== id);
            setIndicators(updatedIndicators);
            console.log("Indicator with id", id, "deleted successfully.");
        } catch (error) {
            console.error("Error deleting indicator:", error);
        }
    };

    return (
        <Container>
            <h1>Indicators</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Indicator Type</th>
                        <th>Script Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {indicators.map((indicator) => (
                        <tr key={indicator.id}>
                            <td>{indicator.id}</td>
                            <td>{indicator.name}</td>
                            <td>{indicator.description}</td>
                            <td>{indicator.indicatorType}</td>
                            <td>{indicator.scriptType}</td>
                            <td>
                                <Link to={`/indicatorDetail/${indicator.id}`} className="btn btn-primary me-2">View</Link>
                                <Button variant="danger" onClick={() => handleDelete(indicator.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Indicators;
