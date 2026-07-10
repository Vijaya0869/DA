import { useDispatch,useSelector } from "react-redux";
import { UpdateDetails } from "./action";

// DataService to be used inside components
export const useDataService = () => {
    const dispatch = useDispatch();

    // updateData updates the value for a given key in the state
    const updateDataRedux = (key: string, value: any) => {
        dispatch(UpdateDetails({ key, value }));
    };

    const getDataRedux = (key: string) => {
        return useSelector((state: any) => state[key]);
    };

    return { updateDataRedux, getDataRedux};
};

// getData should be used within the component directly to access the state
// Get data from state dynamically
// export const useGetData = (key: string) => {
//     return useSelector((state: any) => state[key]);
// };
