import React, { useState, useEffect } from "react";
import { Container, Table, Button, Dropdown } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchIndicators, deleteIndicator, Indicator } from "../../api/detecting/APIDetectingIndicators";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router-dom";

type ColumnType = "indicatorType" | "scriptType";

const Indicators = () => {
    const [indicators, setIndicators] = useState<Indicator[]>([]);
    const [filterValues, setFilterValues] = useState<{ [key in ColumnType]: string | null }>({
        indicatorType: null,
        scriptType: null,
    });
    const [selectedFilterValues, setSelectedFilterValues] = useState<{ [key in ColumnType]: string | null }>({
        indicatorType: "",
        scriptType: "",
    });
    const navigate = useNavigate();
    const auth = useAuth();

    const fetchIndicatorsData = async () => {
        const token = auth?.user?.access_token;
        if (!token) return;

        try {
            const response = await fetchIndicators(token);
            if (response.redirect) {
                navigate(response.redirect);
            } else {
                setIndicators(response.response.data as Indicator[]);
            }
        } catch (error) {
            console.error("Error fetching indicators:", error);
        }
    };

    useEffect(() => {
        fetchIndicatorsData();
    }, []);

    const handleDelete = async (id: number) => {
        const token = auth?.user?.access_token;
        if (!token) return;

        try {
            await deleteIndicator(id, token);
            const updatedIndicators = indicators.filter(indicator => indicator.id !== id);
            setIndicators(updatedIndicators);
            console.log("Indicator with id", id, "deleted successfully.");
        } catch (error) {
            console.error("Error deleting indicator:", error);
        }
    };

    const handleFilterChange = (column: ColumnType, value: string | null) => {
        setFilterValues({ ...filterValues, [column]: value === "All" ? null : value });
        setSelectedFilterValues({ ...selectedFilterValues, [column]: value });
    };

    const getUniqueValues = (column: ColumnType): string[] => {
        const uniqueValues = Array.from(new Set(indicators.map(indicator => indicator[column]?.type_name ?? "")));
        return uniqueValues.filter(Boolean); // Filter out null and undefined values
    };

    const filteredIndicators = indicators.filter((indicator: any) => {
        for (const column in filterValues) {
            if (Object.prototype.hasOwnProperty.call(filterValues, column)) {
                const filterValue = filterValues[column as ColumnType];
                if (filterValue !== null && filterValue !== undefined) {
                    if (column === "indicatorType" && isIndicatorType(indicator.indicatorType) && indicator.indicatorType.type_name !== filterValue) {
                        return false;
                    }
                    if (column === "scriptType" && isScriptType(indicator.scriptType) && indicator.scriptType.type_name !== filterValue) {
                        return false;
                    }
                }
            }
        }
        return true;
    });

    function isIndicatorType(value: any): value is { type_name: string } {
        return typeof value === 'object' && value !== null && 'type_name' in value;
    }

    function isScriptType(value: any): value is { type_name: string } {
        return typeof value === 'object' && value !== null && 'type_name' in value;
    }

    return (
        <Container>
            <p>/ <a href="/detecting">Detecting</a> / <a href="/definition">Definition</a> / <a href="/indicators">Indicators</a></p>
            <h1>Indicators</h1>
            <Link to="/createindicator"><Button variant="success" className="mb-3">Create New Indicator</Button></Link>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>
                            Indicator Type
                            <Dropdown onSelect={(value) => handleFilterChange("indicatorType", value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {selectedFilterValues["indicatorType"] || "All"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                                    {getUniqueValues("indicatorType").map(value => (
                                        <Dropdown.Item key={value} eventKey={value}>{value}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>
                        <th>
                            Script Type
                            <Dropdown onSelect={(value) => handleFilterChange("scriptType", value)}>
                                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                    {selectedFilterValues["scriptType"] || "All"}
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="All">All</Dropdown.Item>
                                    {getUniqueValues("scriptType").map(value => (
                                        <Dropdown.Item key={value} eventKey={value}>{value}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredIndicators.map((indicator) => (
                        <tr key={indicator.id}>
                            <td>{indicator.id}</td>
                            <td>{indicator.name}</td>
                            <td>{indicator.description}</td>
                            <td>{indicator.indicatorType?.type_name}</td>
                            <td>{indicator.scriptType?.type_name}</td>
                            <td>
                                <Link to={`/indicatorDetail/${indicator.id}`} className="btn btn-primary me-2">View</Link>
                                <Button variant="danger" onClick={() => handleDelete(indicator.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default Indicators;
