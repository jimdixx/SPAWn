import React, { useEffect, useState } from "react";
import { Container, ButtonGroup, Button, Table, Accordion, Row } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faCircleXmark, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
}

interface DetectionResult {
  result: boolean;
  finished: boolean;
  project: Project;
  indicatorName: string;
  additionalData: any;
}

interface Matrix {
  [projectName: string]: {
    [indicatorName: string]: boolean | undefined;
  };
}

const DetectionResults = () => {
  const [results, setResults] = useState<DetectionResult[]>([]);
  const [viewMode, setViewMode] = useState<"projects" | "indicators" | "matrix">("matrix");
  const navigate = useNavigate();

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("detectionResults") || "{}");
    setResults(storedResults.response?.data || []);
  }, []);

  const renderAdditionalData = (additionalData: any) => (
    <div>
      Additional Data:
      <ul>
        {Object.entries(additionalData).map(([key, value], index) => (
          <li key={index}>{`${key}: ${JSON.stringify(value)}`}</li>
        ))}
      </ul>
    </div>
  );

  const renderProjectsView = () => {
    const projectGroups = results.reduce((acc: Record<number, DetectionResult[]>, cur) => {
      (acc[cur.project.id] = acc[cur.project.id] || []).push(cur);
      return acc;
    }, {});

    return (
      <Accordion defaultActiveKey="0" className="mb-4">
        {Object.entries(projectGroups).map(([projectId, projectResults], projectIndex) => (
          <Accordion.Item eventKey={projectId} key={projectId}>
            <Accordion.Header>Project: {projectResults[0].project.name} (ID: {projectId})</Accordion.Header>
            <Accordion.Body>
              {projectResults.map((result, index) => (
                <React.Fragment key={index}>
                  <div>
                    <div>
                        {result.finished ? result.result ? <FontAwesomeIcon icon={faCircleCheck} style={{color:"red", marginRight: "10px"}} size="2x" /> : <FontAwesomeIcon icon={faCircleXmark} style={{color:"green", marginRight: "10px"}} size="2x" /> : <FontAwesomeIcon icon={faCircleExclamation} style={{color:"orange"}} size="2x" />}
                    </div>
                    Indicator: <strong>{result.indicatorName} </strong>
                    <div>
                      Result: <strong> {result.finished ? result.result ? "DETECTED" : "NOT DETECTED" : "NOT FINISHED"} </strong>
                    </div>
                    {renderAdditionalData(result.additionalData)}
                  </div>
                  {index < projectResults.length - 1 && <hr />}
                </React.Fragment>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const renderIndicatorsView = () => {
    const indicatorGroups = results.reduce((acc: Record<string, DetectionResult[]>, cur) => {
      (acc[cur.indicatorName] = acc[cur.indicatorName] || []).push(cur);
      return acc;
    }, {});

    return (
      <Accordion defaultActiveKey="0" className="mb-4">
        {Object.entries(indicatorGroups).map(([indicatorName, indicatorResults]) => (
          <Accordion.Item eventKey={indicatorName} key={indicatorName}>
            <Accordion.Header >Indicator: {indicatorName}</Accordion.Header>
            <Accordion.Body>
              {indicatorResults.map((result, index) => (
                <div key={index}>
                  <div>
                      {result.finished ? result.result ? <FontAwesomeIcon icon={faCircleCheck} style={{color:"red", marginRight: "10px"}} size="2x" /> : <FontAwesomeIcon icon={faCircleXmark} style={{color:"green", marginRight: "10px"}} size="2x" /> : <FontAwesomeIcon icon={faCircleExclamation} style={{color:"orange"}} size="2x" />}
                  </div>
                  Project: <strong>{result.project.name}</strong>
                  <div>
                    Result: <strong> {result.finished ? result.result ? "DETECTED" : "NOT DETECTED" : "NOT FINISHED"} </strong>
                  </div>
                  {renderAdditionalData(result.additionalData)}
                  {index < indicatorResults.length - 1 && <hr />}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    );
  };

  const renderMatrixView = () => {
    const projects = Array.from(new Set(results.map(result => result.project.name)));
    const indicators = Array.from(new Set(results.map(result => result.indicatorName)));

    const matrix: Matrix = results.reduce((acc: Matrix, cur) => {
      const projectName = cur.project.name;
      const indicatorName = cur.indicatorName;
      const detectionResult = cur.result;
      const detectionFinished = cur.finished;

      acc[projectName] = acc[projectName] || {};
      if (detectionFinished)
        acc[projectName][indicatorName] = detectionResult;

      return acc;
    }, {});

    const getAdditionalDataTooltip = (projectName: string, indicatorName: string) => {
      const result = results.find(result => result.project.name === projectName && result.indicatorName === indicatorName);
      return (
        <Tooltip id={`tooltip-${projectName}-${indicatorName}`}>
          <div style={{ textAlign: 'left' }}>
            {result ? renderAdditionalData(result.additionalData) : 'Loading...'}
          </div>
        </Tooltip>
      );
    };

    return (
      <>
        <div className="mb-3 ms-2">
                  <div>
                      <FontAwesomeIcon icon={faCircleCheck} style={{color:"red", marginRight: "10px"}} size="2x" />
                      <strong>Detected</strong>
                  </div>
                  <div>
                      <FontAwesomeIcon icon={faCircleXmark} style={{color:"green", marginRight: "10px"}} size="2x" />
                      <strong>Not detected</strong>
                  </div>
                  <div>
                      <FontAwesomeIcon icon={faCircleExclamation} style={{color:"orange", marginRight: "10px"}} size="2x" />
                      <strong>Not finished</strong>
                  </div>
              </div>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>↓ Project \ Indicator →</th>
                    {indicators.map(indicator => <th key={indicator}>{indicator}</th>)}
                  </tr>
                </thead>
        <tbody>
          {projects.map(projectName => {
            const project = results.find(result => result.project.name === projectName)?.project;
            return (
              <tr key={projectName}>
                <td>{`${projectName} (ID: ${project?.id})`}</td>
                {indicators.map(indicatorName => (
                  <OverlayTrigger
                    key={indicatorName}
                    placement="top"
                    overlay={getAdditionalDataTooltip(projectName, indicatorName)}>
                    <td>
                      {matrix[projectName] && matrix[projectName][indicatorName] !== undefined ?
                        (matrix[projectName][indicatorName] ?
                          <FontAwesomeIcon icon={faCircleCheck} style={{color:"red"}} size="2x" /> :
                          <FontAwesomeIcon icon={faCircleXmark} style={{color:"green"}} size="2x" />
                        ) :
                        <FontAwesomeIcon icon={faCircleExclamation} style={{color:"orange"}} size="2x" />
                      }
                    </td>
                  </OverlayTrigger>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      </>
    );
  };

  return (
    <Container>
      <h1>Detection Results</h1>
      <ButtonGroup className="mb-4">
        <Button onClick={() => setViewMode("matrix")}>Results Matrix</Button>
        <Button onClick={() => setViewMode("projects")}>Results by project</Button>
        <Button onClick={() => setViewMode("indicators")}>Results by indicator</Button>
      </ButtonGroup>
      {viewMode === "projects" && renderProjectsView()}
      {viewMode === "indicators" && renderIndicatorsView()}
      {viewMode === "matrix" && renderMatrixView()}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button onClick={() => navigate("/detection")}>Create New Detection</Button>
      </div>
    </Container>
  );
};

export default DetectionResults;
