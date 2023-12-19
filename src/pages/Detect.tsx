import React, {FormEvent, useState} from "react";
import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import "./styles/detect/style.css";
import {Alert, Button, Spinner} from "react-bootstrap";
import {getConfigurationNameFromLocalstorage} from "../components/helperFunctions/ConfigurationSelectEvent";
import {retrieveUsernameFromStorage} from "../context/LocalStorageManager";
import {sendProjectsForAnalysation} from "../api/APIDetect";
import {useAuth} from "react-oidc-context";

interface Project {
    id:number,
    name: string,
    description:string
}


interface Antipattern {
    id:number,
    printName:string,
    name:string,
    description:string,
    thresholds:any
}

interface ResponseObject {
    projects:Project[];
    antiPatterns: Antipattern[];
}

const Detect = () => {
    const[query, setQuery] = useState<ResponseObject>({projects:[],antiPatterns:[]});
    const[selectedProjects,setSelectedProjects] = useState<number[]>([]);
    const[selectedAntiPatterns,setSelectedAntiPatterns] = useState<number[]>([]);
    const[projectCount,setProjectCount] = useState<number>(0);
    const[patternCount,setPatternCount] = useState<number>(0);

    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const auth = useAuth();

    const fetchProjectsAndAntipatterns = async () => {

        let token = auth?.user?.access_token;
        if (!token) token = "";

        const response: API_RESPONSE  = await ApiCaller({},"http://localhost:8080/v2/detect/list", HTTP_METHOD.GET, token);

        if(response.redirect) {
            navigate(response.redirect);
            return;
        } else {
            const data = response.response.data as ResponseObject;
            setQuery(data);
            //TODO precist petrovo lokalni ULOZISTE
            setProjectCount(data.projects.length);
            setPatternCount(data.antiPatterns.length);
            let tmpProjects: number[] = new Array(data.projects.length).fill(0);
            let tmpPatterns: number[] = new Array(data.antiPatterns.length).fill(0);
            setSelectedProjects(tmpProjects);
            setSelectedAntiPatterns(tmpPatterns);

            setLoading(false);
        }
    }

    const {data, status} = useQuery("projects_and_antipatterns", fetchProjectsAndAntipatterns,{ refetchOnWindowFocus: false});

    const setQuickSelectState = (checkBox:HTMLInputElement|null, checkboxes:number[], max_count:number) => {
        if(checkBox === null) {
            return;
        }
        let sum : number = 0;
        for(let i = 0; i < checkboxes.length; i++) {
            sum += checkboxes[i];
        }
        //everything is checked
        if(sum === max_count) {
            checkBox.indeterminate = false
            checkBox.checked = true;
            return;
        }
        //some but not all are checked
        if(sum > 0 ){
            checkBox.indeterminate = true
            checkBox.checked = false;
            return;
        }
        checkBox.indeterminate = false
        checkBox.checked = false;


    }

    const setChecked = (id:number, selectedBox:number[]) => {
        selectedBox[id] === 1 ? selectedBox[id] = 0 : selectedBox[id] = 1;
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, elementId: string, projects: boolean) => {
        const boxId : number = +e.target.value; //retype value to number

        const checkbox:HTMLInputElement | null = document.getElementById(elementId) as HTMLInputElement;

        if (projects) {
            setChecked(boxId, selectedProjects);
            setQuickSelectState(checkbox, selectedProjects,projectCount);
        } else {
            setChecked(boxId, selectedAntiPatterns);
            setQuickSelectState(checkbox, selectedAntiPatterns,patternCount);
        }

    }

    const handleQuickSelectAll = (e: React.ChangeEvent<HTMLInputElement>, projects:boolean) => {
        projects?
            flipCheckBoxes("select_all_projects","project_", selectedProjects)
            :
            flipCheckBoxes("select_all_anti_patterns","antiPattern_", selectedAntiPatterns);

    }
    const flipCheckBoxes = (elementId:string, boxesId:string, field:number[]) => {
        const parentBox: any = document.getElementById(elementId);
        const boxes:any = document.querySelectorAll(`*[id^=${boxesId}]`);
        let state : boolean = parentBox.checked;
        if(parentBox.indeterminate)
            state = true;
        // if(parentBox.indeterminate || !parentBox.checked)
        //state = true;
        setBoxesState(boxes, state, field);
    }

    const setBoxesState = (boxes:any, value:boolean, field:number[]) => {
        let i;
        for (i = 0; i < boxes.length; i++) {
            field[+boxes[i].value] = Number(value);
            boxes[i].checked = value;
        }
    }

    const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        const configurationId:string|undefined = getConfigurationNameFromLocalstorage();
        if(!configurationId){
            //todo borec nema selected zadnou konfiguraci somehow nebo si spis promazal local storage
            return;
        }

        //all projects selected by user for detection
        const selectedProjectIds: number[] = [];
        //all antipatterns selected by user for detection
        const selectedAntiPatternIds: number[] = [];
        const userName = retrieveUsernameFromStorage();
        //push all selected projects
        for(let i = 0; i < selectedProjects.length; i++) {
            if(selectedProjects[i] == 1) {
                selectedProjectIds.push(i);
            }
        }


        //push all selected antipatterns
        for(let i = 0; i < selectedAntiPatterns.length; i++) {
            if(selectedAntiPatterns[i] === 1) {
                selectedAntiPatternIds.push(i);
            }
        }


        const body = {
            "configurationId" : configurationId,
            "userName":userName,
            "selectedProjects":selectedProjectIds,
            "selectedAntipatterns":selectedAntiPatternIds
        }

        let token = auth?.user?.access_token;
        if (!token) token = "";

        const response = await sendProjectsForAnalysation(body, token);
        console.log(response);

        if(response.redirect) {
            navigate(response.redirect);
            return;
        } else if(response.response.status === 400) {
            const err = response.response.data as {message:string};
            setErrorMessage(err.message);
        } else {
            console.log(response.response.data);
            navigate("/results", {state:{data:response.response.data}});
            return;
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1>Projects</h1>
                    </div>
                    <div className="col">
                        <h1>Anti-patterns</h1>
                        <br />
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        {/* Table for selecting projects */}
                        {query.projects.length > 0 ? (
                            <table className="table">
                                <thead></thead>
                                <tbody>
                                <tr className="no-hover">
                                    <td className="custom-td-style">Quick Select</td>
                                    <td className="custom-td-style-ext">
                                        <input
                                            type="checkbox"
                                            className="form-check-input add-label"
                                            id="select_all_projects"
                                            onChange={(event) => {
                                                handleQuickSelectAll(event, true);
                                            }}
                                        />
                                    </td>
                                </tr>

                                {query.projects.map((project) => (

                                    <tr key={project.id}>
                                        <td>
                                            <a
                                                href={
                                                 `/projects/${project.id}`}
                                                className="anchor-table"
                                            >
                                                {project.name}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="selectedProjects"

                                                value={project.id}
                                                id={`project_${
                                                    project.id}`}
                                                onChange={(event)=> {
                                                    handleCheckboxChange(event, "select_all_projects", true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot></tfoot>
                            </table>
                        ) : (
                            status === "error"?  <div className="alert alert-danger" role="alert">
                                There are no projects to analyze!
                            </div> : <h1>loading</h1>
                        )
                        }
                    </div>
                    <div className="col">
                        {/* Table for selecting anti patterns */}
                        {query.antiPatterns.length > 0 ? (
                            <table className="table">
                                <thead></thead>
                                <tbody>
                                <tr className="no-hover">
                                    <td className="custom-td-style">Quick Select</td>
                                    <td className="custom-td-style-ext">
                                        <input
                                            type="checkbox"
                                            className="form-check-input add-label"
                                            id="select_all_anti_patterns"
                                            onChange={(event) => {
                                                handleQuickSelectAll(event, false);
                                            }}
                                        />
                                    </td>
                                </tr>
                                {query.antiPatterns.map((antiPattern) => (
                                    <tr key={antiPattern.id}>
                                        <td>
                                            <a
                                                href={`/anti-patterns/${antiPattern.id}`}
                                                className="anchor-table"
                                            >
                                                {antiPattern.printName}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="selectedAntiPatterns"

                                                value={antiPattern.id}
                                                id={`antiPattern_${antiPattern.id}`}
                                                onChange={(event)=>{

                                                    handleCheckboxChange(event, "select_all_anti_patterns", false);
                                                }}
                                            />
                                        </td>
                                   </tr>
                                    ))}
                                </tbody>

                            </table>
                        ):(<></>)}
                    </div>
                </div>
            </div>
            {
                errorMessage && (
                    <Alert variant="danger" className="my-3">
                        {errorMessage}
                    </Alert>
                )
            }
            {
                loading ? (
                    <div className={"d-flex justify-content-center align-items-center"}>
                        <Spinner animation={"border"} variant={"primary"}/>
                    </div>
                )
                :
                (
                    <div className={"text-center"}>
                        <Button className={"btn btn-primary btn-lg btn-block"} type={"submit"}>Detect</Button>
                    </div>
                )
            }
        </form>
    );
};

export default Detect;
