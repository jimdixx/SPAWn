import React from 'react';
import {Col, Container, Row} from "react-bootstrap";

const Footer = () => {

    return (

        <footer className="bg-opacity-75 bg-dark text-bg-warning text-white" style={{marginTop: "2em"}}>
            <Container>
                <Row>
                    <Col>
                        <div style={{textAlign: "center"}}>
                            <h5 style={{
                                marginTop: "1em"
                            }}>Sídlo</h5>
                            <hr />
                            <p>
                                Fakulta aplikovaných věd<br/>
                                Západočeská univerzita v Plzni<br/>
                                Technická 8<br/>
                                301 00 Plzeň
                            </p>
                            <p>
                                ID datové schránky ZČU: zqfj9hj
                            </p>
                        </div>
                    </Col>
                    <Col style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "end",
                    }}>
                        <div style={{textAlign: "center"}}>
                            <p>Copyright <span dangerouslySetInnerHTML={{"__html": "&copy;"}}/> 2023. All rights
                                reserved.</p>
                        </div>
                    </Col>
                    <Col>
                        <div style={{
                            textAlign: "center",
                            alignItems: "center"
                        }}>
                            <h5 style={{
                                marginTop: "1em"
                            }}>Fakturační adresa</h5>
                            <hr/>
                            <p>
                                Fakulta aplikovaných věd<br/>
                                Západočeská univerzita v Plzni<br/>
                                Univerzitní 2732/8<br/>
                                301 00 Plzeň
                            </p>
                            <p>
                                IČ: 49777513<br/>
                                DIČ: CZ49777513
                            </p>
                            <p>
                                Telefon: +420 377 631 111<br/>
                                E-mail: suchome@fav.zcu.cz
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );

}

export default Footer;