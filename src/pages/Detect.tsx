import React, {useEffect, useState} from "react";
import Configuration from "./Configuration";
import ApiCaller, {API_RESPONSE, HTTP_METHOD} from "../components/api/ApiCaller";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";
import "./styles/detect/style.css";
import {Button} from "react-bootstrap";
interface Project {
    id:number,
    name: string,
    description:string
}
/*
interface Thresholds {
    any
}*/

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
    const [query, setQuery] = useState<ResponseObject>({projects:[],antiPatterns:[]});
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchProjectsAndAntipatterns = async () => {
        const response: API_RESPONSE  = await ApiCaller({},"http://localhost:8080/v2/detect/list", HTTP_METHOD.GET);

        if(response.redirect){
            navigate(response.redirect);
        } else {
            const data = response.response.data as ResponseObject;
            setQuery(data);
            setLoading(false);
        }

    }

    const {data, status} = useQuery("projects_and_antipatterns", fetchProjectsAndAntipatterns,{ refetchOnWindowFocus: false});

    // @ts-ignore
    const handleProjectCheckboxChange = (e) => {
        // code to handle project checkbox change
    };
// @ts-ignore
    const handleAntiPatternCheckboxChange = (e) => {
        // code to handle anti-pattern checkbox change
    };
// @ts-ignore
    const handleSubmit = (e) => {
        e.preventDefault();
        // code to handle form submission
    };

    useEffect(() => {

        const fetchData = async () => {

        };
        fetchData();
        setLoading(false);
    }, []);

// @ts-ignore
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
                                            onClick={() => {
                                                // code to handle select all projects
                                            }}
                                        />
                                    </td>
                                </tr>

                                {query.projects.map((project) => (
                                    // @ts-ignore
                                    <tr key={project.id}>
                                        <td>
                                            <a
                                                href={// @ts-ignore
                                                 `/projects/${project.id}`}
                                                className="anchor-table"
                                            >
                                                {// @ts-ignore
                                                    project.name}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="selectedProjects"

                                                value={
                                                    // @ts-ignore
                                                project.id}
                                                id={`project_${// @ts-ignore
                                                    project.id}`}
                                                onChange={handleProjectCheckboxChange}
                                            />
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                                <tfoot></tfoot>
                            </table>
                        ) : (
                            <div className="alert alert-danger" role="alert">
                                There are no projects to analyze!
                            </div>
                        )}
                        {/* ./Table for selecting projects */}
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
                                            onClick={() => {
                                                // code to handle select all anti-patterns
                                            }}
                                        />
                                    </td>
                                </tr>
                                {query.antiPatterns.map((antiPattern) => (
                                    <tr key={
                                        // @ts-ignore
                                        antiPattern.id}>
                                        <td>
                                            <a
                                                href={`/anti-patterns/${
                                                    // @ts-ignore
                                                    antiPattern.id}`}
                                                className="anchor-table"
                                            >
                                                {
                                                    // @ts-ignore
                                                    antiPattern.printName}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: "center" }}>
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="selectedAntiPatterns"
                                                value={"nejaka hodnota"}/>
                                    </td>
                                   </tr>
                                    ))}
                                </tbody>

                            </table>
                        ):(<></>)}
                    </div>
                </div>
            </div>
            <div className={"analyze-button-container"}>
                <Button className={"btn btn-primary btn-lg btn-block"}>Detect</Button>
            </div>
        </form>
    );
};

export default Detect;
