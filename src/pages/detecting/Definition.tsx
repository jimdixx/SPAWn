import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Definition = () => {
    return (
        <Container>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> </p>
            <h1>Definition</h1>
            <Row>
                <Col style={{padding: '20px'}}>
                    <h3>Indicators (Anti-patterns)</h3>
                    <p>With the help of indicators, you can look for certain patterns or phenomena in the data and draw attention to them</p>
                    <a href="/indicators"><Button variant="primary">Go to Indicators</Button></a>
                </Col>
                <Col style={{padding: '20px'}}>
                    <h3>Metrics</h3>
                    <p>Metrics provide information about various project parameters</p>
                    <a href="/metrics"><Button variant="primary">Go to Metrics</Button></a>
                </Col>
            </Row>
        </Container>
    );
};

export default Definition;
