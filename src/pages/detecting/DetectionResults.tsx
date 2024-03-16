import React, { useEffect, useState } from "react";
import { Container, ButtonGroup, Button, Table, Accordion } from "react-bootstrap";

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
  const [viewMode, setViewMode] = useState<"projects" | "indicators" | "matrix">("projects");

  useEffect(() => {
    const storedResults = JSON.parse(localStorage.getItem("detectionResults") || "{}");
    setResults(storedResults.response?.data || []);
  }, []);

  const renderAdditionalData = (additionalData: any) => (
    <div>
      <strong>Additional Data:</strong>
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
      <Accordion defaultActiveKey="0">
        {Object.entries(projectGroups).map(([projectId, projectResults]) => (
          <Accordion.Item eventKey={projectId} key={projectId}>
            <Accordion.Header>Project: {projectResults[0].project.name}</Accordion.Header>
            <Accordion.Body>
              {projectResults.map((result, index) => (
                <div key={index}>
                  <strong>{result.indicatorName}</strong>: {result.result ? "Success" : "Failure"}
                  {renderAdditionalData(result.additionalData)}
                </div>
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
      <Accordion defaultActiveKey="0">
        {Object.entries(indicatorGroups).map(([indicatorName, indicatorResults]) => (
          <Accordion.Item eventKey={indicatorName} key={indicatorName}>
            <Accordion.Header>Indicator: {indicatorName}</Accordion.Header>
            <Accordion.Body>
              {indicatorResults.map((result, index) => (
                <div key={index}>
                  <strong>Project</strong>: {result.project.name}: {result.result ? "Success" : "Failure"}
                  {renderAdditionalData(result.additionalData)}
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

      acc[projectName] = acc[projectName] || {};
      acc[projectName][indicatorName] = detectionResult;

      return acc;
    }, {});

    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Project \ Indicator</th>
            {indicators.map(indicator => <th key={indicator}>{indicator}</th>)}
          </tr>
        </thead>
        <tbody>
          {projects.map(project => (
            <tr key={project}>
              <td>{project}</td>
              {indicators.map(indicator => (
                <td key={indicator}>
                  {matrix[project] && matrix[project][indicator] !== undefined ? (matrix[project][indicator] ? "True" : "False") : "N/A"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <Container>
      <h1>Detection Results</h1>
      <ButtonGroup className="mb-3">
        <Button onClick={() => setViewMode("projects")}>Projects View</Button>
        <Button onClick={() => setViewMode("indicators")}>Indicators View</Button>
        <Button onClick={() => setViewMode("matrix")}>Matrix View</Button>
      </ButtonGroup>
      {viewMode === "projects" && renderProjectsView()}
      {viewMode === "indicators" && renderIndicatorsView()}
      {viewMode === "matrix" && renderMatrixView()}
    </Container>
  );
};

export default DetectionResults;
