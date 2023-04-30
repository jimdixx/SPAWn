import React, {useEffect, useState} from 'react';
import {Alert, Col, Container, Row, Spinner} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEnvelope} from '@fortawesome/free-solid-svg-icons';
import "./styles/about/style.css"
import {axiosPrivate} from "../api/axios";
import ApiCaller, {apiResponse, HTTP_METHOD} from "../components/api/ApiCaller";
import {useNavigate} from "react-router-dom";

interface AppData {
    version: string;
    authors: { name: string; email: string }[];
    description: string;
}

const About = () => {
    const [appDataList, setAppDataList] = useState<AppData[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {

                const response: apiResponse  = await ApiCaller({},"http://localhost:8080/v2/app/metadata/about",HTTP_METHOD.GET);
                /*const response = await axiosPrivate().get<AppData[]>(
                    'http://localhost:8080/v2/app/metadata/about'
                );*/

                if(response.redirect){
                    navigate(response.redirect);
                } else {
                    const data = response.response.data as []
                    setAppDataList(data.reverse());
                    setLoading(false)
                }

        };
        fetchData();
        setLoading(false);
    }, []);

    return (
        <Container className="about-container">
            {error && <Alert variant="danger">{error}</Alert>}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : (
                <Row>
                    {appDataList && appDataList.length > 0 ? (
                        appDataList.map((appData, index) => (
                            <Col className="app-data-col" md={12} key={index}>
                                <div className="app-data-container">
                                    <div className="app-data-version">{appData.version}</div>
                                    <div className="app-data-authors">
                                        {appData.authors.map((author, authorIndex) => (
                                            <div key={authorIndex}>
                                                {author.name}
                                                <FontAwesomeIcon icon={faEnvelope} />
                                                &nbsp;
                                                <a href={`mailto:${author.email}`}>{author.email}</a>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="app-data-description">{appData.description}</div>
                                </div>
                            </Col>
                        ))
                    ) : (
                        <Alert variant="danger">{"No data available"}</Alert>
                    )}
                </Row>
            )}
        </Container>
    );
};

export default About;
