import React, {FormEvent, ReactNode, useState} from 'react';
import {useQuery} from "react-query";
import {fetchOneConfiguration, saveNewConfiguration} from "../../api/APIConfiguration";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {useNavigate} from "react-router-dom";
import {getConfigurationNameFromLocalstorage} from "../../components/helperFunctions/ConfigurationSelectEvent";
import Input from "../../components/input/Input";
import {Row, Col, Container, Button, Alert} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Section from "./Section";
import AlertComponent from "../../components/alerts/AlertComponent";
import {API_RESPONSE} from "../../components/api/ApiCaller";


interface ConfigurationWrapper {
    configuration:string
    antiPatterns:any
}

interface ConfigurationDefinitionWrapper {
    configuration:Configuration[]
    antiPatterns:GenericAntipatternInterface<AntiPatterns>
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
interface GenericAntipatternInterface<T> {
    [key:string]: T
}
interface AntiPatternsArrayThresholds {
    [key:string]: AntiPatterThresholds
}
interface formDataObject{
    [key:string]:string
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
    const navigate = useNavigate();
    const [form,setForm] = useState<formDataObject>({});
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [alertStatus,setAlertStatus] = useState("");

    const [configurationName, setConfiguratioName] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    const fetchConfiguration = async () => {
        const userName:string = retrieveUsernameFromStorage();

        setUserName(userName);
        const configurationId:string|undefined = getConfigurationNameFromLocalstorage();

        if(!userName || !configurationId){
            return;
        }
        const response = await fetchOneConfiguration(userName, configurationId);
        if(response.redirect) {
            navigate(response.redirect);
        }
        else {
            const data:ConfigurationWrapper =  response.response.data as ConfigurationWrapper;
            const tmp: {configuration:Configuration[]} = JSON.parse(data.configuration);
            const configurationDefinitionWraper: ConfigurationDefinitionWrapper = {configuration:tmp.configuration, antiPatterns:data.antiPatterns};

            setDefaultInputState(configurationDefinitionWraper);
            return configurationDefinitionWraper ;
        }
    }
    const {data, status} = useQuery("configurations",fetchConfiguration,{ refetchOnWindowFocus: false});


    const formDataChange = (elementId:string,inputValue:string)=>{
        const updatedForm = {...form, [elementId]:inputValue};
        setForm(updatedForm);
    }

    const createConfigurationAntipattern = (configThresHolds:ConfigThresholds[], antiPatterThresholds:AntiPatternsArrayThresholds):ReactNode => {
        return configThresHolds.map((threshHold:ConfigThresholds, index:number)=> {
            const antiPatternThresholdName : string = antiPatterThresholds[threshHold.thresholdName].printName;
            const antiPatternDescription: string = antiPatterThresholds[threshHold.thresholdName].description;
            return (
                <Row >
                    <Col sm={6}>
                        <Form.Label htmlFor={antiPatternThresholdName} className="col-form-label">{antiPatternThresholdName + ":"}</Form.Label>
                    </Col>
                    <Col sm={6}>
                        <small defaultValue={threshHold.value}>{antiPatternDescription}</small>
                        <Input key={index} value={threshHold.value} onChange={formDataChange} type={"text"} placeholder={threshHold.value} id={threshHold.thresholdName}
                               name="thresholdValues"/>
                    </Col>
                </Row>
            )
        });
    }
    //
    const createConfigurationTable = ():ReactNode[] =>{
        if(!data){
            throw new Error("Configuration data not available");
        }
        const configurationDefinition: Configuration[] = data?.configuration;
       return configurationDefinition.map((cfg:Configuration)=>{
           const ant: AntiPatterns = data?.antiPatterns[cfg.antiPattern];

            return (
                <div className="preferences">
                    <Section title={ant.printName} defaultExpanded={false} sm={10}>
                        {createConfigurationAntipattern(cfg.thresholds, ant.thresholds)}
                    </Section>
                </div>
            )
       });
    }


    const submitConfigurationForm = async (event:FormEvent) =>{

    }

    const uploadNewConfiguration = async (event:FormEvent) =>{
        event.preventDefault();
        if(!data){
            throw new Error("Configuration data not available");
        }

        const configurationDefinition: Configuration[] = data?.configuration;
        updateConfiguration(configurationDefinition);
        const response = await saveNewConfiguration(userName,configurationName,configurationDefinition);
        const responseData = response.response.data as {message:string};
        if(response.response.status === 200){
            setSuccessMessage(`Configuration with name ${configurationName} created`);
            setErrorMessage("");
        }
        else{
            setErrorMessage(`Configuration could not be created: ${responseData.message}`)
            setSuccessMessage("");
        }

    }

    function updateConfiguration(configurationDefinition:Configuration[]) {
        configurationDefinition.forEach((config:Configuration)=> {
            const configThreshold:ConfigThresholds[] = config.thresholds;
            configThreshold.forEach((threshold:ConfigThresholds)=> {
                threshold.value = form[threshold.thresholdName]
            });
        });
    }

    const setDefaultInputState = (configurationDefinitionWraper:ConfigurationDefinitionWrapper)=>{
        const configurations = configurationDefinitionWraper.configuration;
        const initialForm:formDataObject = {};
        for(let i = 0; i < configurations.length; i++){
            const tmp = configurations[i].thresholds;
            for(let j = 0; j < tmp.length; j++){
                const thresholdName = tmp[j].thresholdName;
                const value = tmp[j].value;
                initialForm[thresholdName] = value;
            }
        }
        setForm(initialForm);

    }

    return (
        <div>
            {status === "error" && <p>error</p>}
            {status === "loading" && <p>vykresli kolecko z bootstrapu</p>}
            {status === "success" &&
                <Container className="justify-content-center align-items-center" >
                    <Form onSubmit={uploadNewConfiguration}>
                        <Form.Group>
                            <h1>Configuration</h1>
                            {createConfigurationTable()}
                        </Form.Group>
                        <Row>
                            <Col sm={5}>
                                <Button type={"button"}>Save</Button>
                            </Col>

                            <Col sm={7}>
                                <Button type={"submit"} >Save as</Button>
                                <Input value={configurationName} type={"text"} id={"save_as_name"}
                                       name={"configuration_name"} placeholder={"New configuration name"} onChange={(elementId, value)=>{setConfiguratioName(value);}} />
                            </Col>
                        </Row>
                    </Form>
                    {
                        errorMessage &&  (
                            <Alert variant="danger" className="my-3">
                                {errorMessage}
                            </Alert>
                        )

                    }
                    {
                        successMessage &&  (
                            <Alert variant="success" className="my-3">
                                {successMessage}
                            </Alert>
                        )
                    }

                </Container>
            }

        </div>
    );
    
};

export default Configuration;