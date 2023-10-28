import React, { ReactNode, useState} from 'react';
import {useQuery} from "react-query";
import {fetchOneConfiguration, saveNewConfiguration,saveConfiguration} from "../../api/APIConfiguration";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {useNavigate} from "react-router-dom";
import {getConfigurationNameFromLocalstorage} from "../../components/helperFunctions/ConfigurationSelectEvent";
import Input from "../../components/input/Input";
import {Row, Col, Container, Button, Alert, Spinner} from 'react-bootstrap';
import Form from "react-bootstrap/Form";
import Section from "./Section";


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
interface formDataObject {
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
    const SAVE_AS_BUTTON_ID: string = "SAVE_AS";
    const SAVE_BUTTON_ID: string = "SAVE";
    const navigate = useNavigate();
    const [form,setForm] = useState<formDataObject>({});
    //use state variable used for reloading component without refreshing the page
    const [seed, setSeed] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [configurationName, setConfiguratioName] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    /**
     * This method gets data about configuration which is chosen in nav bab
     * */
    const fetchConfiguration = async ()=> {
        const userName:string = retrieveUsernameFromStorage();

        setUserName(userName);
        const configurationId:string|undefined = getConfigurationNameFromLocalstorage();

        if (!userName || !configurationId) {
            return;
        }
        const response = await fetchOneConfiguration(userName, configurationId);
        if (response.redirect) {
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
    const {data, status, refetch, isFetching } = useQuery(
        "configurations", fetchConfiguration,
        { refetchOnWindowFocus: false, enabled: true});


    /**
     * Method which updates values in form on page
     * */
    const formDataChange = (elementId:string,inputValue:string)=> {
        const updatedForm = {...form, [elementId]:inputValue};
        setForm(updatedForm);
    }

    /**
     * Method to create content of Antipatterns collapsible element
     * */
    const createConfigurationAntipattern = (configThresHolds:ConfigThresholds[], antiPatterThresholds:AntiPatternsArrayThresholds):ReactNode => {
        return configThresHolds.map((threshHold:ConfigThresholds, index:number) => {
            const antiPatternThresholdName : string = antiPatterThresholds[threshHold.thresholdName].printName;
            const antiPatternDescription: string = antiPatterThresholds[threshHold.thresholdName].description;
            return (
                <Row key={threshHold.thresholdName}>
                    <Col sm={6} key={antiPatternThresholdName}>
                        <Form.Label htmlFor={antiPatternThresholdName} className="col-form-label">{antiPatternThresholdName + ":"}</Form.Label>
                    </Col>
                    <Col sm={6} key={antiPatternDescription}>
                        <small defaultValue={threshHold.value}>{antiPatternDescription}</small>
                        <Input value={threshHold.value} onChange={formDataChange} type={"text"} placeholder={threshHold.value} id={""+Math.random()+""}
                               name="thresholdValues"/>
                    </Col>
                </Row>
            )
        });
    }
    
    /**
     * Method to created headers of collapsible elements
     * */
    const createConfigurationTable = ():ReactNode[] => {
        if (!data) {
            throw new Error("Configuration data not available");
        }
        const configurationDefinition: Configuration[] = data?.configuration;
       return configurationDefinition.map((cfg:Configuration) => {
           const ant: AntiPatterns = data?.antiPatterns[cfg.antiPattern];

            return (
                <div className="preferences" key={ant.id}>
                    <Section title={ant.printName} defaultExpanded={false} sm={10}>
                        {createConfigurationAntipattern(cfg.thresholds, ant.thresholds)}
                    </Section>
                </div>
            )
       });
    }
    
    /**
     * Action on 'SAVE' and 'SAVE AS' buttons
     * It gets configuration, send it vis APIConfiguration and show result
     * */
    const uploadNewConfiguration = async (event:any)=> {
        event.preventDefault();
        if (!data) {
            throw new Error("Configuration data not available");
        }
        // console.log(typeof(event));

        const configurationDefinition: Configuration[] = data?.configuration;
        let response;
        let responseData;
        updateConfiguration(configurationDefinition);

        
        if (event.nativeEvent.submitter.id === SAVE_BUTTON_ID) { //update of configuration
            const configurationId: string|undefined = getConfigurationNameFromLocalstorage();

            if (configurationId === undefined) {
                throw new Error("No configuration selected");
            }
            response = await saveConfiguration(userName,configurationId,configurationDefinition);
            responseData = response.response.data as {message:string};
                
        } else { //creation off new configuration
            response = await saveNewConfiguration(userName,configurationName,configurationDefinition);
            responseData = response.response.data as {message:string};
        }

        
        if (response?.response.status === 201) { //configuration created
            setSuccessMessage(`Configuration with name ${configurationName} created`);
            setErrorMessage("");
        }
        else if (response?.response.status === 200) { //configuration updated
            setSuccessMessage(responseData.message);
            setErrorMessage("");
        } else { //error state
            setErrorMessage(`Configuration could not be created: ${responseData.message}`)
            setSuccessMessage("");
        }

    }

    /**
     * Updates configuration from form
     * */
    function updateConfiguration(configurationDefinition:Configuration[]) {
        configurationDefinition.forEach((config:Configuration)=> {
            const configThreshold:ConfigThresholds[] = config.thresholds;
            configThreshold.forEach((threshold:ConfigThresholds)=> {
                threshold.value = form[threshold.thresholdName]
            });
        });
    }

    window.addEventListener('configuration_changed',async (event) => {
        event.preventDefault();
        await refetch();
    })

    /**
     * Fill up form values from configuration
     * */
    const setDefaultInputState = (configurationDefinitionWrapper:ConfigurationDefinitionWrapper)=> {
        const configurations = configurationDefinitionWrapper.configuration;
        const initialForm:formDataObject = {};
        for (let i = 0; i < configurations.length; i++) {
            const tmp = configurations[i].thresholds;
            for (let j = 0; j < tmp.length; j++) {
                const thresholdName = tmp[j].thresholdName;
                const value = tmp[j].value;
                initialForm[thresholdName] = value;
            }
        }
        setForm(initialForm);

    }

    /**
     * Body of page
     * */
    return (
        <div>
            {
                isFetching ? (
                    <div className={"text-center"}>
                        <Spinner animation={"border"} variant={"primary"}/>
                    </div>
                ) : (
                    status === "success" ? (
                        <Container className="justify-content-center align-items-center" >
                            <Form onSubmit={uploadNewConfiguration}>
                                <Form.Group>
                                    <h1>Configuration</h1>
                                    {createConfigurationTable()}
                                </Form.Group>
                                <Row>
                                    <Col sm={5}>
                                        <Button id={SAVE_BUTTON_ID} type={"submit"}>Save</Button>
                                    </Col>

                                    <Col sm={7}>
                                        <Button id={SAVE_AS_BUTTON_ID} type={"submit"} >Save as</Button>
                                        <Input value={configurationName} type={"text"}
                                               id={"save_as_name"}
                                               name={"configuration_name"} placeholder={"New configuration name"}
                                               onChange={(elementId, value)=>
                                               {setConfiguratioName(value);
                                               }} />
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
                    ) : status === 'loading' ? (
                        <div className={"text-center"}>
                            <Spinner animation={"border"} variant={"primary"}/>
                        </div>
                    ) : (
                        <p>error</p>
                    )
                )
            }
        </div>
    );
};

export default Configuration;