import React, {ReactNode} from 'react';
import {useQuery} from "react-query";
import {fetchOneConfiguration} from "../../api/APIConfiguration";
import {retrieveUsernameFromStorage} from "../../context/LocalStorageManager";
import {useNavigate} from "react-router-dom";
import {getConfigurationNameFromLocalstorage} from "../../components/helperFunctions/ConfigurationSelectEvent";

interface ConfigurationWrapper {
    configuration:string
}

interface Configuration {
    antiPattern:string,
    thresholds: ThreshHolds[]
}
interface ThreshHolds {
    thresholdName: string,
    value: string
}
const Configuration = () => {
    const navigate = useNavigate();

    const createConfigurationAntipatern = (threshHolds:ThreshHolds[]):ReactNode[] => {
        return threshHolds.map((threshHold:ThreshHolds,index)=> {
            return (
                <div className={"form-grouprow"}>
                    <label htmlFor={threshHold.thresholdName} className="col-sm-5 col-form-label">{threshHold.thresholdName}</label>
                    <div className="col-sm-5">

                                <input key={index} value={threshHold.value} className="form-control" id={threshHold.thresholdName}
                                       name="thresholdValues"/>

                    </div>
                </div>
            )
        });
    }

    const createConfigurationTable = ():ReactNode[] =>{
        const response:ConfigurationWrapper =  data?.data as ConfigurationWrapper;
        const tmp: {configuration:[]} = JSON.parse(response.configuration);
        const configurationDefinition: [] = tmp.configuration;

       return configurationDefinition.map((cfg:Configuration,index)=>{
            return (
                <div className={"panel panel-default"}>
                    <h4 className={"panel-title ap-configuration header"}><a className={"ap-configuration-header"} href={"#"}>{cfg.antiPattern}</a></h4>
                    <div className={"panel-collapse in collapse show"} id={cfg.antiPattern}>
                    {
                        createConfigurationAntipatern(cfg.thresholds)
                    }
                    </div>
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
            {status === "success" && <div>
                <h1>Configuration</h1>
                {createConfigurationTable()}

            </div>}

        </div>
    );
    
};

export default Configuration;