import React, {useMemo, useState, useRef, useLayoutEffect, useEffect} from 'react';
import {useDrop, useDrag} from 'react-dnd';
import {ProjectData} from "../../api/APIManagementProjects";
import {Simulate} from "react-dom/test-utils";
import drag = Simulate.drag;

interface ProjectProps {
    projectData: ProjectData;
    level: number;
    onMove: (fromId: number, toId: number) => void;
}

const Project: React.FC<ProjectProps> = React.memo(({projectData, level, onMove}) => {

    const [, ref] = useDrag({
        type: 'CARD',
        item: { id: projectData.project.id },
    });

    const [, drop] = useDrop({
        accept: 'CARD',
        drop: (draggedProject: { id: number }, monitor) => {
            if (!monitor.didDrop()) {
                const item = monitor.getDropResult();
                console.log(item);
                onMove(draggedProject.id, projectData.project.id);
            }
        },
    });


    return (
        <div ref={(node) => { ref(node); drop(node); }} className="card mb-2">
            <div className="card-body">
                <h5 className="card-title">{projectData.project.name}</h5>
                <p className="card-text">{projectData.project.description}</p>
            </div>
            {projectData.children.length > 0 && (
                <div className="card-body">
                    {projectData.children.map((child, index) => (
                        <Project key={index} projectData={child} level={level + 1} onMove={onMove} />
                    ))}
                </div>
            )}
        </div>
    );
});

export default Project;