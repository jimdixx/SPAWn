import React, {ChangeEvent, useEffect, useState} from 'react';
import Form from "react-bootstrap/form"
/**
 * Component representing default input element
 */
interface InputProps {
    value: string;
    type: string;
    id: string;
    name: string;
    onChange: (elementId:string, value: string) => void;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({ value, name,onChange,id, placeholder = '',type="text" }) => {
    const [inputValue,setInputValue] = useState(value);
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
        onChange(event.target.id,event.target.value);
    };

    return (
        <Form.Control
            type={type}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            id={id}
            name={name}
        />
);
};

export default Input;