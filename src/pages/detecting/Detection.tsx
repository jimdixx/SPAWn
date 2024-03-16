import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Col, Row } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import { fetchProjects, Project } from "../../api/detecting/APIDetectingProjects";
import { fetchIndicators, Indicator } from "../../api/detecting/APIDetectingIndicators";
import { useNavigate } from "react-router-dom";

const Detection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
    const [selectedIndicators, setSelectedIndicators] = useState<Set<number>>(new Set());
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const token = auth?.user?.access_token;
            if (!token) {
                console.error("No token available");
                return;
            }

            try {
                const fetchedProjects = await fetchProjects(token);
                setProjects(fetchedProjects);

                const indicatorsResponse = await fetchIndicators(token);
                if (indicatorsResponse.response.status === 200 && Array.isArray(indicatorsResponse.response.data)) {
                    setIndicators(indicatorsResponse.response.data as Indicator[]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [auth?.user?.access_token]);

    const toggleProjectSelection = (id: number) => {
        const newSet = new Set(selectedProjects);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedProjects(newSet);
    };

    const toggleIndicatorSelection = (id: number) => {
        const newSet = new Set(selectedIndicators);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIndicators(newSet);
    };

    const selectAllProjects = () => {
        const newSet = new Set(projects.map(project => project.id));
        setSelectedProjects(newSet);
    };

    const unselectAllProjects = () => {
        setSelectedProjects(new Set());
    };

    const selectAllIndicators = () => {
        const newSet = new Set(indicators.map(indicator => indicator.id));
        setSelectedIndicators(newSet);
    };

    const unselectAllIndicators = () => {
        setSelectedIndicators(new Set());
    };

    const handleNextStep = () => {
        const selectedProjectsArray = Array.from(selectedProjects);
        const selectedIndicatorsArray = Array.from(selectedIndicators);

        localStorage.setItem('selectedProjects', JSON.stringify(selectedProjectsArray));
        localStorage.setItem('selectedIndicators', JSON.stringify(selectedIndicatorsArray));
        localStorage.setItem('indicators', JSON.stringify(indicators));

        navigate('/setparameters');
    };



    return (
        <Container>
            <h1>Detection</h1>
            <h2>Projects</h2>
            <Row className="mb-2">
                <Col>
                    <Button variant="secondary" size="sm" onClick={selectAllProjects}>Select All</Button>
                    <Button variant="secondary" size="sm" onClick={unselectAllProjects} className="ms-2">Unselect All</Button>
                </Col>
            </Row>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th style={{ width: '1%' }}>Select</th>
                        <th style={{ width: '1%' }}>ID</th>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((project) => (
                        <tr key={project.id} className={selectedProjects.has(project.id) ? 'table-primary' : ''}>
                            <td>
                                <Form.Check type="checkbox" checked={selectedProjects.has(project.id)} onChange={() => toggleProjectSelection(project.id)} />
                            </td>
                            <td>{project.id}</td>
                            <td>{project.name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <h2>Indicators</h2>
            <Row className="mb-2">
                <Col>
                    <Button variant="secondary" size="sm" onClick={selectAllIndicators}>Select All</Button>
                    <Button variant="secondary" size="sm" onClick={unselectAllIndicators} className="ms-2">Unselect All</Button>
                </Col>
            </Row>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th style={{ width: '1%' }}>Select</th>
                        <th style={{ width: '1%' }}>ID</th>
                        <th>Name</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {indicators.map((indicator) => (
                        <tr key={indicator.id} className={selectedIndicators.has(indicator.id) ? 'table-primary' : ''}>
                            <td>
                                <Form.Check type="checkbox" checked={selectedIndicators.has(indicator.id)} onChange={() => toggleIndicatorSelection(indicator.id)} />
                            </td>
                            <td>{indicator.id}</td>
                            <td>{indicator.name}</td>
                            <td>{indicator.indicatorType.type_name}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" onClick={handleNextStep}>Next Step</Button>
            </div>
        </Container>
    );
};

export default Detection;
