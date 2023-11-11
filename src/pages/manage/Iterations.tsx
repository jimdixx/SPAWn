import React, {useState, useEffect, ChangeEvent} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects, Persons, Identity, mergePersons} from "../../api/APIManagementPerson";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {Container, Button, Alert, Form, Col, InputGroup, FormControl} from "react-bootstrap";

const Iterations = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [fieldIsRequired, setFieldIsRequired] = useState(false);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [userName, setUserName] = useState<string>("");
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const navigate = useNavigate();

    // Fetching projects data
    const fetchProjectsData = async () => {
        const userName:string = retrieveUsernameFromStorage();

        if (!userName) {
            return;
        }

        setUserName(userName);

        const response = await fetchProjects(userName);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as Projects[];
            setProjects(fetchedData);
        }
    };

    // Query for fetching projects
    const { error, data, status } = useQuery('projects', fetchProjectsData, {refetchOnWindowFocus: false});

    // Handling of project selection
    const handleProjectSelect = (projectIdString: string) => {
        const projectId = parseInt(projectIdString, 10);
        console.log(projectId);
        setSelectedProjectId(projectId); // triggers useEffect below
        setIsProjectSelected(true);
    };

    return (
        <Container>
            {errorMessage && (
                <Alert variant="danger" className="my-3">
                    {errorMessage}
                </Alert>
            )}
            {successMessage && (
                <Alert variant="success" className="my-3">
                    {successMessage}
                </Alert>
            )}

            <h3>Iteration and Phases</h3>
            <Col xs="auto">
                <Form.Group>
                    <Form.Label className="mb-1">Select project:</Form.Label>
                    <Form.Control
                        as="select"
                        name="selectedProject"
                        onChange={event => handleProjectSelect(event.target.value)}
                        id="projectSelector"
                    >
                        <option value="" disabled={isProjectSelected}>Select a project</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </Form.Control>
                </Form.Group>
            </Col>

            {
                // BUTTON AND SEARCH BOX
            }
        </Container>
    );

}

export default Iterations;
