import React from 'react';
import {useCollapse} from 'react-collapsed';
import "../styles/configuration/configuration.css"
function Section(props:any) {
    const config = {
        defaultExpanded: props.defaultExpanded || false,
        collapsedHeight: props.collapsedHeight || 0
    };
    const { getCollapseProps, getToggleProps, isExpanded } = useCollapse(config);
    return (
        <div className="collapsible">
            <div className="header" {...getToggleProps()}>
                <div className="title">{props.title}</div>
                <div className="icon">
                    <i className={'fas fa-chevron-circle-' + (isExpanded ? 'up' : 'down')}></i>
                </div>
            </div>
            <div {...getCollapseProps()}>
                <div className="content">
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Section;