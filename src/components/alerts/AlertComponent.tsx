import {Alert} from "react-bootstrap";
import "./Alert.css"

interface Data {
    type: string,
    message: string
}

const AlertComponent = (props: Data) => {
    return (
        <>
            <Alert variant={props.type}
                   className="margin"
            >
                {props.message}
            </Alert>
        </>
    );
}

export default AlertComponent;