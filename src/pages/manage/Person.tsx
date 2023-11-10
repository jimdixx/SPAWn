import React, {useState, useEffect, ChangeEvent} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects, Persons, Identity, mergePersons} from "../../api/APIManagementPerson";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {Container, Button, Alert, Form, Col, InputGroup, FormControl} from "react-bootstrap";

const Person = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [fieldIsRequired, setFieldIsRequired] = useState(false);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [people, setPeople] = useState<Persons[]>([]);
    const [filteredPeople, setFilteredPeople] = useState<Persons[]>([]);
    const [userName, setUserName] = useState<string>("");
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [showMergeModal, setShowMergeModal] = useState(false);
    const [selectedPersons, setSelectedPersons] = useState<Persons[]>([]);
    const [selectedRadio, setSelectedRadio] = useState(1);
    const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
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
            setFilteredPeople(fetchedData);
        }
    };

    // Query for fetching projects
    const { error, data, status } = useQuery('projects', fetchProjectsData, {refetchOnWindowFocus: false});

    // Handling of project selection
    const handleProjectSelect = (projectIdString: string) => {
        const projectId = parseInt(projectIdString, 10);
        setSelectedProjectId(projectId); // triggers useEffect below
        setIsProjectSelected(true);
    };

    // Fetching new data when project is selected
    useEffect(() => {
        //console.log("Selected project id: ", selectedProjectId);
        if (selectedProjectId) {
            fetchPersonsData();
        }
        setSelectedRows([]);
        setIsAnyCheckboxSelected(false);
      }, [selectedProjectId]);

    // Filtering people when search query is typed
    useEffect(() => {
        const filteredPeople = searchQuery ? people.filter(person => person.name.toLowerCase().includes(searchQuery.toLowerCase())) : people;
        setFilteredPeople(filteredPeople);
    }, [searchQuery, people])

    // Hide "Filed is required" message
    useEffect(() => {
        setFieldIsRequired(false);
    }, [selectedRadio, showMergeModal])

    // Cleaning messages
    useEffect(() => {
        setSuccessMessage("");
        setErrorMessage("");
    }, [selectedProjectId, searchQuery])

    // Handling search query
    const handleFilterSearch = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setSearchQuery(value);
        //console.log(value);
    }

    // Handling check of any checkbox
    const handleCheckboxChange = (personIndex: number) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(personIndex)) {
                const updatedRows = prevSelectedRows.filter(index => index !== personIndex);
                setIsAnyCheckboxSelected(updatedRows.length > 0);
                return updatedRows;
            } else {
                const updatedRows = [...prevSelectedRows, personIndex];
                setIsAnyCheckboxSelected(true);
                return updatedRows;
            }
        });
    };

    // Updating list of selected persons when any checkbox is checked
    useEffect(() => {
        //console.log(selectedRows);
        const updateSelectedPersons = selectedRows.map(index => filteredPeople[index]);
        setSelectedPersons(updateSelectedPersons);
    }, [selectedRows, filteredPeople]);

    // Handling close of the modal window
    const handleCloseMergeModal = () => {
        const closeButton = document.querySelector('#newPerson button[data-bs-dismiss="modal"]') as HTMLButtonElement | null;

        if (closeButton) {
          closeButton.click();
        }
    };

    // Handling of merge request submit
    const handleCreatePersonSubmit = async () => {
        var response;
        if (selectedProjectId === undefined) {
            setErrorMessage("Projects was not correctly set");
            return;
        }
        if (selectedRadio === 1) {
           // "Write new" is selected
           const inputElement = document.getElementById("inputName") as HTMLInputElement;
           const newName = inputElement.value;

           if (newName.length === 0) {
               setFieldIsRequired(true);
               return;
           }

           response = await mergePersons(selectedProjectId, selectedPersons, undefined, newName);
        }
        else if (selectedRadio === 2 || selectedRadio === 3) {
            // "Select from people/identities" is selected
            const selectElement = document.getElementById("selectName") as HTMLSelectElement;
            var selectedIndex;
            if (selectedRadio === 2) {
                selectedIndex = selectElement.selectedIndex;
            }
            else {
                const [selectedPersonIndex] = selectElement.value.split('_');
                selectedIndex = parseInt(selectedPersonIndex, 10);
            }
            const selectedPerson = selectedPersons[selectedIndex];
            //console.log("Selected person:", selectedPerson);

            response = await mergePersons(selectedProjectId, selectedPersons, selectedPerson, undefined);
        }

        await fetchPersonsData();
        await handleCloseMergeModal();
        await setSelectedRows([]);

        if (response?.response?.status === 200) {
            setSuccessMessage(response?.response?.data as string);
        }
        else {
            setErrorMessage(response?.response?.data as string);
        }
    };

    // Show modal window with selected data
    const handleMergeSelected = () => {
        const selectedData = selectedRows.map(index => filteredPeople[index]);
        setShowMergeModal(true);
        //console.log("Selected Data:", selectedData);
    };

    // Setting number of selected radio button
    function radioSelection(number: number) {
        //console.log("radioSelection");
        setSelectedRadio(number);
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
                  onClick={handleMergeSelected}
                  disabled={!isAnyCheckboxSelected}
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
                          onChange={handleFilterSearch}
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
                                <input type="radio" name="radioBtn" onChange={() => radioSelection(1)} id="radio_1" value="0" className="me-1" checked={selectedRadio === 1}/>
                                <label htmlFor="radio_1">Write new</label>
                                <input type="radio" name="radioBtn" onChange={() => radioSelection(2)} id="radio_2" value="1" className="ms-2 me-1" checked={selectedRadio === 2}/>
                                <label htmlFor="radio_2">Select from people</label>
                                <input type="radio" name="radioBtn" onChange={() => radioSelection(3)} id="radio_3" value="2" className="ms-2 me-1" checked={selectedRadio === 3}/>
                                <label htmlFor="radio_3">Select from identities</label>
                            </div>
                            {fieldIsRequired && (
                                <div className="text-danger mt-1">This field is required.</div>
                            )}
                            <div className="d-flex mb-2 mt-2">
                                {selectedRadio === 1 && (
                                    <input type="text" className="form-control" id="inputName" name="personName" placeholder="Name" maxLength={50} />
                                )}
                                {(selectedRadio === 2 || selectedRadio === 3) && (
                                    <select className="form-control" id="selectName" name="personName">
                                        {selectedRadio === 2 ? (
                                            selectedPersons.map((person, index) => (
                                                <option key={index} value={index}>
                                                    {person.name}
                                                </option>
                                            ))
                                        ) : (
                                            selectedPersons.map((person, personIndex) => (
                                                person.identities.map((identity, index) => (
                                                    <option key={`${person.name}_${index}`} value={`${personIndex}_${index}`}>
                                                        {identity.name === '' ? person.name : identity.name}
                                                    </option>
                                                ))))
                                        )
                                        }
                                    </select>
                                )}
                            </div>
                            <p>All selected entries ({selectedRows.length}) will be assign to this object</p>
                        </div>
                        <div className="modal-footer">
                            <button type="submit" className="btn btn-primary" name="submitId" value="defaultValue" onClick={handleCreatePersonSubmit}>Create person with selected people</button>
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
                    {filteredPeople.map((person, personIndex) => (
                        person.identities.map((identity, index) => (
                            <tr key={`${person.name}_${index}`} className="entryLabel">
                                {index === 0 && (
                                    <td rowSpan={person.identities.length} className="align-middle rowspanLabel">
                                        <div className="d-flex col-md-12 justify-content-between">
                                            <div className="d-flex justify-content-left">
                                                <input type="checkbox" className="form-check-input" name="selectedBox" value={personIndex} onChange={() => handleCheckboxChange(personIndex)} id={`person_${personIndex}`}  checked={selectedRows.includes(personIndex)} />
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

            {selectedProjectId === undefined && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>Select a project to view people with identities</h5>
                </div>
            )}

            {people !== null && people.length === 0 && selectedProjectId !== undefined && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>The project has no people</h5>
                </div>
            )}
        </Container>
    );
};

export default Person;