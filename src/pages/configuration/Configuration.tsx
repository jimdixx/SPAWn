import React, {ReactNode} from 'react';
import {useQuery} from "react-query";
import {fetchOneConfiguration} from "../../api/APIConfiguration";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {useNavigate} from "react-router-dom";
import {getConfigurationNameFromLocalstorage} from "../../components/helperFunctions/ConfigurationSelectEvent";
import Input from "../../components/input/Input";
import { Row, Col,Container } from 'react-bootstrap';
import {useCollapse} from 'react-collapsed';
import Form from "react-bootstrap/Form";
interface ConfigurationWrapper {
    configuration:string
    antiPatterns:any
}

interface Configuration {
    antiPattern:string,
    thresholds: ConfigThresholds[]
}
interface ConfigThresholds {
    thresholdName: string,
    value: string
}

interface AntiPatterThresholds {
    description: string,
    errorMessage: string,
    isErrorMessageShown: boolean,
    name: string,
    printName: string;
    type: string
}

interface AntiPatternsArrayThresholds {
    [key:string]: AntiPatterThresholds
}
interface AntiPatterns {
    catalogueFileName: string,
    description: string,
    id: number,
    name:string,
    printName: string,
    thresholds: AntiPatternsArrayThresholds
}

const Configuration = () => {
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse();
    const navigate = useNavigate();
    const inputChange = (inputValue:any)=>{
        console.log(inputValue);
    }

    const createConfigurationAntipattern = (configThresHolds:ConfigThresholds[], antiPatterThresholds:AntiPatternsArrayThresholds):ReactNode[] => {
        const index = 0;
        return configThresHolds.map((threshHold:ConfigThresholds, index:number)=> {
            const antiPatternThresholdName : string = antiPatterThresholds[threshHold.thresholdName].printName;
            const antiPatternDescription: string = antiPatterThresholds[threshHold.thresholdName].description;
            return (



            <div {...getCollapseProps()}>

                <Row >
                    <div className="content">
                    <Col sm={5}>
                        <Form.Label htmlFor={antiPatternThresholdName} className="col-form-label">{antiPatternThresholdName + ":"}</Form.Label>
                    </Col>

                    <Col sm={5}>
                        <small defaultValue={threshHold.value}>{antiPatternDescription}</small>

                        <Input key={index} value={threshHold.value} onChange={inputChange} type={"text"} placeholder={"ahoj svete"} id={threshHold.thresholdName}
                               name="thresholdValues"/>
                    </Col>
                    </div>

                </Row>
                </div>
            )
        }
        );
    }

    const createConfigurationTable = ():ReactNode[] =>{
        const response:ConfigurationWrapper =  data?.data as ConfigurationWrapper;
        const tmp: {configuration:[]} = JSON.parse(response.configuration);
        const configurationDefinition: [] = tmp.configuration;

       return configurationDefinition.map((cfg:Configuration)=>{
           const ant: AntiPatterns = response.antiPatterns[cfg.antiPattern];

            return (

                    <div className={"panel-collapse in collapse show"} id={ant.printName}>
                    {

                        <div className={"collapsible"}>
                            <div className="header" {...getToggleProps()}>
                                <h4>{ant.printName}</h4>
                            </div>
                                    {createConfigurationAntipattern(cfg.thresholds, ant.thresholds)}


                    </div>
                    }
                    </div>
            )
       });

//    return configurationDefinition;
    }

    const fetchConfiguration = async () => {
        const userName:string|null = retrieveUsernameFromStorage();
        const configurationId:string|undefined = getConfigurationNameFromLocalstorage();

        if(!userName || !configurationId){
            return;
        }
        const response = await fetchOneConfiguration(userName, configurationId);
        if(response.redirect) {
            navigate(response.redirect);
        }
        else {
            return response.response;
        }
    }
    const submitConfigurationForm = async () =>{
        console.log("hello submit")
    }

    const {data, status} = useQuery("configurations",fetchConfiguration,{ refetchOnWindowFocus: false});


    return (
        <div>
            {status === "error" && <p>error</p>}
            {status === "loading" && <p>vykresli kolecko z bootstrapu</p>}
            {status === "success" &&
                <Container className="d-flex justify-content-center align-items-center" >
                    <Form>
                        <Form.Group>

                            <h1>Configuration</h1>
                            {createConfigurationTable()}


                        </Form.Group>

                    </Form>
                </Container>
            }

        </div>
    );
    
};

export default Configuration;