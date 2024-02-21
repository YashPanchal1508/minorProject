// import { useState, useEffect } from "react";
// import Modal from "../utils/Modal";
// import { useCountryContext } from "../../../Context/Country.context.jsx";
// import Pagination from "@mui/material/Pagination";
// import Stack from "@mui/material/Stack";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const Country = () => {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [deleteConformation, setDeleteConformation] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [modalMode, setModalMode] = useState(null);
//   const [page, setPage] = useState(0);
//   const [searchResults, setSearchResults] = useState(false);
//   const [sortOrder, setSortOrder] = useState("asc");

//   const {
//     countries,
//     fetchCountries,
//     setCurrentPage,
//     deleteCountries,
//     addCountry,
//     updateCountry,
//     filterData,
//     totalPage,
//     currentPage,
//     sort
//   } = useCountryContext();

//   let newPage = 1,
//     rowsPerPage = 5;

//   useEffect(() => {
//     fetchCountries(newPage, rowsPerPage);
//   }, [newPage]);

//   const handleDelete = async (id) => {
//     setDeleteConformation(id);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteCountries(deleteConformation);
//       toast.success("Country deleted successfully!");
//       if (countries.length === 1 && totalPage > 1) {
//         const newPage = currentPage > 1 ? currentPage - 1 : 1;
//         setCurrentPage(newPage);
//         setPage(newPage);
//         fetchCountries(newPage, rowsPerPage);
//       } else {
//         fetchCountries(currentPage, rowsPerPage);
//       }

//       setDeleteConformation(null);
//     } catch (error) {
//       console.error("Error deleting country:", error);
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteConformation(null);
//   };

//   const handleOpenModal = (mode, country) => {
//     setModalMode(mode);
//     setSelectedCountry(country);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleAddCountry = (data) => {
//     addCountry(data);
//     setModalOpen(false);
//   }

//   const handleUpdate = async (formData) => {
//     await updateCountry(selectedCountry.countryid, formData);
//     toast.success("Country updated successfully!");
//     setModalOpen(false);
//   };

//   const handleSearchChange = async (e) => {
//     const country = "country";
//     const eventValue = e.target.value;

//     let searchData;
//     if (isNaN(eventValue)) {
//       searchData = {
//         search: eventValue,
//         code: "",
//         limit: rowsPerPage,
//         page: 1,
//       };
//     } else {
//       searchData = {
//         search: "",
//         code: eventValue,
//         limit: rowsPerPage,
//         page: 1,
//       };
//     }

//     if (searchData.search === "" && searchData.code === "") {
//       fetchCountries(newPage, rowsPerPage);
//       setSearchResults(false);
//     } else {
//       setSearchResults(true);
//       filterData(country, searchData);
//     }
//   };

//   const handleChangePage = (event, newPage) => {
//     setCurrentPage(newPage);
//     setPage(newPage);
//     fetchCountries(newPage, rowsPerPage);
//   };

//   // console.log(countries)

//   const handleSort = async(columnName) => {
//     setSortOrder((prevOrder) =>( prevOrder === "asc" ? "desc" : "asc"));
//     console.log(columnName)
//     await sort('country',currentPage,rowsPerPage,columnName,sortOrder)
//   };

//   return (
//     <>
//       <section className="">
//         <div className="my-0">
//           <div className="w-[100%] flex justify-between">
//           <div className="input-group w-[300px] gap-2">
//             <input
//               type="search"
//               className="form-control rounded border-black-400 bg-transparent"
//               placeholder="Search"
//               aria-label="Search"
//               aria-describedby="search-addon"
//               onChange={handleSearchChange}
//               />
//           </div>
//           <button
//             type="button"
//             className="btn btn-light"
//             onClick={() => handleOpenModal("add", null)}
//             >
//             Add Country
//           </button>
//             </div>

//           {isModalOpen && (
//             <Modal
//               isOpen={isModalOpen}
//               onClose={handleCloseModal}
//               onSave={selectedCountry ? handleUpdate : handleAddCountry}
//               selectedCountry={selectedCountry}
//               Mode={modalMode}
//             />
//           )}
//         </div>

