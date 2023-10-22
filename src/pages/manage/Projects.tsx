import React, {useEffect, useState, useMemo, useCallback} from "react";
import {useDrop, useDrag} from 'react-dnd';
import {useQuery} from "react-query";
import {fetchProjects, ProjectData} from "../../api/APIManagementProjects";
import Project from "../../components/manage/Project";

const Projects = () => {
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [toParentArray, setToParentArray] = useState<ProjectData[]>([]);

    const fetchData = async () => {
        const response = await fetchProjects("Petr");
        setProjectData(response.response.data as ProjectData[]);
        return response.response.data;
    };

    const {error, data} = useQuery('projects', fetchData);

    const handleMove = (projectIdFrom: number, projectIdTo: number) => {
        let fromParent: ProjectData | undefined = undefined;
        let toParent: ProjectData | undefined = undefined;

        const bfsTreeSearch = (project: ProjectData, projectIdToFind: number) => {
            let projectParent: ProjectData | undefined = undefined;

            if (project.children.length !== 0) {
                let queue = [] as ProjectData[]

                project.children.forEach(e => {
                    e.parent = project;
                    queue.push(e as ProjectData)
                });

                while (queue.length !== 0) {
                    let currProject = queue.shift() as ProjectData;

                    if (currProject.project.id === projectIdToFind) {
                        return currProject.parent;
                    }

                    currProject.children.forEach(e => {
                        e.parent = currProject;
                        queue.push(e as ProjectData);
                    })
                }
            }

            return projectParent;
        }

        let updatedData = [...projectData];

        fromParent = updatedData.find(item => item.project.id === projectIdFrom);
        toParent = updatedData.find(item => item.project.id === projectIdTo);

        let isProjectFromRoot = false;

        if (!fromParent) {
            for (let i = 0; i < updatedData.length; i++) {
                fromParent = bfsTreeSearch(updatedData[i], projectIdFrom);
                if (fromParent !== undefined) {
                    break;
                }
            }
        } else {
            isProjectFromRoot = true;
        }

        if (!toParent) {
            for (let i = 0; i < updatedData.length; i++) {
                toParent = bfsTreeSearch(updatedData[i], projectIdTo);
                if (toParent !== undefined) {
                    break;
                }
            }
            toParent = toParent?.children?.find(e => e.project.id === projectIdTo);
        }

        if (isProjectFromRoot) {
            if (toParent && fromParent) {
                toParent.children.push(fromParent);
                updatedData = updatedData.filter(e => e.project.id !== fromParent?.project.id)
                setProjectData(updatedData);
            }
        } else {

            let fromParentChild = fromParent?.children?.find(e => e.project.id === projectIdFrom);

            if (toParent && fromParent && fromParentChild) {
                toParent.children.push(fromParentChild);
                let tmp = fromParent.children.filter(e => e.project.id !== fromParentChild?.project.id);
                fromParent.children = tmp;
                setProjectData(updatedData);
            }

        }


    };


    return (
        <div className="container">
            {projectData.map((project, index) => (
                <Project key={index} projectData={project} level={0} onMove={handleMove}/>
            ))}
        </div>
    );
};

export default Projects;