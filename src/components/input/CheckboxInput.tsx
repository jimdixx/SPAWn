import React, {ChangeEvent, useEffect, useState} from 'react';
import Form from "react-bootstrap/form"
/**
 * Component representing default input element
 */
interface CheckboxProps {
    checked: boolean;
    id: string;
    name: string;
    onChange: (elementId:string, value: boolean) => void;
    description: string;
}

const CheckboxInput: React.FC<CheckboxProps> = ({ checked, name, onChange, id, description }) => {
    const [checkedValue,setCheckValue] = useState(checked);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckValue(!checkedValue);
        onChange(event.target.id,checkedValue);
    };

    return (
        <Form.Check
            checked={checked}
            onChange={handleChange}
            id={id}
            name={name}
            label={description}
        />
    );
};

export default CheckboxInput;