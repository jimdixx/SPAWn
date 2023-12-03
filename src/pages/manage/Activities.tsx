import React, {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects } from "../../api/APIManagementPerson";
import {fetchActivities, ActivityDto, updateWuActivity} from "../../api/APIManagementActivity";
import {fetchWorkUnits, WorkUnitDto, UnitsData,filterObject } from "../../api/APIManagementWorkUnit";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import CheckboxInput from "../../components/input/CheckboxInput";
import Input from "../../components/input/Input";

import {Container, Button, Alert, Form, Col, Table, Row, CloseButton} from "react-bootstrap";

interface wuIdMap {
    [key:string] : number
}


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
    const [workUnitIds, setWorkUnitsIds] = useState<wuIdMap>({});
    const [workUnits_categories, setWorkUnits_categories] = useState<string[]>([]);
    const [workUnits_types, setWorkUnits_types] = useState<string[]>([]);
    const [categoryFilterValue,setCategoryFilterValue] = useState<string>("");
    const [typeFilterValue,setTypeFilterValue] = useState<string>("");

    const [workUnits_categories_filter, setWorkUnits_categories_filter] = useState<filterObject>({});
    const [workUnits_types_filter, setWorkUnits_types_filter] = useState<filterObject>({});

    const navigate = useNavigate();


    const addCategoryFilter = (category: string) =>{
        //prekopiruj pole a vyhod prvek, ktery se odebira
        const filterObject = {...workUnits_categories_filter,[category]:true};
        setWorkUnits_categories_filter(filterObject);
    }
    const removeCategoryFilter = (category: string) =>{
        //const filters = workUnits_categories_filter.filter((filterValue)=>{filterValue!=category});
        setWorkUnits_categories_filter({});
    }
    const removeTypeFilter = (type: string) =>{
        //const filters = workUnits_types_filter.filter((filterValue)=>{filterValue!=type});
        setWorkUnits_types_filter({});

    }
    const addTypeFilter = (type: string) =>{
        const filterObject = {...workUnits_types_filter,[type]:true};

        setWorkUnits_types_filter(filterObject);
    }
    const createBubble = (text:string):ReactNode =>{
        return (
            <Container>
              <Row >
                <Col xs="auto">
                  {/* Small div with rounded corners */}
                  <div className="bg-secondary text-white p-1 rounded">
                    {text}
                    <CloseButton/>
                  </div>
                </Col>
                
              </Row>
            </Container>
          );
    }
    const createFilterBubbles = (filters: filterObject):ReactNode =>{
        const bubbles: ReactNode[] = [];
        const keys = Object.keys(filters);
        keys.forEach((filterText)=>{bubbles.push(createBubble(filterText));});
        return (
            <Container className="align-items-center">
                {bubbles}
            </Container>
        )

    }

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

    useEffect(()=>{
        //invalid application state
        if(!selectedActivity){
            return;
        }
        fetchActivityWorkUnits(selectedActivity);
    },[workUnits_categories_filter,workUnits_types_filter,setWorkUnits_categories_filter,setWorkUnits_types_filter])

    const createWorkUnitMap = (workUnits:WorkUnitDto[]) =>{
        const map:wuIdMap = {};
        for(let i = 0; i < workUnits.length; i++){
            map[workUnits[i].id] = i;
        }
        setWorkUnitsIds(map);
    }
    const fetchActivityWorkUnits = async ( act: ActivityDto) => {
        const response = await fetchWorkUnits(selectedProjectId,workUnits_categories_filter,workUnits_types_filter);
        // const selectedActivity = event.target.id;
        setSelectedActivity(act);
        setIsActivitySelected(true);
        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as UnitsData;
            if(!fetchedData){
                setErrorMessage(`Activity ${act.name} doesn´t contain any work units.`)
                return;
            }
            setWorkUnits(fetchedData.units);
            createWorkUnitMap(fetchedData.units);
            setWorkUnits_categories(fetchedData.unit_distinct_categories);
            setWorkUnits_types(fetchedData.unit_distinct_types);
            
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
                                   <td><Button variant="info" id={String(act.externalId)} onClick={(event)=>{fetchActivityWorkUnits(act);}}>Select activity</Button></td>
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
            <Row className="align-items-center" >
                <Col sm={8}>
                {selectedActivityNode}
                </Col>
                <Col sm={4}>
                    <Button variant="dark" onClick={()=>{setIsActivitySelected(false);}}>Choose different activity</Button>
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
        let changedWorkUnits: string = "Changed activity of selected work units: ";
        let unchangedWorkUnits: string = "Unable to change activity of selected work units: ";
        let changedWorkUnitsIds: string[] = [];
        let unchangedWorkUnitsIds: string[] = [];

        checkedCheckboxes.forEach((checkBoxElement)=> {
            //obsahuje aktivitu - preskocim
            if(workUnits[workUnitIds[checkBoxElement.id]].activity != ""){
                unchangedWorkUnitsIds.push(checkBoxElement.id);
                return;
            }
            changedWorkUnitsIds.push(checkBoxElement.id);

            wuIds.push(parseInt(checkBoxElement.id));
        })
        const body = {activityId:activityId, wuIds:wuIds};
        const response = await updateWuActivity(body);
        if(changedWorkUnitsIds.length){
            let message : string = changedWorkUnits+changedWorkUnitsIds.join(",");
            setSuccessMessage(message);
        }
        if(unchangedWorkUnitsIds.length){
            let message : string = unchangedWorkUnits+unchangedWorkUnitsIds.join(",");
            setErrorMessage(message);
        }
        fetchActivityWorkUnits(selectedActivity);

    };

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

    const drawFilters = () => {
        return (
            <div>
                <Col xs="auto">
                    <Form.Group>
                    {createFilterBubbles(workUnits_categories_filter)}

                        <Form.Label className="mb-1">Select Category:</Form.Label>
                            {workUnits_categories.length > 0 ? (
                                <Container>
                                <Form.Control
                                    as="select"
                                    name="selectedCategory"
                                    id="categorySelector"
                                >
                                    {workUnits_categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                    </option>
                                    ))}
                                </Form.Control>
                                    <Button variant="dark" onClick={()=>{addCategoryFilter(categoryFilterValue);}}>
                                         Add category filter</Button>
                                </Container>
                            ) : (
                                <option value="" >No Category in the Activity</option>
                            )}
                    </Form.Group>
                </Col>
                
                <Col xs="auto">
                    <Form.Group>
                    {createFilterBubbles(workUnits_types_filter)}
                        <Form.Label className="mb-1">Select Type:</Form.Label>
                        {workUnits_types.length > 0 ? (
                            <Container>
                                <Col sm={10}>
                                <Form.Control
                                    as="select"
                                    name="selectedType"
                                    onChange={event => {setTypeFilterValue(event.target.value);}}
                                    id="typeSelector">
                                    
                                    {workUnits_types.map(type => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </Form.Control>
                                </Col>
                                <Col sm={2}>
                                <Button variant="dark" onClick={()=>{addTypeFilter(typeFilterValue);}}> Add type filter</Button>
                                </Col>
                            </Container>
                        ) : (
                            <option value="" >No Types in the Activity</option>
                        )}
                    </Form.Group>
                </Col>
            </div>
        )
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
                            {
                                drawFilters()
                            }
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
