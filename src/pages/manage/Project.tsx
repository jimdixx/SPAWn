import React, { useEffect, useState } from "react";
import { useDrop, useDrag } from 'react-dnd';
import { fetchProjects, ProjectData } from "../../api/APIManagementProjects";

const Project = () => {
    const [projectData, setProjectData] = useState<ProjectData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchProjects("Petr");
            setProjectData(response.response.data as ProjectData[]);
        };

        fetchData();
        console.log(projectData);
    }, [projectData]);

    interface ProjectProps {
        projectData: ProjectData;
        level: number;
        onMove: (fromId: number, toId: number) => void;
    }

    const ProjectItem: React.FC<ProjectProps> = ({ projectData, level, onMove }) => {
        const marginLeft = level * 20;

        const [, ref] = useDrag({
            type: 'CARD',
            item: { id: projectData.project.id },
        });

        const [, drop] = useDrop({
            accept: 'CARD',
            hover: (draggedProject: { id: number }) => {
                onMove(draggedProject.id, projectData.project.id);
            },
        });

        return (
            <div ref={(node) => ref(drop(node))} className="card mb-2" style={{ marginLeft: `${marginLeft}px` }}>
                <div className="card-body">
                    <h5 className="card-title">{projectData.project.name}</h5>
                    <p className="card-text">{projectData.project.description}</p>
                </div>
                {projectData.children.length > 0 && (
                    <div className="card-body">
                        {projectData.children.map((child, index) => (
                            <ProjectItem key={index} projectData={child} level={level + 1} onMove={onMove} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    const handleMove = (fromId: number, toId: number) => {
        console.log("moved from " + fromId + " to " + toId);
        // Step 1: Find the fromProject and fromParent
        let fromProject: ProjectData | null = null;
        let fromParent: ProjectData | null = null;

        const updatedData = projectData.map(project => {
            if (project.project.id === fromId) {
                fromProject = project;
            }

            // If the project is a child, also find its parent
            if (project.children && project.children.some(child => child.project.id === fromId)) {
                fromParent = project;
            }

            return {
                ...project,
                children: project.children ? project.children.filter(child => child.project.id !== fromId) : []
            };
        });

        if (fromProject && fromParent) {
            // Step 2: Find the target project (the one where you're dropping the element)
            const targetProject = updatedData.find(project => project.project.id === toId);

            if (targetProject && 'children' in targetProject && Array.isArray(targetProject.children)) {
                // Step 3: Adjust parent-child relationships
                fromParent = fromProject as ProjectData;
                fromParent.children = fromParent.children ? fromParent.children.filter(child => child.project.id !== fromId) : [];
                targetProject.children = [...(targetProject.children || []), fromProject];
            }
        }

        // Step 4: Update the state with the modified data
        setProjectData(updatedData);
    };

    return (
        <div className="container">
            {projectData.map((project, index) => (
                <ProjectItem key={index} projectData={project} level={0} onMove={handleMove} />
            ))}
        </div>
    );
};

export default Project;