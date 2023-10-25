import React from 'react';
import {useDrop, useDrag} from 'react-dnd';
import {ProjectData} from "../../api/APIManagementProjects";
import { Card } from 'antd';
import {Container} from "react-bootstrap";
const { Meta } = Card;

interface ProjectProps {
    projectData: ProjectData;
    level: number;
    onMove: (fromId: number, toId: number) => void;
}

const Project: React.FC<ProjectProps> = React.memo(({projectData, level, onMove}) => {

    const [, ref] = useDrag({
        type: 'CARD',
        item: { id: projectData.project.id },
        canDrag: projectData.project.id !== 0, // root card (faked parent project with id 0) not draggable
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
        <Container style={{
            justifyItems: "center",
            alignItems: "center"
        }}>
            <Card
                // root card (faked parent project with id 0) not hoverable
                hoverable={projectData.project.id !== 0}
                style={{
                    marginBottom: '0.5%',
                }}
                ref={(node: HTMLDivElement) => { ref(node); drop(node); }}
            >
                <Meta
                    title={projectData.project.name}
                    // description={projectData.project.description}
                />
                {projectData.children.length > 0 && (
                    <div className="card-body" style={{marginTop: "1%"}}>
                        {projectData.children.map((child, index) => (
                            <Project key={index} projectData={child} level={level + 1} onMove={onMove} />
                        ))}
                    </div>
                )}
            </Card>
        </Container>
    );
});

export default Project;