import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useDrop, useDrag } from 'react-dnd';
import { useQuery } from "react-query";
import { fetchProjects, ProjectData } from "../../api/APIManagementProjects";
import Project from "../../components/manage/Project";

const Projects = () => {
    const [projectData, setProjectData] = useState<ProjectData[]>([]);
    const [toParentArray, setToParentArray] = useState<ProjectData[]>([]);

    const fetchData = async () => {
        const response = await fetchProjects("Petr");
        setProjectData(response.response.data as ProjectData[]);
        return response.response.data;
    };

    const { error, data } = useQuery('projects', fetchData);

const handleMove = useCallback((projectIdFrom: number, projectIdTo: number) => {
        let fromParent: ProjectData | undefined = undefined;
        let toParent: ProjectData | undefined = undefined;

//         console.log("BEFORE");
//         console.log(projectData);

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

                    if (currProject.project.id === projectIdToFind)  {
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
                const updatedToParent = { ...toParent, children: [...(toParent.children || []), fromParent] };
                let updatedData = projectData.map(item =>
                    item.project.id === updatedToParent.project.id ? updatedToParent : item
                );

                updatedData = updatedData.filter(e => e.project.id !== projectIdFrom);

                setProjectData(updatedData);
            }
        } else {

           fromParent = fromParent?.children?.find(e => e.project.id === projectIdFrom);

           if (toParent && fromParent) {
               const updatedToParent = { ...toParent, children: [...(toParent?.children || []), fromParent] };
               toParent = updatedToParent;
           }

            // TODO FIND THE SPECIFIC ELEMENT IN THE PROJECTDATA ARRAY AND UPDATE IT WITH NEW VALUES

//            let updatedData = projectData.map(item => item?.project?.id === updatedToParent?.project?.id ? updatedToParent : item);

//            updatedData = updatedData.filter(e => e.project?.id !== projectIdFrom);
//            setProjectData(updatedData);
        }


//         console.log("AFTER");
//         console.log(projectData);

    }, [projectData]);



    return (
        <div className="container">
            {projectData.map((project, index) => (
                <Project key={index} projectData={project} level={0} onMove={handleMove} />
            ))}
        </div>
    );
};

export default Projects;