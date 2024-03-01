import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

const Definition = () => {
    return (
        <Container>
            <h1>Definition</h1>
            <Row>
                <Col style={{padding: '20px'}}>
                    <h3>Indicators</h3>
                    <p>todo</p>
                    <a href="/indicators"><Button variant="primary">Go to Indicators</Button></a>
                </Col>
                <Col style={{padding: '20px'}}>
                    <h3>Metrics</h3>
                    <p>todo</p>
                    <a href="/metrics"><Button variant="primary">Go to Metrics</Button></a>
                </Col>
            </Row>
        </Container>
    );
};

export default Definition;
