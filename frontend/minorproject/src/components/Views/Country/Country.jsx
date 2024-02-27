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
import { SearchIcon } from '@heroicons/react/outline';


function Country() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [modalMode, setModalMode] = useState(null);
  const [page, setPage] = useState(0);
  const [searchResults, setSearchResults] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [columnName, setColumnName] = useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isHovered, setIsHovered] = useState({
    countryname: false,
    countrycode: false,
    phonecode: false
  });

  const {
    setCountries,
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

  useEffect(() => {
    const intervalId = setInterval(() => {

      const expiresAt = localStorage.getItem('expiresAt');

      if (expiresAt) {
        const currentTime = Date.now()
        const expiriationTime = parseInt(expiresAt, 10) + 30 * 60 * 1000;
        if (currentTime > expiriationTime) {
          localStorage.removeItem('authToken')
          localStorage.removeItem('expiresAt')
          navigate('/login')
        }
      }
    }, 10000)

    return () => clearInterval(intervalId);

  }, [navigate])


  const handleDelete = async (id) => {
    setDeleteConfirmation(id);
  };



  const confirmDelete = async () => {
    try {
      await deleteCountries(deleteConfirmation, currentPage, rowsPerPage);
      if (countries.length === 1 && totalPage > 1) {
        const newPage = currentPage > 1 ? currentPage - 1 : 1;
        setCurrentPage(newPage);
        setPage(newPage - 1);
      }
      setDeleteConfirmation(null);
      setSearchResults('')
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
    try {
      addCountry(data, currentPage, rowsPerPage);
      setSearchResults('')
      setModalOpen(false);
    } catch (error) {
      console.log("error", error)
    }
  };

  const handleUpdate = async (formData) => {
    try {
      console.log(formData)
      // Make the update request to the backend API
      await updateCountry(selectedCountry.countryid, formData);

      // Update the UI with the new data
      const updatedCountryIndex = countries.findIndex(country => country.countryid === selectedCountry.countryid);
      if (updatedCountryIndex !== -1) {
        const updatedCountries = {
          ...countries[updatedCountryIndex],
          countryname: formData.countryName,
          countrycode: formData.countryCode,
          phonecode: formData.phoneCode,
        };
        const updatedCountryData = [...countries]
        updatedCountryData[updatedCountryIndex] = updatedCountries
        setCountries(updatedCountryData)
      }
      // Provide feedback to the user about the successful update
      setModalOpen(false);

    } catch (error) {
      // Handle errors
      console.error('Error updating country:', error);
      toast.error('Error updating country. Please try again later.');
    }
  };


  const handleSearchChange = async (e) => {
    const country = 'country';
    const eventValue = e.target.value;
    setSearchResults(eventValue)
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
   
      fetchCountries(currentPage, rowsPerPage, sortOrder, columnName);
    } else {
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
    fetchCountries(newPage + 1, rowsPerPage, sortOrder, columnName);
  };

  // Function to handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = event.target.value === '-1' ? parseInt(count) : parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0); // Reset page to 0 when changing rows per page
    fetchCountries(1, newRowsPerPage, sortOrder, columnName); // Fetch data for the first page with the new rows per page
  };

  // Function to handle first page button click
  const handleFirstPageButtonClick = () => {
    setCurrentPage(1);
    fetchCountries(1, rowsPerPage, sortOrder, columnName);
  };

  // Function to handle back button click
  const handleBackButtonClick = () => {
    const newPage = Math.max(1, currentPage - 1);
    setCurrentPage(newPage);
    fetchCountries(newPage, rowsPerPage, sortOrder, columnName);
  };

  // Function to handle next button click
  const handleNextButtonClick = () => {
    const newPage = Math.min(totalPage, currentPage + 1);
    setCurrentPage(newPage);
    fetchCountries(newPage, rowsPerPage, sortOrder, columnName);
  };

  // Function to handle last page button click
  const handleLastPageButtonClick = () => {
    setCurrentPage(totalPage);
    fetchCountries(totalPage, rowsPerPage, sortOrder, columnName);
  };


  useEffect(() => {
    fetchCountries(page + 1, rowsPerPage, sortOrder, columnName);
  }, [page, rowsPerPage, sortOrder, columnName]);



  // Function to handle hover events
  const handleHover = (columnName, isHovering) => {
    setIsHovered({ [columnName]: isHovering });
  };

  return (
    <>
      <section className="flex flex-col gap-4 w-3/4">
        <div className="my-0">
          <div className="w-[100%] flex justify-between">
            <div className="input-group w-[300px] gap-2">
              <input
                type="text"
                className="form-control rounded border border-black bg-transparent pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                placeholder="Search"
                aria-label="Search"
                value={searchResults}
                aria-describedby="search-addon"
                onChange={handleSearchChange}
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-[16px] w-5 text-black" />
              </span>
            </div>
            <button
              type="button"
              className="inline-block px-4 py-2 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              onClick={() => handleOpenModal()}
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

        <div className="flex justify-center items-center  relative flex-grow w-[100%] overflow-y-visible" style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)' }}>
          <TableContainer className="shadow-md ring-offset-black" component={Paper} style={{ maxHeight: rowsPerPage > 5 || rowsPerPage === -1 ? '400px' : '406px', overflowY: 'auto' }} >
            <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
              <TableHead style={{ position: 'sticky', top: 0, background: '#fff' }}>
                <TableRow>
                  <TableCell className='text-center'>Country ID</TableCell>
                 
                  <TableCell
                    className='text-center cursor-pointer relative'
                    onClick={() => handleSort('countryname')}
                    onMouseEnter={() => handleHover('countryname', true)}
                    onMouseLeave={() => handleHover('countryname', false)}
                  >

                    <span className="mr-3"> Country Name </span>
                    <div className={`absolute  top-0  transition-opacity duration-300 ${isHovered.countryname ? 'opacity-100' : 'opacity-0'}`}>
                      {sortOrder === 'asc' ? <>&#8593;</> : <>&#8595;</>}
                    </div>
                  </TableCell>
                  <TableCell
                    className='text-center cursor-pointer relative'
                    onClick={() => handleSort('countrycode')}
                    onMouseEnter={() => handleHover('countrycode', true)}
                    onMouseLeave={() => handleHover('countrycode', false)}
                  >
             

                    <span className="text-center"> Country Code </span>

                    <div className={`absolute  top-0  transition-opacity duration-300 ${isHovered.countrycode ? 'opacity-100' : 'opacity-0'}`}>
                      {sortOrder === 'asc' ? <>&#8593;</> : <>&#8595;</>}
                    </div>
                  </TableCell>

                  <TableCell
                    className='text-center cursor-pointer relative'
                    onClick={() => handleSort('phonecode')}
                    onMouseEnter={() => handleHover('phonecode', true)}
                    onMouseLeave={() => handleHover('phonecode', false)}
                  >

                    <span className=""> Phone Code </span>
                    <div className={`absolute top-0 transition-opacity duration-300 ${isHovered.phonecode ? 'opacity-100' : 'opacity-0'}`}>
                      {sortOrder === 'asc' ? <>&#8593;</> : <>&#8595;</>}
                    </div>
                  </TableCell>

                  <TableCell className='text-center'>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(countries) && countries.length > 0 ? (
                  countries.map((country) => (
                    <TableRow key={country.countryid} hover>
                      <TableCell className='text-center'>{country.countryid}</TableCell>
                      <TableCell className='text-center'>{country.countryname}</TableCell>
                      <TableCell className='text-center'>{country.countrycode}</TableCell>
                      <TableCell className='text-center'>{country.phonecode}</TableCell>
                      <TableCell className='text-center'>
               
                        <button
                          className="text-slate-700 mr-2 font-bold"
                          onClick={() => handleOpenModal('edit', country)}
                        >
                          <img src="public\asset\icons8-edit-24.png" alt="EditImage" className='h-5' />
                        </button>
                        <button
                          className="text-red-500 font-bold"
                          onClick={() => handleDelete(country.countryid)}
                        >
                          <img src="public\asset\icons8-trash-30.png" alt="DeleteButton" className='h-[20px]' />
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
              {!searchResults && <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={parseInt(count)}
                rowsPerPage={rowsPerPage}
                page={currentPage - 1}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={() => (
                  <div style={{ flexShrink: 0, ml: 2.5 }} className="sticky bottom-0 bg-white z-10">
                    <IconButton onClick={handleFirstPageButtonClick} disabled={currentPage === 1 || rowsPerPage === -1} aria-label="first page">
                      <FirstPage />
                    </IconButton>
                    <IconButton onClick={handleBackButtonClick} disabled={currentPage === 1 || rowsPerPage === -1} aria-label="previous page">
                      <KeyboardArrowLeft />
                    </IconButton>
                    <IconButton onClick={handleNextButtonClick} disabled={currentPage === totalPage || rowsPerPage === -1} aria-label="next page">
                      <KeyboardArrowRight />
                    </IconButton>
                    <IconButton onClick={handleLastPageButtonClick} disabled={currentPage === totalPage || rowsPerPage === -1} aria-label="last page">
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
