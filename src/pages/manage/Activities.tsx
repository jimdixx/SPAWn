import React, {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects } from "../../api/APIManagementPerson";
import {fetchActivities, ActivityDto, updateWuActivity} from "../../api/APIManagementActivity";
import {fetchWorkUnits, WorkUnitDto } from "../../api/APIManagementWorkUnit";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import CheckboxInput from "../../components/input/CheckboxInput";
import Input from "../../components/input/Input";

import {Container, Button, Alert, Form, Col, InputGroup, FormControl, Table, Row} from "react-bootstrap";

const Activities = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [selectedActivity, setSelectedActivity] = useState<ActivityDto>();
    const [userName, setUserName] = useState<string>("");
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const [isActivitySelected, setIsActivitySelected] = useState(false);
    const [activities, setActivities] = useState<ActivityDto[]>([]);
    const [workUnits, setWorkUnits] = useState<WorkUnitDto[]>([]);
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
    const fetchActivityData = async () => {
        const response = await fetchActivities(selectedProjectId);

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as ActivityDto[];
            setActivities(fetchedData);
            console.log(activities);
        }
    };

    // Query for fetching projects
    const { error, data, status } = useQuery('projects', fetchProjectsData, {refetchOnWindowFocus: false});

    // Handling of project selection
    const handleProjectSelect = (projectIdString: string) => {
        const projectId = parseInt(projectIdString, 10);
        setSelectedProjectId(projectId); // triggers useEffect below
        setIsProjectSelected(true);
        setIsActivitySelected(false);
    };

    // Fetching new data when project is selected
    useEffect(() => {
        console.log("Selected project id: ", selectedProjectId);
        if (selectedProjectId) {
            fetchActivityData();
        }
    }, [selectedProjectId]);

    const handleActivitySelect = async (event:any, act: ActivityDto) => {
        const response = await fetchWorkUnits(selectedProjectId);
        // const selectedActivity = event.target.id;
        setSelectedActivity(act);
        setIsActivitySelected(true);
        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as WorkUnitDto[];
            setWorkUnits(fetchedData);
            console.log(workUnits);
        }
    }

    const drawActivitiesTable = () => {
        return (
            <div>
                <h3>Select activity:</h3>
                <Table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>External Id</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Select</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        activities.map((act: ActivityDto) => {
                           return (
                               <tr>
                                   <td>{act.name === undefined ? ("") : (act.name)}</td>
                                   <td>{act.description === undefined ? ("") : (act.description)}</td>
                                   <td>{act.externalId === undefined ? ("") : (act.externalId)}</td>
                                   <td>{act.startDate === undefined ? ("") : (act.startDate)}</td>
                                   <td>{act.endDate === undefined ? ("") : (act.endDate)}</td>
                                   <td><Button id={String(act.externalId)} onClick={(event)=>{handleActivitySelect(event,act);}}>Select activity</Button></td>
                               </tr>
                           );
                        })
                    }
                    </tbody>
                </Table>
            </div>
        )
    };

    const drawSelectedActivity = ():ReactNode => {
        if(!selectedActivity)
            return null;
        const activityName = selectedActivity.name;
        return (
            <div>
                <Form.Label className="mb-1">Selected activity:</Form.Label>
                <Input value={activityName} type={"text"} id={String(selectedActivity.externalId)} name={selectedActivity.name} readonly={true} onChange={()=>{}}/>
            </div>
        )
    }

    const drawSelectedActivityAndRevertButton = ():ReactNode =>{
        const selectedActivityNode:ReactNode = drawSelectedActivity();

        return (<div>
            <Row>
                <Col sm={10}>
                {selectedActivityNode}
                </Col>
                <Col sm={2}>
                    <Button onClick={()=>{setIsActivitySelected(false);}}>Choose different activity</Button>
                </Col>
            </Row>
        </div>)
    }

    const handleAssignActivitySubmit = async (event:any) => {
        event.preventDefault();
        const checkedCheckboxes = document.querySelectorAll("input[type='checkbox']:checked");
        if(!selectedActivity){
            return null;
        }
        setSuccessMessage("");
        setErrorMessage("");
        const activityId = selectedActivity.id;
        const wuIds: number[] = [];
        checkedCheckboxes.forEach((checkBoxElement)=> {wuIds.push(parseInt(checkBoxElement.id))})
        const body = {activityId:activityId, wuIds:wuIds};
        const response = await updateWuActivity(body);




    };

    const createCategoryFilter = () => {

    }

    const drawWorkUnitsTable = ():ReactNode => {
        return (
            <div>
                <h3>Work Units</h3>



                <Button type={"button"} onClick={handleAssignActivitySubmit}>Assign selected activity</Button>
                <Table>
                    <thead>
                    <tr>
                        <th>Number</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th>Assignee</th>
                        <th>Type</th>
                        <th>Category</th>
                        <th>Activity</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        workUnits.map((wu: WorkUnitDto) => {
                            return (
                                <tr>
                                    <td><CheckboxInput checked={false} id={String(wu.id)} name={String(wu.id)} onChange={()=>{}} description={String(wu.id)}/></td>
                                    <td>{wu.startDate || ""}</td>
                                    <td>{wu.endDate === undefined ? ("") : (wu.endDate)}</td>
                                    <td>{wu.assignee === undefined ? ("") : (wu.assignee)}</td>
                                    <td>{wu.type === undefined ? ("") : (wu.type)}</td>
                                    <td>{wu.category === undefined ? ("") : (wu.category)}</td>
                                    <td>{wu.activity === undefined ? ("") : (wu.activity)}</td>
                                </tr>
                            );
                        })
                    }
                    </tbody>
                </Table>
            </div>
        )
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

            <h4>Activity</h4>
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

            {selectedProjectId === undefined && (
                <div className="d-flex justify-content-center mt-5 mb-5">
                    <h5>Select a project to view people with identities</h5>
                </div>
            )}

            {
                // TABLE OF ACTIVITIES
            }

            {selectedProjectId && (
                <div>
                    {isActivitySelected ? (
                        <div>
                            {drawSelectedActivityAndRevertButton()}
                            {drawWorkUnitsTable() }
                        </div>
                    ) : (
                        <div>
                            {drawActivitiesTable()}
                        </div>
                    )
                    }
                </div>
            )
            }



        </Container>
    );

}

export default Activities;
