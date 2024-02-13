/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext} from "react";
import { useDispatch } from 'react-redux';
import { setData,setCurrentPage } from '../redux/stateSlice';

const StateContext = createContext();

const StateProvider = ({children}) => {

    const dispatch = useDispatch();

    const getState = async(page,limit) => {
        try {
            const response = await fetch(`http://localhost:8000/api/state/getState`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page, limit }) 
            });

            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const { data, pagination } = result;
            
            dispatch(setData({ data, pagination }));
            dispatch(setCurrentPage(page));

        } catch (error) {
            console.log("Error Fetching State", error);
        }
    };

    return (
        <StateContext.Provider value={{ getState }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () =>{ 
      return useContext(StateContext);
}

export {  StateProvider };
