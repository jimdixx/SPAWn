import React, { useState, useEffect } from "react";
import { Container, Table, Form, Button, Col, Row, Dropdown } from "react-bootstrap";
import { useAuth } from "react-oidc-context";
import { fetchProjects, Project } from "../../api/detecting/APIDetectingProjects";
import { fetchIndicators, Indicator } from "../../api/detecting/APIDetectingIndicators";
import { useNavigate } from "react-router-dom";

const Detection = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<Set<number>>(new Set());
    const [selectedIndicators, setSelectedIndicators] = useState<Set<number>>(new Set());
    const [filterType, setFilterType] = useState('All');
    const [indicatorTypes, setIndicatorTypes] = useState<string[]>([]);
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

    useEffect(() => {
        const savedProjects = localStorage.getItem('selectedProjects');
        const savedIndicators = localStorage.getItem('selectedIndicators');

        if (savedProjects) {
            const selectedProjectsArray = JSON.parse(savedProjects).map((item: { id: number }) => item.id);
            setSelectedProjects(new Set(selectedProjectsArray));
        }

        if (savedIndicators) {
            const selectedIndicatorsArray = JSON.parse(savedIndicators);
            setSelectedIndicators(new Set(selectedIndicatorsArray));
        }
    }, []);

    useEffect(() => {
            // Možné budete chtít tuto logiku upravit, aby odpovídala vašemu způsobu načítání dat
            const uniqueTypes = Array.from(new Set(indicators.map(indicator => indicator.indicatorType.type_name)));
            // Přidání možnosti "All" pro zobrazení všech
            setIndicatorTypes(['All', ...uniqueTypes]);
        }, [indicators]);

    let filteredIndicators = filterType === 'All' ? indicators : indicators.filter(indicator => indicator.indicatorType.type_name === filterType);

        // Zahrnutí vybraných indikátorů, které nejsou ve filtrovaném seznamu
        const selectedAndFilteredIndicators = [...filteredIndicators, ...indicators.filter(indicator => selectedIndicators.has(indicator.id) && !filteredIndicators.includes(indicator))];


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
        const selectedProjectsInfo = Array.from(selectedProjects).map(projectId => {
                const project = projects.find(p => p.id === projectId);
                return { id: projectId, name: project ? project.name : '' };
        });

        const selectedIndicatorsArray = Array.from(selectedIndicators);

        localStorage.setItem('selectedProjects', JSON.stringify(selectedProjectsInfo));
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
                                    <th style={{ width: '50%' }}>Name</th>
                                    <th>
                                        Type
                                        <Dropdown>
                                            <Dropdown.Toggle variant="secondary" size="sm" id="dropdown-basic">
                                                {filterType}
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                {indicatorTypes.map((type, index) => (
                                                    <Dropdown.Item key={index} onClick={() => setFilterType(type)}>{type}</Dropdown.Item>
                                                ))}
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedAndFilteredIndicators.map((indicator) => (
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
                <Button variant="primary" onClick={handleNextStep} disabled={selectedProjects.size === 0 || selectedIndicators.size === 0}>Next Step</Button>
            </div>
        </Container>
    );
};

export default Detection;
