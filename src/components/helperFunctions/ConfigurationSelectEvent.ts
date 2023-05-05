export const saveConfigurationNameToLocalstorage = (configName: string) => {
    localStorage.setItem("configName", configName);
};

export const getConfigurationNameFromLocalstorage = () => {
    const config = localStorage.getItem("configName");
    if(config == null) {
        return undefined;
    }
    return config;
};