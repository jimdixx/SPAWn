import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, ProjectData, saveProjects} from "../../api/APIManagementProjects";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import Project from "../../components/manage/Project";
import { Spinner, Container, Row, Col, Button, Form, Alert } from "react-bootstrap";
import { Spin } from 'antd';
import {useAuth} from "react-oidc-context";

const Projects = () => {
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [superProjectName, setSuperProjectName] = useState("");
    const [superProjectDescription, setSuperProjectDescription] = useState("");
    const [superProjectFakedId, setSuperProjectFakedId] = useState(-1);
    const [projectError, setProjectError] = useState("");
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [wasChanged, setWasChanged] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [sucMsg, setSucMsg] = useState('');
    const auth = useAuth();

    // Fetching projects data
    const fetchData = async () => {
        const userName:string | undefined = auth?.user?.profile?.preferred_username;

        if(!userName) {
            return;
        }

        setUserName(userName);

        let token = auth?.user?.access_token;
        if (!token) token = "";

        const response = await fetchProjects(token, userName);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as ProjectData[];

            // Create a fake root project for the top-level hierarchy
            const fakeParent = {
                project: {
                    id: 0,
                    name: "",
                    description: "ROOT"
                },
                children: [],
            }

            let updatedData = fetchedData
            let fakeParentChildren = fakeParent.children as ProjectData[];

            updatedData.forEach(e => {
                fakeParentChildren.push(e);
            });

            updatedData.unshift(fakeParent);

            updatedData = updatedData.filter(e => e.project.id === 0);

            setProjectData(updatedData);

            setLoading(false);
        }
    };

    // Prompting unsaved changes warning before leaving the page
    useEffect(() => {
      const handleLeavePage = (e: BeforeUnloadEvent) => {
        if (wasChanged) {
          e.preventDefault();
          e.returnValue = 'You have unsaved changes. Are you sure you want to leave this page?';
        }
      };

      window.addEventListener('beforeunload', handleLeavePage);

      return () => {
        window.removeEventListener('beforeunload', handleLeavePage);
      };
    }, [wasChanged]);



    //  Create a new superproject
    const addSuperProject = () => {
        if (!superProjectName && !superProjectDescription) {
            setProjectError("Fill all the fields!");
            return;
        }
        console.log(`create new project with name ${superProjectName}, ${superProjectDescription}`);

        const newSuperProject = {
            project: {
                id: superProjectFakedId,
                name: superProjectName,
                description: superProjectDescription
            },
            children: [],
        }
        setSuperProjectFakedId((prevValue) => prevValue - 1);

        let projectDataToUpdate = [...projectData];
        let root = projectDataToUpdate.filter(e => e.project.id === 0)[0];
        root.children.push(newSuperProject);

        setProjectData(projectDataToUpdate);

        // Clear the input values after submission
        setSuperProjectName('');
        setSuperProjectDescription('');
    };

    // Query for fetching project data
    const { error, data, status } = useQuery('projects', fetchData,{ refetchOnWindowFocus: false});

    // Handling drag and drop to move a project
    const handleMove = (projectIdFrom: number, projectIdTo: number) => {
        setErrMsg('');
        setSucMsg('');

        let fromParent: ProjectData | undefined = undefined;
        let toParent: ProjectData | undefined = undefined;

        // Project cannot be dropped on itself
        if (projectIdFrom === projectIdTo) {
            //console.log("Project dropped on itself");
            return;
        }

        /*
         Bfs tree search algorithm
         project: project in whose children to look for
         projectIdToFind: project id to find
         return: id of the parent of the project to find
        */
        const bfsTreeSearch = (project: ProjectData, projectIdToFind: number) => {
            let projectParent: ProjectData | undefined = undefined;

            if (project.children.length !== 0) {
                let queue = [] as ProjectData[]

                project.children.forEach(e => {
                    e.parent = project;
                    queue.push(e as ProjectData)
                });

                while (queue.length !== 0) {
                    let currProject = queue.shift() as ProjectData;

                    if (currProject.project.id === projectIdToFind) {
                        return currProject.parent;
                    }

                    currProject.children.forEach(e => {
                        e.parent = currProject;
                        queue.push(e as ProjectData);
                    })
                }
            }

            return projectParent;
        }

        let updatedData = [...projectData];

        // Trying to find project in the root projects
        fromParent = updatedData.find(item => item.project.id === projectIdFrom);
        toParent = updatedData.find(item => item.project.id === projectIdTo);

        let isProjectFromRoot = false;

        // If from project is not from the root, then use bfs to find it (its parent)
        if (!fromParent) {
            for (let i = 0; i < updatedData.length; i++) {
                fromParent = bfsTreeSearch(updatedData[i], projectIdFrom);
                if (fromParent !== undefined) {
                    break;
                }
            }
        } else {
            isProjectFromRoot = true;
        }

        // Move condition: Project cannot be dropped on its direct parent
        if (projectIdTo === fromParent?.project.id) {
            //console.log("Project dropped on its direct parent.");
            return;
        }

        // Move condition: Project cannot be dropped on its descendant
        if (fromParent) {
            let projectFrom: ProjectData | undefined = fromParent?.children?.find(item => item.project.id === projectIdFrom);
            if (projectFrom) {
                if (bfsTreeSearch(projectFrom, projectIdTo) !== undefined) {
                    //console.log("Project dropped on its descendant.");
                    return;
                }
            }
        }

        // If to project is not from the root, then use bfs to find it (its parent)
        if (!toParent) {
            for (let i = 0; i < updatedData.length; i++) {
                toParent = bfsTreeSearch(updatedData[i], projectIdTo);
                if (toParent !== undefined) {
                    break;
                }
            }
            toParent = toParent?.children?.find(e => e.project.id === projectIdTo);
        }

        // Perform move and update the project data
        if (isProjectFromRoot) {
            if (toParent && fromParent) {
                toParent.children.push(fromParent);
                updatedData = updatedData.filter(e => e.project.id !== fromParent?.project.id)
                setProjectData(updatedData);
            }
        } else {

            let fromParentChild = fromParent?.children?.find(e => e.project.id === projectIdFrom);

            if (toParent && fromParent && fromParentChild) {
                toParent.children.push(fromParentChild);
                let tmp = fromParent.children.filter(e => e.project.id !== fromParentChild?.project.id);
                fromParent.children = tmp;
                setProjectData(updatedData);
            }

        }
        setWasChanged(true);
    };

    // Handling saving edited project data
    const handleSave = () => {
        setErrMsg('');
        setSucMsg('');

        const userName = auth?.user?.profile?.preferred_username;
        if (!userName) {
            return;
        }

        setUserName(userName);
        setIsSaving(true);

        let token = auth?.user?.access_token;
        if (!token) token = "";

        saveProjects(token, userName, projectData[0].children)
            .then(response => {
                setSucMsg('Projects structure saved successfully.');
            })
            .catch(error => {
                setErrMsg('Projects structure save failed.');
            })
            .finally(() => {
                setIsSaving(false);
                setWasChanged(false);
            });
    }

    return (
        <Container>
            {errMsg && (
                <Alert variant="danger" className="my-3">
                    {errMsg}
                </Alert>
            )}
            {sucMsg && (
                <Alert variant="success" className="my-3">
                    {sucMsg}
                </Alert>
            )}
            <h3>Projects</h3>
            <Container>
                {!isSaving && <Button
                   variant="primary"
                   onClick={handleSave}
                   disabled={isSaving || !wasChanged}>
                    Save Projects Structure
                 </Button>
                }
                {isSaving &&
                    <Spinner animation="border" role="status">
                                  <span className="sr-only">Loading...</span>
                    </Spinner>
                }
            </Container>
            <Form>
                <Container>
                    {loading ? (
                        <div className={"text-center"}>
                            <Spinner animation="border" />
                        </div>
                    ) : (
                        <>
                            {projectData && projectData.length > 0 ? (
                              projectData.map((project, index) => (
                                <Project key={index} projectData={project} level={0} onMove={handleMove} />
                              ))
                            ) : (
                              <div className={"text-center text-danger"}>
                                 No projects found
                              </div>
                            )}

                            <Container className="justify-content-center mt-5" style={{maxWidth: '50%'}}>
                                <Row className="text-center">
                                    <h4>Create New Superproject</h4>
                                </Row>
                                <Row className="m-3">
                                    <Form.Group>
                                        <Form.Label>Superproject Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="super-project-name"
                                            value={superProjectName}
                                            onChange={(e) => setSuperProjectName(e.target.value)}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="m-3">
                                    <Form.Group>
                                        <Form.Label>Superproject Description</Form.Label>
                                        <Form.Control
                                            type="text"
                                            id="super-project-description"
                                            value={superProjectDescription}
                                            onChange={(e) => setSuperProjectDescription(e.target.value)}
                                        />
                                    </Form.Group>
                                </Row>
                                <Row className="text-center">
                                    <Form.Group>
                                        <Button
                                            variant="primary"
                                            onClick={addSuperProject}
                                        >
                                            Create New Superproject
                                        </Button>
                                    </Form.Group>
                                </Row>
                            </Container>
                        </>
                    )}
                </Container>
            </Form>
        </Container>
    );
};

export default Projects;