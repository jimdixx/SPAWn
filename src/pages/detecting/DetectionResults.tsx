import React, { useEffect, useState } from "react";
import { Container, Accordion, Card, Button } from "react-bootstrap";

interface DetectionResult {
    projectId: number;
    result: boolean;
    finished: boolean;
    additionalData: any; // Zvažte definování přesnějšího typu
}

const DetectionResults = () => {
    const [results, setResults] = useState<DetectionResult[]>([]);

    useEffect(() => {
        const storedResults = localStorage.getItem('detectionResults');
        if (storedResults) {
            const parsedResults = JSON.parse(storedResults);
            setResults(parsedResults.response.data || []);
        }
    }, []);

    const renderAdditionalData = (data: any): JSX.Element[] => {
        return Object.entries(data).map(([key, value], index) => {
            if (Array.isArray(value)) {
                return (
                    <div key={index}>
                        <strong>{key}:</strong>
                        <ul>
                            {value.map((item, idx) => (
                                <li key={idx}>{JSON.stringify(item)}</li>
                            ))}
                        </ul>
                    </div>
                );
            }
            return (
                <div key={index}>
                    <strong>{key}:</strong> {JSON.stringify(value)}
                </div>
            );
        });
    };

    return (
        <Container>
            <h1>Detection Results</h1>
            {results.length > 0 ? (
                <Accordion defaultActiveKey="0">
                    {results.map((result, index) => (
                        <Accordion.Item eventKey={`${index}`} key={index}>
                            <Accordion.Header>
                                Project ID: {result.projectId} - Result: {result.result ? "Success" : "Failure"}
                            </Accordion.Header>
                            <Accordion.Body>
                                <p>Finished: {result.finished.toString()}</p>
                                {renderAdditionalData(result.additionalData)}
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            ) : "No results found."}
        </Container>
    );
};

export default DetectionResults;
