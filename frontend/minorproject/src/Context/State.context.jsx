/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext} from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setData,setCurrentPage, setCountries, filterState } from '../redux/stateSlice';
import { toast } from 'react-toastify';



const StateContext = createContext();

const StateProvider = ({children}) => {
    const { pagination  } = useSelector((state) => state.state);
    
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

        // const {data} = result

        if (result.message === 'State with ID deleted successfully.') {
            // Dispatch the deleteStateData action with updated state data
            // console.log(result)
            // dispatch(deleteStateData(result));
            toast.success("State Deleted Successfully");
          } else {
            toast.error("Error Deleting State");
          }
    }

    const filterData = async(state, searchQuery) => {
        try {
            const response = await fetch(
              `http://localhost:8000/api/pagination/${state}`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  search: searchQuery.search,
                  limit: searchQuery.limit,
                  page: searchQuery.page
                })
              }
            );
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }   

            // console.log(searchQuery)
      
            const data = await response.json();
            // console.log(data)

            dispatch(filterState(data.result))

        } catch (error) {
            console.error('Error fetching data:', error.message);
          }
    }

    const updateState = async (id, data) => {
        console.log(data)
        console.log(id)
        try {
          const response = await fetch(`http://localhost:8000/api/state/updateState`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id , stateName: data}),
          });
    
          if (response.ok) {
            getState(pagination.currentPage, pagination.rowsPerPage)
            }
    
          // Assuming the response contains the updated country data
          const updatedState = await response.json();
            console.log(updateState)
          // Update the countries state with the updated country
          
    
        } catch (error) {
          console.error('Error updating country:', error.message);
        }
      };

    return (
        <StateContext.Provider value={{ getState, getAllCountries, addState, deleteState, filterData,updateState }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () =>{ 
      return useContext(StateContext);
}

export {  StateProvider };
