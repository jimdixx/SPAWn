import React, {FormEvent, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import "./styles/results/style.css";

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

interface QueryResultItems {
    antiPattern:Antipattern,
    isDetected:boolean,
    thresholds:any
}

interface QueryResult {
    project:Project,
    queryResultItems:QueryResultItems[]
}

const Results = () => {
    const {state} = useLocation();
    //const [analyzeResults, setAnalyzeResults] = useState([]);
    const analyzeResults: QueryResult[] = state.data;
    return (
        <div className="container">
            <h1>Results</h1>
            <table className="table table-bordered table-hover">
                {/* Result table header */}
                <thead>
                <tr>
                    <th scope="id" hidden>Project ID</th>
                    <th scope="col">Project Name</th>
                    {analyzeResults[0].queryResultItems.map((queryResultItem:QueryResultItems) => (
                        <th scope="col" >
                            <a href={`/anti-patterns/${queryResultItem.antiPattern.id}`}>
                                {queryResultItem.antiPattern.printName}
                            </a>
                        </th>
                    ))}
                </tr>
                </thead>
                {/* ./Result table header */}

                {/* Result table content */}
                <tbody>
                {analyzeResults.map((analyzeResult:any) => (
                    <tr>
                        <td hidden>{analyzeResult.project.id}</td>
                        <td>
                            <a href={`/projects/${analyzeResult.project.id}`}>
                                {analyzeResult.project.name}
                            </a>
                        </td>
                        {analyzeResult.queryResultItems.map((resultItems:any) => (
                            <td>
                                { resultItems.isDetected?
                                    <div>
                                        <a
                                            data-toggle="popover"
                                            title="Detection details"
                                            data-html="true" data-content="">
                                            <svg style={{backgroundColor:"red",borderRadius:"50%"}}
                                                xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                 fill="currentColor"
                                                 className="true_styte"
                                                 viewBox="0 0 16 16">
                                                <path
                                                    d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                            </svg>
                                        </a>
                                    </div>
                                    :
                                    <div>
                                        <a
                                            data-toggle="popover"
                                            title="Detection details"
                                            data-html="true" data-content="">
                                            <svg style={{backgroundColor:"green",borderRadius:"50%"}}
                                                xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                 fill="currentColor"
                                                 className="bi bi-x not-found-bg icon-style" viewBox="0 0 16 16">
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                                            </svg>
                                        </a>
                                    </div>
                                }
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
            {/* ./Result table content */}

            {/* Table legend */}
            <h6>Legend:</h6>
            <svg style={{backgroundColor:"red",borderRadius:"50%"}}
                xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                 fill="currentColor" className="bi bi-check my-center found-bg icon-style" viewBox="0 0 16 16">
                <path
                    d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
            </svg>
            - Anti-pattern detected
            <br/>
            <svg style={{backgroundColor:"green",borderRadius:"50%"}}
                xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor"
                 className="bi bi-x not-found-bg icon-style" viewBox="0 0 16 16">
                <path
                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
            </svg>
            - Anti-pattern NOT detected
            <div className="analyze-button-container" >
            </div>
            {/* ./Table legend */}
        </div>
    )
};

export default Results;
