import React, {useState, useEffect, ChangeEvent, ReactNode} from "react";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import {fetchProjects, fetchPersons, Projects, Persons, Identity, mergePersons} from "../../api/APIManagementPerson";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {Container, Button, Alert, Form, Col, Row, InputGroup, FormControl} from "react-bootstrap";
import ModalWindow from "../../components/manage/Modal";
import {
    fetchIterationsAndPhases,
    Iteration,
    IterationAndPhases,
    Phase,
    sendIterationOrPhase
} from "../../api/APIManagementIterationAndPhases";
import IterationPhase from "../../components/manage/IterationPhase";
import {TableItem} from "../../components/manage/IterationPhase";

interface API_RESPONSE_MESSAGE {
    informMessage?: string,
    successMessage?:string,
    message?: string,
    errormessage?: string

}

interface API_RESPONSE_Object {
    authenticated: boolean,
    response: {status:number, data:API_RESPONSE_MESSAGE}
}

const ITERATIONS = "/changeIteration";
const PHASES = "/changePhase";

const Iterations = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [modalHeader,setModalHeader] = useState<string|undefined>("");
    const [modalBody,setModalBody] = useState<string|undefined>("");
    const [isModalReady, setModalReady] = useState(false);
    const [fieldIsRequired, setFieldIsRequired] = useState(false);
    const [projects, setProjects] = useState<Projects[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number>();
    const [userName, setUserName] = useState<string>("");
    const [isProjectSelected, setIsProjectSelected] = useState(false);
    const [iterations, setIterations] = useState<Iteration[]>([]);
    const [phases, setPhases] = useState<Phase[]>([]);
    const [areIterationPhasesLoaded, setAreIterationPhasesLoaded] = useState(false);
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

    // Fetching new data when project is selected
    useEffect(() => {
        //console.log("Selected project id: ", selectedProjectId);
        if (selectedProjectId) {
            fetchIterationAndPhasesData();
        }
    }, [selectedProjectId]);

    const drawTables = ():ReactNode => {
        const it: TableItem[] = iterations.map((value:Iteration):TableItem => {
            return {
                id:value.id,
                name:value.name,
                externalId:value.external,
                description:value.description
            }
        });

        const ph: TableItem[] = phases.map((value:Phase):TableItem => {
            return {
                id:value.id,
                name:value.name,
                externalId:value.external,
                description:value.description
            }
        });

        return(
            <Row key={"table"}>
                <Col sm={6} key={"iteration"}>
                    <Form onSubmit={handleIterationOnSubmit}>
                        <IterationPhase tableData={it} tableHeaders={["Name", "Description"]} tableHeader={"Iteration"} buttonLabel={"Iteration"}></IterationPhase>
                    </Form>
                </Col>
                <Col sm={6} key={"phases"}>
                    <Form onSubmit={handlePhasesOnSubmit}>
                        <IterationPhase tableData={ph} tableHeaders={["Name", "Description"]} tableHeader={"Phases"} buttonLabel={"Phases"}></IterationPhase>
                    </Form>
                </Col>
            </Row>
        );
    }

    const handleResponse = (response:API_RESPONSE_Object) => {
        const data = response.response;
        const headerMessage = data.data.informMessage;
        const bodyMessage = data.data.message;
        const errorMessage = data.data.errormessage;
        const successMessage = data.data.successMessage;
        if (errorMessage) {
            setErrorMessage(errorMessage);
            return;
        }
        else if (successMessage) {
            setSuccessMessage(successMessage);
            return;
        }
        setModalHeader(headerMessage);
        setModalBody(bodyMessage);



    }

    const handleIterationOnSubmit = async (event:any) => {
        event.preventDefault();
        const body = createBody(event.target);

        setSuccessMessage("");
        setModalReady(false);
        setModalHeader("");
        setErrorMessage("");

        const response:API_RESPONSE_Object = await sendIterationOrPhase(body, ITERATIONS) as API_RESPONSE_Object;
        handleResponse(response);
    };

    const handlePhasesOnSubmit = async (event:any) => {
        event.preventDefault();
        const body = createBody(event.target);

        setSuccessMessage("");
        setModalReady(false);
        setModalHeader("");
        setErrorMessage("");

        const response:API_RESPONSE_Object = await sendIterationOrPhase(body, PHASES) as API_RESPONSE_Object;
        handleResponse(response);
    };

    const createBody = (target: any[]):string[] => {
        const data:string[] = [];
        const len = target.length;
        for (let i = 1; i < len ;  i++) {
            if (target[i].checked) {
                const parts = target[i].id.split("_");
                data.push(parts[1]);
            }
        }
        return data;
    }

    const fetchIterationAndPhasesData = async () => {
        const userName:string = retrieveUsernameFromStorage();

        if (!userName) {
            return;
        }

        setUserName(userName);
        if(!selectedProjectId) {
            setErrorMessage("No project selected. Please select a project.");
            return;
        }
        const response = await fetchIterationsAndPhases(selectedProjectId.toString());

        if (response.redirect) {
            navigate(response.redirect);
        } else {
            let fetchedData = response.response.data as IterationAndPhases;
            setIterations(fetchedData.iterationDtos);
            setPhases(fetchedData.phaseDtos);
            setAreIterationPhasesLoaded(true);
        }
    };
    const showModalWindow = (event:any) => {
        event.preventDefault();
        setModalReady(true);
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
            {modalHeader && (
                    <Alert variant="warning" className="my-3">
                        {modalHeader + " "}
                        <a href={""} onClick={showModalWindow}>See all</a>
                        {isModalReady &&(
                            <ModalWindow header={"Category assign log."} body={modalBody} onHide={()=>{setModalReady(false);}}/>
                        )}
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
                areIterationPhasesLoaded && drawTables()
            }
        </Container>
    );

}

export default Iterations;