//         <div className="flex justify-center items-center min-h-[calc(100vh-24rem)] relative flex-grow w-[100%] overflow-y-visible">
//             <table className="border border-gray-300 rounded-md w-[100%]">
//               <thead className="text-center">
//                 <tr>
//                   <th className="py-2 px-4 border-r border-b border-gray-300 w-96">
//                     Country ID
//                   </th>
//                   <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer" onClick={() =>handleSort('countryname')}>
//                    Country Name  {sortOrder === "asc" ? "▼": "▲"}
//                   </th>
//                   <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer"  onClick={() =>handleSort('countrycode')}>
//                      Country Code {sortOrder === "asc" ? "▼": "▲"}
//                   </th>
//                   <th className="py-2 px-4 border-r border-b border-gray-300 cursor-pointer" onClick={() =>handleSort('phonecode')}>
//                     Phone Code {sortOrder === "asc" ? "▼": "▲"}
//                   </th>
//                   <th className="py-2 px-4 border-b border-gray-300 ">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="text-center max-h-96 overflow-y-auto">
//                 {
//               Array.isArray(countries) && countries.length > 0 ?(
//                 countries.map((country) => (
//                       <tr
//                         key={country.countryid}
//                         className="hover:bg-gray-100 text-sm"
//                       >
//                         <td className="py-2 px-4 border-r border-b border-gray-300">
//                           {country.countryid}
//                         </td>
//                         <td className="py-2 px-4 border-r border-b border-gray-300">
//                           {country.countryname} 
//                         </td>
//                         <td className="py-2 px-4 border-r border-b border-gray-300">
//                           {country.countrycode}
//                         </td>
//                         <td className="py-2 px-4 border-r border-b border-gray-300">
//                           {country.phonecode}
//                         </td>
//                         <td className="py-2 px-4 border-b border-gray-300 flex justify-center gap-2">
//                           <button
//                             className="text-slate-700 hover:underline mr-2 font-bold"
//                             onClick={() => handleOpenModal("edit", country)}
//                           >
//                             Edit
//                           </button>
//                           <button
//                             className="text-red-500 hover:underline font-bold"
//                             onClick={() => handleDelete(country.countryid)}
//                           >
//                             Delete
//                           </button>
//                         </td>
//                       </tr>
//                     ))
//                   ) :
//                     (
//                       <tr>
//                         <td colSpan={5} className="text-[200%]">
//                           No Data Found!
//                         </td>
//                       </tr>
//                     )
//                 }
//               </tbody>
//             </table>
//           </div>

//         <Stack className="flex justify-center items-center">
//           {!searchResults && countries && Array.isArray(countries) && (
//             <Pagination
//               count={totalPage}
//               page={currentPage}
//               color="primary"
//               onChange={handleChangePage}
//             />
//           )}
//         </Stack>
//       </section>

//       {deleteConformation && (
//         <div className="fixed inset-0 z-20 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black opacity-50 "></div>
//           <div className="bg-white p-8 rounded-md z-20">
//             <p>Are you sure you want to delete this country?</p>
//             <div className="mt-4 flex justify-end">
//               <button
//                 className="mr-4 text-white bg-opacity-75 z-50 p-2 hover:bg-opacity-100 bg-blue-600 rounded-md"
//                 onClick={cancelDelete}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="text-white bg-red-500 bg-opacity-75 z-50 p-2 hover:bg-opacity-100 rounded-md"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };
// export default Country;

// import * as React from 'react';
// import { useState, useEffect } from 'react';
// import Modal from '../utils/Modal';
// import { useCountryContext } from '../../../Context/Country.context.jsx';
// import { toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import TableContainer from '@mui/material/TableContainer';
// import Table from '@mui/material/Table';
// import TableHead from '@mui/material/TableHead';
// import TableBody from '@mui/material/TableBody';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import Paper from '@mui/material/Paper';
// import TablePagination from '@mui/material/TablePagination';
// import { IconButton } from '@mui/material';
// import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';

// function Country() {
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [deleteConfirmation, setDeleteConfirmation] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [modalMode, setModalMode] = useState(null);
//   const [page, setPage] = useState(0);
//   const [searchResults, setSearchResults] = useState(false);
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [rowsPerPage, setRowsPerPage] = React.useState(5);

//   const {
//     countries,
//     fetchCountries,
//     setCurrentPage,
//     deleteCountries,
//     addCountry,
//     updateCountry,
//     filterData,
//     totalPage,
//     currentPage,
//     sort,
//   } = useCountryContext();

//   useEffect(() => {
//     fetchCountries(page + 1, rowsPerPage);
//   }, [page, rowsPerPage]);

//   const handleDelete = async (id) => {
//     setDeleteConfirmation(id);
//   };

//   const confirmDelete = async () => {
//     try {
//       await deleteCountries(deleteConfirmation);
//       toast.success('Country deleted successfully!');
//       if (countries.length === 1 && totalPage > 1) {
//         const newPage = currentPage > 1 ? currentPage - 1 : 1;
//         setCurrentPage(newPage);
//         setPage(newPage - 1);
//       }
//       setDeleteConfirmation(null);
//     } catch (error) {
//       console.error('Error deleting country:', error);
//     }
//   };

