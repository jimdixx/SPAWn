import React, {useState, useEffect} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects, Persons, Identity} from "../../api/APIManagementPerson";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {Container, Button, Alert, Form, Col, InputGroup, FormControl} from "react-bootstrap";

const Person = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [people, setPeople] = useState<Persons[]>([]);
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

    // Fetching persons data
    const fetchPersonsData = async () => {
        const userName:string = retrieveUsernameFromStorage();

        if (!userName) {
            return;
        }

        setUserName(userName);

        const response = await fetchPersons(userName, selectedProjectId);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as Persons[];
            setPeople(fetchedData);
        }
    };

    // Query for fetching projects
    const { error, data, status } = useQuery('projects', fetchProjectsData, {refetchOnWindowFocus: false});

    const handleProjectSelect = (projectIdString: string) => {
        const projectId = parseInt(projectIdString, 10);
        setSelectedProjectId(projectId); // triggers useEffect below
        setIsProjectSelected(true);
    };

    useEffect(() => {
        //console.log("Selected project id: ", selectedProjectId);
        if (selectedProjectId) {
            fetchPersonsData();
        }
      }, [selectedProjectId]);

    const handleFilterSearch = () => {
        // Handle filter search here
    };

    const handleModalButtonClick = () => {
        // Handle modal button click here
    };

    const handleRadioSelection = () => {
        // Handle radio selection here
    };

    const handleCreatePersonSubmit = (event: any) => {
        event.preventDefault();
        // Handle create person form submission here
    };

    function radioSelection(number: number) {
        console.log("radioSelection");
    }

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

            <h3>Persons</h3>
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

            <div className="d-flex mb-3 mt-3">
                <Button
                  variant="outline-primary"
                  className="float-left"
                  id="modalButton"
                  data-bs-toggle="modal"
                  data-bs-target="#newPerson"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-plus-square mb-1" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                    </svg>
                    {" "}
                    Merge selected to new person
                </Button>
                <div className="ms-2">
                    <InputGroup>
                        <FormControl
                          type="text"
                          placeholder="Search"
                          id="filterSearch"
                        />
                        {
                        // onKeyUp handler can be added here for the "findEntries" functionality
                        }
                    </InputGroup>
                </div>
            </div>

            {
                // END OF THE BUTTON AND SEARCH BOX
            }
            {
                // MODAL FOR ENTERING NAME
            }

            <div className="modal fade" id="newPerson" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="newPersonLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="newPersonLabel">Merge selected to new person</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <input type="radio" name="radioBtn" onInput={() => radioSelection(1)} id="radio_1" value="0" />
                                <label htmlFor="radio_1">Write new</label>
                                <input type="radio" name="radioBtn" onInput={() => radioSelection(2)} id="radio_2" value="1" className="ms-2" />
                                <label htmlFor="radio_2">Select from identities</label>
                                <input type="radio" name="radioBtn" onInput={() => radioSelection(3)} id="radio_3" value="2" className="ms-2" />
                                <label htmlFor="radio_3">Select from people</label>
                            </div>
                            <div className="d-flex mb-2 mt-2">
                                <input type="text" className="form-control" id="inputName" name="personName" placeholder="Name" />
                                <select className="form-control" id="selectName" name="personName"></select>
                                <select className="form-control" id="selectPerson" name="personName"></select>
                            </div>
                            <p id="countedChecked"></p>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" name="submitId" value="defaultValue">Create person with selected people</button>
                        </div>
                    </div>
                </div>
            </div>
            {
                // END OF MODAL FOR ENTERING NAME
            }
            {
                // TABLE CONTENT
            }

            <div className="table-responsive">
                <table className="table table-bordered" id="data">
                    <thead>
                    <tr>
                        <th scope="col">Person</th>
                        <th scope="col">Identity</th>
                        <th scope="col">Email</th>
                    </tr>
                    </thead>
                    <tbody>
                    {people.map((person, personIndex) => (
                        person.identities.map((identity, index) => (
                            <tr key={`${person.name}_${index}`} className="entryLabel">
                                {index === 0 && (
                                    <td rowSpan={person.identities.length} className="align-middle rowspanLabel">
                                        <div className="d-flex col-md-12 justify-content-between">
                                            <div className="d-flex justify-content-left">
                                                <input type="checkbox" className="form-check-input" name="selectedBox" value={personIndex} id={`person_${personIndex}`} />
                                                <label className="custom-control-label ms-2 personLabel" style={{ fontSize: '0.75em' }} htmlFor={`person_${personIndex}`}>{person.name}</label>
                                            </div>
                                            <button type="submit" className="btn btn-sm btn-outline-primary" name="submitId" value={personIndex}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-person-circle mb-1" viewBox="0 0 16 16">
                                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                                                    <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                )}
                                <td>
                                    {identity.name !== '' ? (
                                        <div className='custom-control custom-checkbox'>
                                            <label className="custom-control-label ms-2 fw-bold identityLabel" style={{ fontSize: '0.75em' }} htmlFor={`person_${personIndex}`} >{identity.name}</label>
                                        </div>
                                    ) : (
                                        <div className='custom-control custom-checkbox'>
                                            <label className="custom-control-label ms-2 fw-bold identityLabel" style={{ fontSize: '0.75em' }} htmlFor={`person_${personIndex}`} >{person.name}</label>
                                        </div>
                                    )}
                                </td>
                                <td>
                                    {identity.email !== '' ? (
                                        <div>
                                            <label className="custom-control-label ms-2 emailLabel" style={{ fontSize: '0.75em' }}>{identity.email}</label>
                                        </div>
                                    ) : (
                                        <div>
                                            <label className="custom-control-label ms-2 emailLabel" style={{ fontSize: '0.75em' }}>-</label>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    ))}
                    </tbody>
                </table>
            </div>

            {
                // END OF THE TABLE CONTENT
            }

            {people === null && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>Select a project to view people with identities</h5>
                </div>
            )}

            {people !== null && people.length === 0 && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>The project has no people</h5>
                </div>
            )}
        </Container>
    );
};

export default Person;