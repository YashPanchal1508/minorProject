/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */

import { createContext, useContext } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { setData, setCurrentPage, setCountries, filterState, sortData, updateStateData, addStateData, deleteStateData } from '../redux/stateSlice';
import { toast } from 'react-toastify';

const StateContext = createContext();

const StateProvider = ({ children }) => {
  const { pagination } = useSelector((state) => state.state);

  const dispatch = useDispatch();

  const getState = async (page, limit, sort, column) => {
    try {
      const response = await fetch(`http://localhost:8000/api/state/getState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, limit, sort, column })
      });

      if (!response.ok) {
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

  const getAllCountries = async () => {
    const response = await fetch('http://localhost:8000/api/state/getAllCountries')
    const allCountry = await response.json();

    if ('result' in allCountry) {
      dispatch(setCountries(allCountry.result))
    }

  }

  const addState = async (statename, countryid, page, limit) => {

    try {
      const checkDuplicateState = await fetch(`http://localhost:8000/api/state/checkDuplicateState`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statename })
      });

      const duplicateData = await checkDuplicateState.json();
      // console.log(duplicateData)
      if (duplicateData.isDuplicate === true) {
        toast.error("State is Already Exists")
        return null
      }

      const response = await fetch(`http://localhost:8000/api/state/addState`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statename, countryid, page, limit })
      })

      if (!response.ok) {
       
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      if(result.error){
        toast.error(result.error)
      }
      
      if(result.updateMessage){
        dispatch(addStateData(result))
        toast.success(result.updateMessage)
      }
      
    } catch (error) {
      console.log(error)
    }
  }


  const deleteState = async (stateId, page, limit) => {
    const response = await fetch(`http://localhost:8000/api/state/deleteState/${stateId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, limit })
    })

    if (!response.ok) {
    const result = await response.json()
     if (result.message === 'Cannot delete state as it is associated with cities.') {
      toast.error("Cannot delete state with existing city")
    }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json()
    // const {data} = result

    if (result.message === 'State deleted successfully.') {
      // Dispatch the deleteStateData action with updated state data
      // console.log(result)
      // dispatch(deleteStateData(result));
      toast.success("State Deleted Successfully");
    }
    dispatch(deleteStateData(result))

  }

  const filterData = async (state, searchQuery) => {
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

  const updateState = async (data, countryid, id) => {
    // console.log(data)
    // console.log(id)
    // console.log(countryid,data, id)
    try {
      const response = await fetch(`http://localhost:8000/api/state/updateState`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data, countryid, id }),
      });

    
      // Assuming the response contains the updated country data
      const updatedState = await response.json();

      if (updatedState.error) {
        toast.error(updatedState.error)
      }

      const { country } = updatedState;


      if (updatedState.message) {
        toast.success(updatedState.message)
      }
      dispatch(updateStateData(country));
      // console.log(updateState)
      // Update the countries state with the updated country


    } catch (error) {
      console.error('Error updating country:', error.message);
    }
  };


  const sort = async (tableName, page, limit, sortBy, sortOrder) => {
    console.log(tableName, page, limit, sortBy, sortOrder)
    const response = await fetch(`http://localhost:8000/api/sort/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page, limit, sortBy, sortOrder }),
    });

    console.log(sortOrder)

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();

    const { pagination, data } = result

    console.log(result)

    dispatch(sortData({ data: data, pagination: pagination }));

  }

  return (
    <StateContext.Provider value={{ getState, getAllCountries, addState, deleteState, filterData, updateState, sort }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => {
  return useContext(StateContext);
}

export { StateProvider };
