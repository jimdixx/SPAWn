import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, ProjectData} from "../../api/APIManagementProjects";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import Project from "../../components/manage/Project";
import { Spinner } from "react-bootstrap";
import { Row, Col, Input, Form, Button, Spin } from 'antd';

const Projects = () => {
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState<string>("");
    const [superProjectName, setSuperProjectName] = useState("");
    const [superProjectDescription, setSuperProjectDescription] = useState("");
    const [superProjectFakedId, setSuperProjectFakedId] = useState(-1);
    const [projectError, setProjectError] = useState("");
    const navigate = useNavigate();

    /*
     Fetching projects data
    */
    const fetchData = async () => {
        const userName:string = retrieveUsernameFromStorage();

        if(!userName) {
            return;
        }

        setUserName(userName);

        const response = await fetchProjects(userName);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as ProjectData[];

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

    /*
      Create new superproject
    */
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
    };

    useEffect(() => {
        console.log(projectData);
    }, [projectData])

    const { error, data, status } = useQuery('projects', fetchData,{ refetchOnWindowFocus: false});

    /*
     Handling drag and drop move of the project
    */
    const handleMove = (projectIdFrom: number, projectIdTo: number) => {
        let fromParent: ProjectData | undefined = undefined;
        let toParent: ProjectData | undefined = undefined;

        // project cannot be dropped on itself
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

        fromParent = updatedData.find(item => item.project.id === projectIdFrom);
        toParent = updatedData.find(item => item.project.id === projectIdTo);

        let isProjectFromRoot = false;

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

        // project cannot be dropped on its direct parent
        if (projectIdTo === fromParent?.project.id) {
            //console.log("Project dropped on its direct parent.");
            return;
        }

        // project cannot be dropped on its descendant
        if (fromParent) {
            let projectFrom: ProjectData | undefined = fromParent?.children?.find(item => item.project.id === projectIdFrom);
            if (projectFrom) {
                if (bfsTreeSearch(projectFrom, projectIdTo) !== undefined) {
                    //console.log("Project dropped on its descendant.");
                    return;
                }
            }
        }

        if (!toParent) {
            for (let i = 0; i < updatedData.length; i++) {
                toParent = bfsTreeSearch(updatedData[i], projectIdTo);
                if (toParent !== undefined) {
                    break;
                }
            }
            toParent = toParent?.children?.find(e => e.project.id === projectIdTo);
        }

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
    };

    return (
        <Form>
            <div className="container">
                {loading ? (
                    <div className={"text-center"}>
                        <Spin size="large" />
                    </div>
                ) : (
                    <>
                        {projectData.map((project, index) => (
                            <Project key={index} projectData={project} level={0} onMove={handleMove} />
                        ))}
                        <Row gutter={[16, 16]}>
                            <Col span={12} offset={6} style={{textAlign: "center"}}>
                                <h2>Create new super project ♥</h2>
                            </Col>
                            <Col span={12} offset={6}>
                                <Form.Item label="Super Project Name">
                                    <Input
                                        type="text"
                                        name="super-project-name"
                                        value={superProjectName}
                                        onChange={(e) => setSuperProjectName(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} offset={6}>
                                <Form.Item label="Super Project Description">
                                    <Input
                                        type="text"
                                        name="super-project-description"
                                        value={superProjectDescription}
                                        onChange={(e) => setSuperProjectDescription(e.target.value)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12} offset={6} style={{ textAlign: 'center' }}>
                                <Form.Item>
                                    <Button
                                        type="primary"
                                        onClick={addSuperProject}
                                    >
                                        Create new super project
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </>
                )}
            </div>
        </Form>
    );
};

export default Projects;