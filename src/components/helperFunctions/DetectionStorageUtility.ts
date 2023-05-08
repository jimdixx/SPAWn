export const saveDetectCheckboxesToLocalstorage = (selectedProjects: number[], selectedAntiPatterns: number[]) => {
    localStorage.setItem('selectedProjects', JSON.stringify(selectedProjects));
    localStorage.setItem('selectedAntiPatterns', JSON.stringify(selectedAntiPatterns));
};

export const getDetectCheckboxesFromLocalstorage = (): { selectedProjects: number[], selectedAntiPatterns: number[] } => {
    let selectedProjects: number[] = [];
    let selectedAntiPatterns: number[] = [];

    const selectedProjectsJson = localStorage.getItem('selectedProjects');
    const selectedAntiPatternsJson = localStorage.getItem('selectedAntiPatterns');

    if (selectedProjectsJson) {
        selectedProjects = JSON.parse(selectedProjectsJson);
    }

    if (selectedAntiPatternsJson) {
        selectedAntiPatterns = JSON.parse(selectedAntiPatternsJson);
    }

    return {
        selectedProjects,
        selectedAntiPatterns
    };
};
