/* eslint-disable react/prop-types */

// CountryContext.js
import { createContext, useState, useContext } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// import { useLocation, useParams } from 'react-router-dom';

const CountryContext = createContext();

const CountryProvider = ({ children }) => {

  let [countries, setCountries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPage, setTotalPage] = useState(0)
  const [count, setCount] = useState(0)
  // const location = useLocation()
  

  //to fetch all countries
  // const fetchCountries = async (page,limit) => {
  //   try {
    
  //     const response = await fetch(`http://localhost:8000/api/country/getCountry?page=${page}&limit=${limit}`);
  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setCountries(data);
  //   } catch (error) {
  //     console.error('Error fetching countries:', error.message);
  //   }
  // };
  const fetchCountries = async (page, limit,sort,column) => {
    try {
      const response = await fetch('http://localhost:8000/api/country/getCountry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ page, limit, sort,column }) 
      });

        // console.log(page)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }


  
      const result = await response.json();

      const { data, pagination } = result;
      
      setCountries(data);
      console.log(typeof data)
      setCurrentPage(pagination.currentPage);
      console.log(countries)
      setTotalPage(pagination.totalPages);
      setCount(pagination.totalCount)

    } catch (error) {
      console.error('Error fetching countries:', error.message);
    }
  };


  //to delete countries
  const deleteCountries = async (id,page,limit) => {

    try {
      const response = await fetch(`http://localhost:8000/api/country/deleteCountry/${id}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ page,limit })
        },
         
      );

      const data = await response.json();
      const {pagination,finalResult } = data
      setCountries(finalResult);
      setCurrentPage(pagination.currentPage);
      setTotalPage(pagination.totalPages);
      setCount(pagination.totalCount)
      if(data.message === 'Cannot delete country as it is associated with states.'){
        toast.error("Can't Delete Country This country has been linked with a state!");
      }else if(data.message === 'Country deleted successfully.'){
        toast.success("Country deleted successfully.")
      }
    } catch (error) {
      console.error('Error fetching countries:', error.message);
    }
  };


  const addCountry = async (data,page,limit) => {
    try {

      // const checkDuplicateCountry = await fetch(`http://localhost:8000/api/country/checkDuplicateCountry`,{
      //     method: "POST",
      //     headers: { 'Content-Type': 'application/json' },
      //     body: JSON.stringify({ countryName: data.countryName })
      // });

      // const  duplicateData = await checkDuplicateCountry.json();
      // if(duplicateData.isDuplicate === true){
      //   toast.error("Country is Already Exists")
      // }

      const response = await fetch('http://localhost:8000/api/country/createCountry', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryname: data.countryName, countrycode: data.countryCode, phonecode: data.phoneCode,page,limit })
      });
     

      const responseData = await response.json();
     const { result,pagination }  = responseData
      if (response.ok) {
        setCountries(result)
        setCurrentPage(pagination.currentPage)
        setTotalPage(pagination.totalPages);
        setCount(pagination.totalCount)
        toast.success('Country added Successfully');
      } else {
        // Handle error
        if (responseData.error) {
          // Access error message
          toast.error(responseData.error);
        } else {
          toast.error('An error occurred while Adding the country.');
        }
      }
      
    } catch (error) {
      console.error("Error adding country", error);
      
    }
  };
  


  // update the country
  const updateCountry = async (id, data) => {
    try {
      const response = await fetch(`http://localhost:8000/api/country/updateCountry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id, countryName: data.countryName, countryCode: data.countryCode, phoneCode: data.phoneCode }),
      });
  
      if (response.ok) {
        // Assuming the response contains the updated country data
        const updatedCountry = await response.json();
        const { result } = updatedCountry;
  
        // Update the UI with the new data
        setCountries(result);
        console.log(countries)
      } else {
        console.error('Failed to update country:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating country:', error.message);
    }
  };
  

  const filterData = async (country, searchData) => {
    try {
      // const locationSearch = new URLSearchParams(location.search);

      // Set default values if the corresponding query parameters are not present
      // const searchParam = locationSearch.get('search') || '';
      // const codeParam = locationSearch.get('code') || '';
      // const limitParam = locationSearch.get('limit') || '';
      // const pageParam = locationSearch.get('page') || '';
      // console.log(search)
      let response

      if(searchData.search) {
        response = await fetch(
          `http://localhost:8000/api/pagination/${country}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              search: searchData.search,
              limit: searchData.limit,
              page: searchData.page

            })
          }

        );
      } else {
        response = await fetch(
          `http://localhost:8000/api/pagination/${country}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              code: searchData.code,
              limit: searchData.limit,
              page: searchData.page

            })
          }
        );
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setCountries(data.result);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  const  sort = async(tableName, page,limit, sortBy, sortOrder) => {

    const response = await fetch(`http://localhost:8000/api/sort/${tableName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page, limit,sortBy,sortOrder}),
    });

    console.log(sortOrder)

    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }

    const result = await response.json();
    
    const {pagination,data} = result
  

    setCountries(data)
    setCurrentPage(pagination.currentPage)
    setTotalPage(pagination.totalPages)
  }



  return (
    <CountryContext.Provider value={{setCountries, count,countries, fetchCountries,setCurrentPage, deleteCountries, addCountry, updateCountry,sort, filterData, currentPage, totalPage }}>
      {children}
      <ToastContainer/>
    </CountryContext.Provider>
  );

  }

const useCountryContext = () => {
  return useContext(CountryContext);
};

// eslint-disable-next-line react-refresh/only-export-components
export { useCountryContext, CountryProvider }