//   const cancelDelete = () => {
//     setDeleteConfirmation(null);
//   };

//   const handleOpenModal = (mode, country) => {
//     setModalMode(mode);
//     setSelectedCountry(country);
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//   };

//   const handleAddCountry = (data) => {
//     addCountry(data);
//     setModalOpen(false);
//   };

//   const handleUpdate = async (formData) => {
//     await updateCountry(selectedCountry.countryid, formData);
//     toast.success('Country updated successfully!');
//     setModalOpen(false);
//   };

//   const handleSearchChange = async (e) => {
//     const country = 'country';
//     const eventValue = e.target.value;

//     let searchData;
//     if (isNaN(eventValue)) {
//       searchData = {
//         search: eventValue,
//         code: '',
//         limit: rowsPerPage,
//         page: 1,
//       };
//     } else {
//       searchData = {
//         search: '',
//         code: eventValue,
//         limit: rowsPerPage,
//         page: 1,
//       };
//     }

//     if (searchData.search === '' && searchData.code === '') {
//       fetchCountries(1, rowsPerPage);
//       setSearchResults(false);
//     } else {
//       setSearchResults(true);
//       filterData(country, searchData);
//     }
//   };

//   const handleSort = async (columnName) => {
//     setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
//     console.log(columnName);
//     await sort('country', currentPage, rowsPerPage, columnName, sortOrder);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//     setCurrentPage(newPage)
//     fetchCountries(newPage,rowsPerPage)
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(parseInt(event.target.value, page));
//     setPage(0);
//   };

//   return (
//     <>
//       <section className="">
//         <div className="my-0">
//           <div className="w-[100%] flex justify-between">
//             <div className="input-group w-[300px] gap-2">
//               <input
//                 type="search"
//                 className="form-control rounded border-black-400 bg-transparent"
//                 placeholder="Search"
//                 aria-label="Search"
//                 aria-describedby="search-addon"
//                 onChange={handleSearchChange}
//               />
//             </div>
//             <button
//               type="button"
//               className="btn btn-light"
//               onClick={() => handleOpenModal('add', null)}
//             >
//               Add Country
//             </button>
//           </div>

//           {isModalOpen && (
//             <Modal
//               isOpen={isModalOpen}
//               onClose={handleCloseModal}
//               onSave={selectedCountry ? handleUpdate : handleAddCountry}
//               selectedCountry={selectedCountry}
//               Mode={modalMode}
//             />
//           )}
//         </div>

//         <div className="flex justify-center items-center min-h-[calc(100vh-24rem)] relative flex-grow w-[100%] overflow-y-visible">
//           <TableContainer component={Paper}>
//             <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
//               <TableHead>
//                 <TableRow>
//                   <TableCell>Country ID</TableCell>
//                   <TableCell
//                     className="cursor-pointer"
//                     onClick={() => handleSort('countryname')}
//                   >
//                     Country Name {sortOrder === 'asc' ? '▼' : '▲'}
//                   </TableCell>
//                   <TableCell
//                     className="cursor-pointer"
//                     onClick={() => handleSort('countrycode')}
//                   >
//                     Country Code {sortOrder === 'asc' ? '▼' : '▲'}
//                   </TableCell>
//                   <TableCell
//                     className="cursor-pointer"
//                     onClick={() => handleSort('phonecode')}
//                   >
//                     Phone Code {sortOrder === 'asc' ? '▼' : '▲'}
//                   </TableCell>
//                   <TableCell>Action</TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {Array.isArray(countries) && countries.length > 0 ? (
//                   countries.map((country) => (
//                     <TableRow key={country.countryid} hover>
//                       <TableCell>{country.countryid}</TableCell>
//                       <TableCell>{country.countryname}</TableCell>
//                       <TableCell>{country.countrycode}</TableCell>
//                       <TableCell>{country.phonecode}</TableCell>
//                       <TableCell>
//                         <button
//                           className="text-slate-700 hover:underline mr-2 font-bold"
//                           onClick={() => handleOpenModal('edit', country)}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           className="text-red-500 hover:underline font-bold"
//                           onClick={() => handleDelete(country.countryid)}
//                         >
//                           Delete
//                         </button>
//                       </TableCell>
//                     </TableRow>
//                   ))
//                 ) : (
//                   <TableRow>
//                     <TableCell colSpan={5} className="text-[200%]">
//                       No Data Found!
//                     </TableCell>
//                   </TableRow>
//                 )}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </div>

