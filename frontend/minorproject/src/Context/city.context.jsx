/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext} from "react";
import { useDispatch } from 'react-redux';
import { setData,setCurrentPage,setCountries, setStates } from '../redux/CitySlice';

const CityContext = createContext();

const CityProvider = ({children}) => {

    const dispatch = useDispatch()

    const getCity = async(page, limit) => {
            try {

                const response = await fetch(`http://localhost:8000/api/city/getCity`,{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ page, limit }) 
                })

                
            if(!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            const { data, pagination } = result;

            dispatch(setData({ data, pagination }));
            dispatch(setCurrentPage(page));

            } catch (error) {
                    console.log("error getting city", error)
            }
    }       

    const getAllCountries = async() => {
        const response = await fetch('http://localhost:8000/api/state/getAllCountries')
        const allCountry = await response.json();

        if('result' in allCountry){
            dispatch(setCountries(allCountry.result))
        }else{
            console.log("error getting Country")
        }

}
    const getAllStates = async() => {
        const response = await fetch('http://localhost:8000/api/state/getAllStates')
        const allCountry = await response.json();

        if('result' in allCountry){
            dispatch(setStates(allCountry.result))
        }else{
            console.log("error getting Country")
        }

}




    return (
        <CityContext.Provider value={{ getCity,getAllCountries,getAllStates }}>
            {children}
        </CityContext.Provider>
    )
}

export const useCityContext = () =>{ 
    return useContext(CityContext);
}

export {  CityProvider };