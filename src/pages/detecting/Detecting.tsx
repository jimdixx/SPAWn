import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Detecting = () => {
    return (
        <Container>
            <h1>Detecting</h1>
            <Row>
                <Col style={{padding: '20px'}}>
                    <h3>Detection</h3>
                    <p>Analyze project data for the presence of anti-patterns, bad practices or arbitrary indicators and get valuable results for your project management</p>
                    <a href="/detection"><Button variant="primary">Go to Detection</Button></a>
                </Col>
                <Col style={{padding: '20px'}}>
                    <h3>Definition</h3>
                    <p>Define anti-patterns, bad practices or indicators and metrics to detect or view or edit already defined ones</p>
                    <a href="/definition"><Button variant="primary">Go to Definition</Button></a>
                </Col>
            </Row>
        </Container>
    );
};

export default Detecting;
