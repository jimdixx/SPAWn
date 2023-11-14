import React, {ReactNode, useState} from 'react';
import {Iteration} from "../../api/APIManagmetIteartionAndPhases";
import Table from 'react-bootstrap/Table';
import {Button} from "react-bootstrap";
import CheckboxInput from "../input/CheckboxInput";

export interface TableItem{
    id:number,
    externalId:string,
    name:string,
    description:string
}

const createTableHeader = (tableHeaders: string[]): ReactNode => {
    return (
        <thead>
            <tr>
        {tableHeaders.map((value:string, )=>{
            return <th>{value}</th>
        })}
         </tr>
        </thead>
    );
}


const createTableBody = (tableData: TableItem[], header:string): ReactNode => {
    return (
        <tbody>
        {tableData.map((row: TableItem, ) => {
            return (<tr>
                <td><CheckboxInput checked={false} name={row.name} id={header + '_' +row.id.toString()} onChange={(elementId, value) => {}} description={row.name}/></td>
                <td>{row.description}</td>
            </tr>);
            })
        }
        </tbody>
    );
}


const createTable = (tableData:TableItem[], tableHeaders:string[], tableHeader:string) :ReactNode => {
    return (
        <Table>
            {createTableHeader(tableHeaders)}
            {createTableBody(tableData, tableHeader)}
        </Table>
    );
}


const IterationPhase = function (props:{tableData:TableItem[], tableHeaders: string[], tableHeader: string, buttonLabel: string}) {
    return (
        <>
            <h1>{props.tableHeader}</h1>
            <Button id={props.buttonLabel} type={"submit"}>Make selected as {props.buttonLabel}</Button>
            {createTable(props.tableData, props.tableHeaders, props.tableHeader)}
        </>
        );
}

export default IterationPhase;