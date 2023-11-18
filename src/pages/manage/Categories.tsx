import React, { useState, useEffect } from "react";
import {message} from "antd";
import {Col, Container, Form} from "react-bootstrap";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {fetchProjects, Projects} from "../../api/APIManagementPerson";
import {Category, fetchCategories, ApiResponse } from "../../api/APIManagementCategories";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";

const Categories = () => {

    const [showError, setShowError] = useState("");
    const [showSuccess, setShowSuccess] = useState("");
    const [showInform, setShowInform] = useState("");
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [userName, setUserName] = useState<string>("");
    const [projects, setProjects] = useState<Projects[]>([]);
    const [filterSearch, setFilterSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [isAnyCheckboxSelected, setIsAnyCheckboxSelected] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const navigate = useNavigate();

    const handleCheckboxChange = (id: number) => {
        setSelectedRows(prevSelectedRows => {
            if (prevSelectedRows.includes(id)) {
                const updatedRows = prevSelectedRows.filter(index => index !== id);
                setIsAnyCheckboxSelected(updatedRows.length > 0);
                return updatedRows;
            } else {
                const updatedRows = [...prevSelectedRows, id];
                setIsAnyCheckboxSelected(true);
                return updatedRows;
            }
        });
    };
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

    const fetchCategoriesData = async () => {
        const userName: string = retrieveUsernameFromStorage();

        if (!userName) {
            return;
        }

        setUserName(userName);

        const response = await fetchCategories(userName, selectedProjectId);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            const apiResponse: ApiResponse = response.response.data as ApiResponse;
            //console.log(apiResponse.responseBody);
            let fetchedData = apiResponse.responseBody || [];
            setCategories(fetchedData);
        }
};


    const { error, data, status } = useQuery('projects', fetchProjectsData, {refetchOnWindowFocus: false});

    // Fetching new data when project is selected
    useEffect(() => {
        //console.log("Selected project id: ", selectedProjectId);
        if (selectedProjectId) {
            fetchCategoriesData();
        }
    }, [selectedProjectId]);

    const handleProjectSelect = (projectIdString: string) => {
        const projectId = parseInt(projectIdString, 10);
        setSelectedProjectId(projectId); // triggers useEffect below
        setIsProjectSelected(true);
    };

    const handleFormSubmit = (submitId: number) => {
        // Handle form submit logic
        console.log(`Form submitted with submitId: ${submitId}`);
    };

    return (
        <Container>
            {/* Container for show error message */}
            <div className="container">
                {showError && (
                    <div className="alert alert-danger" role="alert">
                        {showError}
                    </div>
                )}
            </div>
            {/* ./Container for show error message */}

            {/* Container for show success message */}
            <div className="container">
                {showSuccess && (
                    <div className="alert alert-success d-flex justify-content-between" role="alert">
                        <p className="m-0">{showSuccess}</p>
                        <a className="alert-link float-right" data-bs-toggle="modal" data-bs-target="#logMessage">
                            See all
                        </a>
                    </div>
                )}
            </div>
            {/* ./Container for show success message */}

            {/* Container for show inform message */}
            <div className="container">
                {showInform && (
                    <div className="alert alert-warning d-flex justify-content-between" role="alert">
                        <p className="m-0">{showInform}</p>
                        <a className="alert-link float-right" data-bs-toggle="modal" data-bs-target="#logMessage">
                            See all
                        </a>
                    </div>
                )}
            </div>
            {/* ./Container for show inform message */}

            {/* Container for modal */}
            <div className="modal fade" id="logMessage" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="logMessageLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="logMessageLabel">
                                Category assign log
                            </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p style={{ whiteSpace: "pre" }}></p>
                        </div>
                    </div>
                </div>
            </div>
            {/* ./Container for modal */}


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

            <form action="#" method="post">
                {categories && categories.length > 0 && (
                    <>
                        <div className="d-flex mb-2 mt-3">
                            <button type="submit" className="btn btn-outline-primary" name="submitType" value="1">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"
                                     className="bi bi-arrow-clockwise mb-1" viewBox="0 0 16 16" style={{ marginRight: '0.2em' }}>
                                    <path fillRule="evenodd"
                                          d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                    <path
                                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                </svg>
                                Make selected as Iteration
                            </button>

                            <button type="submit" className="btn btn-outline-primary ms-2" name="submitType" value="2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"
                                     className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16" style={{ marginRight: '0.2em' }}>
                                    <path
                                        d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.578 3.578 0 0 0-.108-.563 2.22 2.22 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2.35 2.35 0 0 0-.16-.045 3.797 3.797 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.552 2.552 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526l.24-2.408Zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361.599.599.437 1.732-.36 2.531Z"/>
                                    <path
                                        d="M5.205 10.787a7.632 7.632 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925Z"/>
                                </svg>
                                Make selected as Phase
                            </button>

                            <button type="submit" className="btn btn-outline-primary ms-2" name="submitType" value="3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor"
                                     className="bi bi-activity" viewBox="0 0 16 16" style={{ marginRight: '0.2em' }}>
                                    <path fillRule="evenodd"
                                          d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
                                </svg>
                                Make selected as Activity
                            </button>

                            <div className="ms-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="filterSearch"
                                    placeholder="Search"
                                    value={filterSearch}
                                    onChange={(e) => setFilterSearch(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <thead>
                                <tr>
                                    <th scope="col" style={{ width: '100%' }}>
                                        Name
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {categories.map((category) => (
                                    <tr key={category.id} className="entryLabel">
                                        <td className="text-center">
                                            <div className="custom-control custom-checkbox d-flex">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="selectedBox"
                                                    value={category.id}
                                                    id={`category_${category.id}`}
                                                    checked={selectedIds.includes(category.id)}
                                                    onChange={() => handleCheckboxChange(category.id)}
                                                />
                                                <label className="custom-control-label ms-2 nameLabel" htmlFor={`category_${category.id}`} style={{ fontSize: '0.75em' }}>
                                                    {category.name}
                                                </label>
                                                <div className="ms-auto">
                                                    {[1, 2, 3].map((submitId) => (
                                                        <button
                                                            key={submitId}
                                                            type="submit"
                                                            className="btn btn-sm btn-outline-primary me-1"
                                                            name="submitId"
                                                            value={`${submitId}_${category.id}`}
                                                            onClick={() => handleFormSubmit(submitId)}
                                                        >
                                                            {submitId === 1 && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-arrow-clockwise mb-1" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"/>
                                                                    <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z"/>
                                                                </svg>
                                                            )}
                                                            {submitId === 2 && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-rocket-takeoff-fill" viewBox="0 0 16 16">
                                                                    <path d="M12.17 9.53c2.307-2.592 3.278-4.684 3.641-6.218.21-.887.214-1.58.16-2.065a3.578 3.578 0 0 0-.108-.563 2.22 2.22 0 0 0-.078-.23V.453c-.073-.164-.168-.234-.352-.295a2.35 2.35 0 0 0-.16-.045 3.797 3.797 0 0 0-.57-.093c-.49-.044-1.19-.03-2.08.188-1.536.374-3.618 1.343-6.161 3.604l-2.4.238h-.006a2.552 2.552 0 0 0-1.524.734L.15 7.17a.512.512 0 0 0 .433.868l1.896-.271c.28-.04.592.013.955.132.232.076.437.16.655.248l.203.083c.196.816.66 1.58 1.275 2.195.613.614 1.376 1.08 2.191 1.277l.082.202c.089.218.173.424.249.657.118.363.172.676.132.956l-.271 1.9a.512.512 0 0 0 .867.433l2.382-2.386c.41-.41.668-.949.732-1.526l.24-2.408Zm.11-3.699c-.797.8-1.93.961-2.528.362-.598-.6-.436-1.733.361-2.532.798-.799 1.93-.96 2.528-.361.599.599.437 1.732-.36 2.531Z"/>
                                                                    <path d="M5.205 10.787a7.632 7.632 0 0 0 1.804 1.352c-1.118 1.007-4.929 2.028-5.054 1.903-.126-.127.737-4.189 1.839-5.18.346.69.837 1.35 1.411 1.925Z"/>
                                                                </svg>
                                                            )}
                                                            {submitId === 3 && (
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" className="bi bi-activity" viewBox="0 0 16 16">
                                                                    <path fillRule="evenodd" d="M6 2a.5.5 0 0 1 .47.33L10 12.036l1.53-4.208A.5.5 0 0 1 12 7.5h3.5a.5.5 0 0 1 0 1h-3.15l-1.88 5.17a.5.5 0 0 1-.94 0L6 3.964 4.47 8.171A.5.5 0 0 1 4 8.5H.5a.5.5 0 0 1 0-1h3.15l1.88-5.17A.5.5 0 0 1 6 2Z"/>
                                                                </svg>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </form>

            {selectedProjectId === undefined && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>Select a project to view categories</h5>
                </div>
            )}

            {categories !== null && categories.length === 0 && selectedProjectId !== undefined && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>The project has no categories</h5>
                </div>
            )}

        </Container>
    );
};

export default Categories;
