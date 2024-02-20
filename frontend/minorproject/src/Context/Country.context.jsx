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
  const deleteCountries = async (id) => {

    try {
      const response = await fetch(`http://localhost:8000/api/country/deleteCountry/${id}`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();
      setCountries(data);
    } catch (error) {
      console.error('Error fetching countries:', error.message);
    }
  };


  const addCountry = async (data) => {
    try {

      const checkDuplicateCountry = await fetch(`http://localhost:8000/api/country/checkDuplicateCountry`,{
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ countryName: data.countryName })
      });

      const  duplicateData = await checkDuplicateCountry.json();
      if(duplicateData.isDuplicate === true){
        toast.success("Country is Already Exists")
      }

      const response = await fetch('http://localhost:8000/api/country/createCountry', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ countryname: data.countryName, countrycode: data.countryCode, phonecode: data.phoneCode })
      });
  
      if (response.ok) {
        const responseData = await response.json();
  
        if (responseData.updateMessage === 'Country Added') {
          toast.success("Country is Added");
        }else {
          toast.success("Country is Added");
        }
      }
    } catch (error) {
      console.error("Error adding country", error);
      toast.error("An error occurred while adding the country.");
    }
  };
  


  // update the country
  const updateCountry = async (id, data) => {
    // console.log(data)
    try {
      const response = await fetch(`http://localhost:8000/api/country/updateCountry`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: data.countryid , countryName: data.countryName, countryCode: data.countryCode, phoneCode: data.phoneCode}),
      });

      if (response.ok) {
        fetchCountries(currentPage,5)
        }

      // Assuming the response contains the updated country data
      const updatedCountry = await response.json();

      // Update the countries state with the updated country
      

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
    <CountryContext.Provider value={{ count,countries, fetchCountries,setCurrentPage, deleteCountries, addCountry, updateCountry,sort, filterData, currentPage, totalPage }}>
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

