import React from 'react';
import {Container, Row, Col, Button, Card} from 'react-bootstrap';

const MainPage = () => {

    return (
        <>
            <Container>
                <Row className="mt-3">
                    <Col>
                        <Card className="p-3 shadow">
                            <Card.Title>
                                <h1>Software Process Anti-pattern Detection</h1>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    Welcome to the Software Process Anti-pattern Detection (SPADe) project, an open-source
                                    framework that automates the detection of anti-patterns in software development process
                                    and project management.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card className="p-3 shadow">
                            <Card.Title>
                                <h2>Overview</h2>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    Anti-patterns (APs) are known, reoccurring, bad solutions to common problems in their
                                    respective domains. However, their descriptions exist almost exclusively in textual
                                    form for human consumption, rendering detection in projects difficult at best. This is
                                    where SPADe comes in. By extracting data from Application Lifecycle Management (ALM)
                                    tools, SPADe automates the detection of the aforementioned APs, defined in the Software
                                    Process Anti-pattern Catalogue (SPAC).
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card className="p-3 shadow">
                            <Card.Title>
                                <h2>Results</h2>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    SPADe is currently capable of extracting data from 7 ALM tools. The catalogue contains
                                    over 200 gathered AP entries, over 50 of them described to a degree, and 12 are
                                    operationalized and detectable by SPADe.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card className="p-3 shadow">
                            <Card.Title>
                                <h2>Get Started</h2>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    If you're interested in using SPADe, you can find the framework as open-source at{' '}
                                    <a href="https://github.com/ReliSA/SPADe">https://github.com/ReliSA/SPADe</a>. The web
                                    interface for detection is deployed at &lt;placeholder for production SPADe&gt;. You
                                    can also visit the ReliSA research group website for more context.
                                </Card.Text>
                                <div className="d-flex justify-content-between">
                                    <Button href="https://github.com/ReliSA/SPADe" variant="primary">
                                        GitHub
                                    </Button>
                                    <Button href="#" variant="secondary">
                                        Website
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mt-5">
                    <Col>
                        <Card className="p-3 shadow">
                            <Card.Title>
                                <h2>Published Work</h2>
                            </Card.Title>
                            <Card.Body>
                                <Card.Text>
                                    If you're interested in learning more about the research behind SPADe, you can check
                                    out these published works:
                                </Card.Text>
                                <Card.Text>
                                    <ul>
                                        <li>
                                            <a href="https://doi.org/10.1109/SEAA.2016.37">ALM Tool Data Usage in Software Process Metamodeling</a> - P. Pícha and P. Brada, 2016 42th Euromicro Conference on Software Engineering and Advanced Applications (SEAA)
                                        </li>
                                        <li>
                                            <a href="https://doi.org/10.1109/ICSAW.2017.46">Towards Architect’s Activity Detection through a Common Model for Project Pattern Analysis</a> - P. Pícha, P. Brada, R. Ramsauer, and W. Mauerer, 2017 IEEE International Conference on Software Architecture Workshops (ICSAW)
                                        </li>
                                        <li>
                                            <a href="https://doi.org/10.1145/3361149.3361178">Software process anti-patterns catalogue</a> - P. Brada and P. Picha, 2019 24th European Conference on Pattern Languages of Programs (EuroPLop)
                                        </li>
                                        <li>
                                            <a href="https://doi.org/10.1145/3361149">Software process anti-pattern detection in project data</a> - P. Picha and P. Brada, 2019 24th European Conference on Pattern Languages of Programs (EuroPLop)
                                        </li>
                                    </ul>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>

    );

};

export default MainPage;