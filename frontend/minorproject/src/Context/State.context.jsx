/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext} from "react";
import { useDispatch } from 'react-redux';
import { setData,setCurrentPage, setCountries,deleteStateData } from '../redux/stateSlice';
import { toast } from 'react-toastify';

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

    const getAllCountries = async() => {
            const response = await fetch('http://localhost:8000/api/state/getAllCountries')
            const allCountry = await response.json();

            if('result' in allCountry){
                dispatch(setCountries(allCountry.result))
            }

    }

    const addState = async(statename, countryid) => {
                const response  = await fetch(`http://localhost:8000/api/state/addState`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ statename, countryid }) 
                })

                if(!response.ok){
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();

                if(result.updateMessage === 'State Updated'){
                        toast.success("State Successfully Added")
                }else if(result.error === 'State already exists'){
                        toast.success("State Already Exists")
                }else if(result.message === 'State added successfully'){
                        toast.success("State Successfully Added ")
                }else{
                        toast.error("Error Adding State")
                }
    }


    const deleteState = async(stateId) => {
        const response = await fetch(`http://localhost:8000/api/state/deleteState/${stateId}`,{
            method: 'DELETE',
        })

        if(!response.ok){
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json()

        if (result.message === 'country with ID deleted successfully.') {
            // Dispatch the deleteStateData action with updated state data
            dispatch(deleteStateData(stateId));
            toast.success("State Deleted Successfully");
          } else {
            toast.error("Error Deleting State");
          }
    }

    return (
        <StateContext.Provider value={{ getState, getAllCountries, addState, deleteState }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () =>{ 
      return useContext(StateContext);
}

export {  StateProvider };
