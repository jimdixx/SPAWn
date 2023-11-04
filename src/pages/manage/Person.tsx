import React, {useState} from "react";

const Person = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [projects, setProjects] = useState([]);
    const [people, setPeople] = useState([]);

    const handleProjectSelect = () => {
        // Handle project selection here
    };

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

    const mockData = [
        {
            name: "John Doe",
            identities: [
                { name: "Identity 1", email: "john.doe@example.com" },
                { name: "Identity 2", email: "john.doe2@example.com" }
            ]
        },
        {
            name: "Jane Doe",
            identities: [
                { name: "Identity 3", email: "jane.doe@example.com" },
                { name: "Identity 4", email: "jane.doe2@example.com" }
            ]
        }
    ];

    const mockProjects = [
        { id: 1, name: "Project 1" },
        { id: 2, name: "Project 2" },
        { id: 3, name: "Project 3" }
    ];

    return (
        <div>

            {errorMessage && (
                <div className="container">
                    <div className="alert alert-danger" role="alert">
                        {errorMessage}
                    </div>
                </div>
            )}

            {successMessage && (
                <div className="container">
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                </div>
            )}

            <div className="container">
                <h3 className="mb-4">Person editing</h3>

                <div className="col-auto">
                    <label className="custom-control-label align-middle mb-1" htmlFor="projectSelector">Select
                        project:</label>
                </div>
                <div className="col-auto">
                    <select
                        className="form-control"
                        name="selectedProject"
                        onChange={event => console.log(event.target.value)}
                        id="projectSelector"
                    >
                        <option value="">Select a project</option>
                        {mockProjects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                {
                    // BUTTON AND SEARCH BOX
                }

                <div className="d-flex mb-3 mt-3">
                    <button type='button' className='btn btn-outline-primary float-left' id="modalButton" data-bs-toggle="modal" data-bs-target="#newPerson">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-plus-square mb-1" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                        </svg>
                        Merge selected to new person
                    </button>
                    <div className="ms-2">
                        <input type="text" className="form-control" id="filterSearch" placeholder="Search" />
                        {
                        //onkeyup="findEntries()" was removed ! Todo
                        }
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
                        {mockData.map((person, personIndex) => (
                            person.identities.map((identity, index) => (
                                <tr key={`${person.name}_${index}`} className="entryLabel">
                                    {index === 0 && (
                                        <td rowSpan={person.identities.length} className="align-middle rowspanLabel">
                                            <div className="d-flex col-md-12 justify-content-between">
                                                <div className="d-flex justify-content-left">
                                                    <input type="checkbox" className="form-check-input" name="selectedBox" value={personIndex} id={`person_${personIndex}`} />
                                                    <label className="custom-control-label ms-2 personLabel" htmlFor={`person_${personIndex}`}>{person.name}</label>
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
                                                <label className="custom-control-label ms-2 fw-bold identityLabel" htmlFor={`person_${personIndex}`} >{identity.name}</label>
                                            </div>
                                        ) : (
                                            <div className='custom-control custom-checkbox'>
                                                <label className="custom-control-label ms-2 fw-bold identityLabel" htmlFor={`person_${personIndex}`} >{identity.email}</label>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {identity.email !== '' ? (
                                            <div>
                                                <label className="custom-control-label ms-2 emailLabel">{identity.email}</label>
                                            </div>
                                        ) : (
                                            <div>
                                                <label className="custom-control-label ms-2 emailLabel">-</label>
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

            </div>
        </div>
    );
};

export default Person;