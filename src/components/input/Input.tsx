import React, { ChangeEvent } from 'react';
import Form from "react-bootstrap/form"
/**
 * Component representing default input element
 */
interface InputProps {
    value: string;
    type: string;
    id: string;
    name: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const Input: React.FC<InputProps> = ({ value, name,onChange,id, placeholder = '',type="text" }) => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    };

    return (
        <Form.Control
            type={type}
            value={value}
    onChange={handleChange}
    placeholder={placeholder}
            id={id}
            name={name}
    />
);
};

export default Input;