/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";
import { useDispatch } from 'react-redux';
import { setData, setCurrentPage, setCountries, setStates,addCityData,filterCity,sortData } from '../redux/CitySlice';
import { toast } from "react-toastify";

const CityContext = createContext();

const CityProvider = ({ children }) => {

    const dispatch = useDispatch()

    const getCity = async (page, limit,sort,column) => {
        try {

            const response = await fetch(`http://localhost:8000/api/city/getCity`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ page, limit,sort, column })
            })


            if (!response.ok) {
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

    const getAllCountries = async () => {
        const response = await fetch('http://localhost:8000/api/state/getAllCountries')
        const allCountry = await response.json();

        if ('result' in allCountry) {
            dispatch(setCountries(allCountry.result))
        } else {
            console.log("error getting Country")
        }

    }
    const getAllStates = async (id) => {
        const response = await fetch('http://localhost:8000/api/state/getAllStates',{
                method: "POST",
                headers:{
                    'Content-Type':'application/json'
                } ,
                body :JSON.stringify({ countryid : id }) 
        })
        const allCountry = await response.json();

        if ('result' in allCountry) {
            dispatch(setStates(allCountry.result))
        } else {
            console.log("error getting Country")
        }

    }

    const addCity = async (countryId, stateId, cityName) => {
        try {
            const checkDuplicateCity = await fetch(`http://localhost:8000/api/city/checkDuplicateCity`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cityName })
            });
    
            const duplicateData = await checkDuplicateCity.json();
            if (duplicateData.isDuplicate === true) {
                toast.success("City is Already Exists");
                return null;
            }
    
            const response = await fetch('http://localhost:8000/api/city/addCity', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ countryId, stateId, cityName })
            });
    
            const result = await response.json();
    
            if (result.message === 'City Added successfully') {
                toast.success("City Added successfully");
            } else if(result.message === 'City already exists and has been activated.'){
                toast.success("City Added successfully");
            }else {
                toast.error("Error Adding City");
            }
        } catch (error) {
            console.log(error);
        }
    }
    

    const updateCity = async(countryId, stateId, cityName, cityId) => {

        const response = await fetch(`http://localhost:8000/api/city/updateCity`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cityName, stateId, countryId ,cityId }),
        })

        const result = await response.json();
        console.log(result)
    }

    const deleteCity = async(cityId) => {
            const response = await fetch(`http://localhost:8000/api/city/removeCity`,    {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({cityId})
            })

            const data = await response.json();
            if(data.message === `City Deleted Successfully`){
                    toast.success("City Deleted Successfully")
            }else{
                toast.error("Error Deleting City")
            }


    }

    const filterData = async(city, searchQuery) => {

        try {
            const response = await fetch(
              `http://localhost:8000/api/pagination/${city}`,
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

            dispatch(filterCity(data.result))

        } catch (error) {
            console.error('Error fetching data:', error.message);
          }
    }

    const sort = async(tableName, page,limit, sortBy, sortOrder) => {
        console.log(tableName, page,limit, sortBy, sortOrder)
        const response = await fetch(`http://localhost:8000/api/sort/${tableName}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page, limit,sortBy,sortOrder }),
        });
    
        console.log(sortOrder)
    
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
    
        const result = await response.json();
        
        const {pagination,data} = result
        
        console.log(result)
    
        dispatch(sortData({data: data,  pagination: pagination}));
    }

    return (
        <CityContext.Provider value={{ getCity, getAllCountries, getAllStates, addCity , updateCity, deleteCity, filterData,sort}}>
            {children}
        </CityContext.Provider>
    )
}

export const useCityContext = () => {
    return useContext(CityContext);
}

export { CityProvider };