//         <TablePagination
//           rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
//           colSpan={3}
//           count={totalPage}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />

//       </section>

//       {deleteConfirmation && (
//         <div className="fixed inset-0 z-20 flex items-center justify-center">
//           <div className="absolute inset-0 bg-black opacity-50 "></div>
//           <div className="bg-white p-8 rounded-md z-20">
//             <p>Are you sure you want to delete this country?</p>
//             <div className="mt-4 flex justify-end">
//               <button
//                 className="mr-4 text-white bg-opacity-75 z-50 p-2 hover:bg-opacity-100 bg-blue-600 rounded-md"
//                 onClick={cancelDelete}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="text-white bg-red-500 bg-opacity-75 z-50 p-2 hover:bg-opacity-100 rounded-md"
//                 onClick={confirmDelete}
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Country;

import * as React from 'react';
import { useState, useEffect } from 'react';
import Modal from '../utils/Modal';
import { useCountryContext } from '../../../Context/Country.context.jsx';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { IconButton } from '@mui/material';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Country() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState(false);
  const [sortOrder, setSortOrder] = useState('asc');
  const [columnName, setColumnName] = useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const {
    countries,
    fetchCountries,
    setCurrentPage,
    deleteCountries,
    addCountry,
    updateCountry,
    filterData,
    totalPage,
    currentPage,
    sort,
    count
  } = useCountryContext();

  const navigate = useNavigate()

  useEffect(()=> {  
    const intervalId = setInterval(()=> {

      const expiresAt = localStorage.getItem('expiresAt');
  
      if(expiresAt){
        const currentTime = Date.now()
        const expiriationTime = parseInt(expiresAt, 10) + 30 * 60 * 1000 ;
        if(currentTime > expiriationTime){
        localStorage.removeItem('authToken')
          localStorage.removeItem('expiresAt')
          navigate('/login')
        }
      }
    }, 10000)

      return  () => clearInterval(intervalId);

    }, [navigate])


  useEffect(() => {
    fetchCountries(page + 1, rowsPerPage,sortOrder,columnName);
  }, [page, rowsPerPage,sortOrder,columnName]);

  const handleDelete = async (id) => {
    setDeleteConfirmation(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteCountries(deleteConfirmation);
      if (countries.length === 1 && totalPage > 1) {
        const newPage = currentPage > 1 ? currentPage - 1 : 1;
        setCurrentPage(newPage);
        setPage(newPage - 1);
        fetchCountries(newPage,rowsPerPage,sortOrder,columnName)
      }else{
        fetchCountries(1,rowsPerPage,sortOrder,columnName);
      }
      setDeleteConfirmation(null);
      setSearchResults(false)
    } catch (error) {
      console.error('Error deleting country:', error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleOpenModal = (mode, country) => {
    setModalMode(mode);
    setSelectedCountry(country);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleAddCountry = (data) => {
    addCountry(data);
    setModalOpen(false);
  };

  const handleUpdate = async (formData) => {
    await updateCountry(selectedCountry.countryid, formData);
    toast.success('Country updated successfully!');
    setModalOpen(false);
  };

  const handleSearchChange = async (e) => {
    const country = 'country';
    const eventValue = e.target.value;

    let searchData;
    if (isNaN(eventValue)) {
      searchData = {
        search: eventValue,
        code: '',
        limit: rowsPerPage,
        page: 1,
      };
    } else {
      searchData = {
        search: '',
        code: eventValue,
        limit: rowsPerPage,
        page: 1,
      };
    }

    if (searchData.search === '' && searchData.code === '') {
      fetchCountries(1, rowsPerPage,sortOrder,columnName);
      setSearchResults(false);
    } else {
      setSearchResults(true);
      filterData(country, searchData);
    }
  };

  const handleSort = async (columnName) => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setColumnName(columnName);
    await sort('country', currentPage, rowsPerPage, columnName, sortOrder);
  };

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage + 1); // Adjusting newPage to 1-based index
    fetchCountries(newPage + 1, rowsPerPage,sortOrder,columnName);
  };
  
  // Function to handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = event.target.value === '-1' ? parseInt(count) : parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when changing rows per page
    fetchCountries(1, newRowsPerPage,sortOrder,columnName); // Fetch data for the first page with the new rows per page
  };
  
  // Function to handle first page button click
  const handleFirstPageButtonClick = () => {
    setCurrentPage(1);
    fetchCountries(1, rowsPerPage,sortOrder,columnName);
  };
  
  // Function to handle back button click
  const handleBackButtonClick = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    fetchCountries(newPage, rowsPerPage,sortOrder,columnName);
  };
  
  // Function to handle next button click
  const handleNextButtonClick = () => {
    const newPage = Math.min(totalPage, currentPage + 1);
    setCurrentPage(newPage);
    fetchCountries(newPage, rowsPerPage,sortOrder,columnName);
  };
  
  // Function to handle last page button click
  const handleLastPageButtonClick = () => {
    setCurrentPage(totalPage);
    fetchCountries(totalPage, rowsPerPage,sortOrder,columnName);
  };



  return (
    <>
      <section className="flex flex-col gap-4">
        <div className="my-0">
          <div className="w-[100%] flex justify-between">
            <div className="input-group w-[300px] gap-2">
              <input
                type="search"
                className="form-control rounded border-black-400 bg-transparent"
                placeholder="Search"
                aria-label="Search"
                aria-describedby="search-addon"
                onChange={handleSearchChange}
              />
            </div>
            <button
              type="button"
              className="btn btn-light"
              onClick={() => handleOpenModal('add', null)}
            >
              Add Country
            </button>
          </div>

          {isModalOpen && (
            <Modal
              isOpen={isModalOpen}
              onClose={handleCloseModal}
              onSave={selectedCountry ? handleUpdate : handleAddCountry}
              selectedCountry={selectedCountry}
              Mode={modalMode}
            />
          )}
        </div>

        <div className="flex justify-center items-center min-h-[calc(100vh-24rem)] relative flex-grow w-[100%] overflow-y-visible">
          <TableContainer component={Paper} style={{ maxHeight: rowsPerPage > 5 || rowsPerPage === -1 ? '400px' : '374px', overflowY: 'auto' }}>
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead style={{ position: 'sticky', top: 0, background: '#fff' }}>
                <TableRow>
                  <TableCell className='text-center'>Country ID</TableCell>
                  <TableCell
                    className="cursor-pointer text-center"
                    onClick={() => handleSort('countryname')}
                  >
                    Country Name {sortOrder === 'asc' ? '▼' : '▲'}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer text-center"
                    onClick={() => handleSort('countrycode')}
                  >
                    Country Code {sortOrder === 'asc' ? '▼' : '▲'}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer text-center"
                    onClick={() => handleSort('phonecode')}
                  >
                    Phone Code {sortOrder === 'asc' ? '▼' : '▲'}
                  </TableCell>
                  <TableCell className='text-center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody >
                {Array.isArray(countries) && countries.length > 0 ? (
                  countries.map((country) => (
                    <TableRow key={country.countryid} hover>
                      <TableCell className='text-center'>{country.countryid}</TableCell>
                      <TableCell className='text-center'>{country.countryname}</TableCell>
                      <TableCell className='text-center'>{country.countrycode}</TableCell>
                      <TableCell className='text-center'> {country.phonecode}</TableCell>
                      <TableCell>
                        <button
                          className="text-slate-700 hover:underline mr-2 font-bold"
                          onClick={() => handleOpenModal('edit', country)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:underline font-bold"
                          onClick={() => handleDelete(country.countryid)}
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-[200%]">
                      No Data Found!
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <div className='flex justify-end'>
            { !searchResults && <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          colSpan={3}
          count={count}
          rowsPerPage={rowsPerPage}
          page={currentPage - 1} 
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={() => (
            <div style={{ flexShrink: 0, ml: 2.5 }}>
              <IconButton onClick={handleFirstPageButtonClick} disabled={currentPage === 1 || rowsPerPage === -1} aria-label="first page">
                <FirstPage />
              </IconButton>
              <IconButton onClick={handleBackButtonClick} disabled={currentPage === 1 ||rowsPerPage === -1} aria-label="previous page">
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton onClick={handleNextButtonClick} disabled={currentPage === totalPage ||rowsPerPage === -1} aria-label="next page">
                <KeyboardArrowRight />
              </IconButton>
              <IconButton onClick={handleLastPageButtonClick} disabled={currentPage === totalPage ||rowsPerPage === -1} aria-label="last page">
                <LastPage />
              </IconButton>
            </div>
          )}
        />}
            </div>


          </TableContainer>
        </div>
                  
      

      </section>

      {deleteConfirmation && (
        <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 "></div>
          <div className="bg-white p-8 rounded-md z-20">
            <p>Are you sure you want to delete this country?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="mr-4 text-white bg-opacity-75 z-50 p-2 hover:bg-opacity-100 bg-blue-600 rounded-md"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="text-white bg-red-500 bg-opacity-75 z-50 p-2 hover:bg-opacity-100 rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Country;
