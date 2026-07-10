import { createApiClient } from './apiClient';


// Get payment details by ID
export const useResourceService = () => {
       const  configurationApiClient = createApiClient(process.env.REACT_APP_RESOURCE_BASE_URI as string);
    const getData = async (url: string) => {
        try {
            const response = await configurationApiClient.get(url);
            return (await response)?.data;
        } catch (error) {
            return error;
        }
    };

    const postData = async (url: string,payload:any) => {
        try {
            const response = await configurationApiClient.get(url,payload);
            return (await response)?.data;
        } catch (error) {
            return error;
        }
    };
    return { getData,postData };
}


