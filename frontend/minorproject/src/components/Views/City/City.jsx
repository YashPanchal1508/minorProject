/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import { TablePagination } from '@mui/material';
import { IconButton } from '@mui/material';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
// import { fetchCityData, deleteCity } from './redux/citySlice'; // Import Redux actions for fetching city data and deleting cities
import { useCityContext } from '../../../Context/city.context';
import { setRowsPerPage, setCurrentPage, openModal, closeModal, clearEditState, setSelectedCountry, setSelectedState, setEditState,} from '../../../redux/CitySlice';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

const City = () => {
  const dispatch = useDispatch();
  // const cities = useSelector((state) => state.city.data); // Get city data from Redux store
  // const pagination = useSelector((state) => state.city.pagination); // Get pagination info
  // const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const [CityId, setCityId] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchResults, setSearchResults] = useState(false);
  const [errors, setErrors] = useState({});
  const [sortOrder, setSortOrder] = useState('');
  const [column, setColumn] = useState('')
  const { data: states, pagination, isOpen, countries, editState, selectedCountry, stateData, selectedState } = useSelector((state) => state.city);

  const { getCity, getAllCountries, getAllStates,addCity,updateCity,deleteCity,filterData,sort} = useCityContext()

  const navigate = useNavigate()

  useEffect(()=> {  
    const intervalId = setInterval(()=> {

      const expiresAt = localStorage.getItem('expiresAt');
  
      if(expiresAt){
        console.log("Hii")
        const currentTime = Date.now()
        const expiriationTime = parseInt(expiresAt, 10) + 30 * 60 * 1000 ;
  
        if(currentTime > expiriationTime){
          console.log('yash')
        const removeItem = localStorage.removeItem('authToken')
          localStorage.removeItem('expiresAt')
         console.log(removeItem)
          navigate('/login')
        }
      }
    }, 10000)

      return  () => clearInterval(intervalId);

    }, [navigate])


  useEffect(() => {
    getCity(1, 5, sortOrder, column)
  }, [sortOrder,column]);

  useEffect(() => {
    getAllCountries();
    // getAllStates(selectedCountry);
  }, [])

  useEffect (() => {
    getAllStates(selectedCountry)
  },[selectedCountry])

  // console.log(selectedCountry)

  const validateForm = () => {
    const newErrors = {};

    if(!stateName){
      newErrors.stateName = 'Pls select state name';
     }


     if(!selectedCountry){
      newErrors.selectedCountry = 'Pls select country name ';
     }

     if(!cityName.match(/^[A-Za-z]{1,10}$/)){
        newErrors.cityName = 'City should contain only alphabets (max 10 characters)'
     }

     if(cityName.length === 0){
      newErrors.cityName = 'City should not blank'
     }

    setErrors(newErrors)

    return Object.keys(newErrors).length === 0;
  }

  useEffect(() => {
    if (!editState) {
      // Reset state when modal is opened for adding a new state
      dispatch(setSelectedCountry(''));
      setCityName('');
    } else {
      // Set state values when editing an existing state
      dispatch(setSelectedCountry(editState.countryid));
      setStateName(editState.stateid)
      setCityName(editState.cityname);
      setCityId(editState.cityid)
    }
  }, [editState]);



  const handleEdit = (city) => {
    // console.log(state)
    // console.log(editState)
    // SetEditstate have all row data
    dispatch(setEditState(city));
    dispatch(openModal());
  };

  const handleDelete =(cityId) => {

    setDeleteConfirmation(cityId)

  };

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
    getCity(newPage + 1, pagination.rowsPerPage,sortOrder,column);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setRowsPerPage(newRowsPerPage));
    getCity(1, newRowsPerPage,sortOrder,column);
  };

  const handleFirstPageButtonClick = () => {
    dispatch(setCurrentPage(1));
    getCity(1, pagination.rowsPerPage,sortOrder,column);
  }

  const handleBackButtonClick = () => {
    const newPage = Math.max(1, pagination.currentPage - 1);
    dispatch(setCurrentPage(newPage));
    getCity(newPage, pagination.rowsPerPage,sortOrder,column);
  }

  const handleNextButtonClick = () => {
    const newPage = Math.min(pagination.totalPages, pagination.currentPage + 1);
    dispatch(setCurrentPage(newPage));
    getCity(newPage, pagination.rowsPerPage,sortOrder,column);
  }

  const handleLastPageButtonClick = () => {
    dispatch(setCurrentPage(pagination.totalPages));
    getCity(pagination.totalPages, pagination.rowsPerPage,sortOrder,column);
  }

  const handleOpenModal = () => {
    dispatch(openModal());
    dispatch(clearEditState())
    dispatch(setSelectedCountry(''));
  };


  const handleCancel = () => {

    if(editState) {
        dispatch(closeModal())
    }
    dispatch(clearEditState());
    setCityName('')
    setStateName('')
    setErrors({})
  };

  const handleSearchChange =  (e) => {
    const city = 'city';
    const query = e.target.value;

    let searchData;

    searchData = {
      search : query,
      limit : pagination.rowsPerPage,
      page: 1
    }

    if(searchData.search === ''){
      getCity(1, pagination.rowsPerPage,sortOrder,column)
      setSearchResults(false)
    }else{
      setSearchResults(true)
      filterData(city, searchData)
    }

  }

  const handleSave = async () => {
    try {
      const isValid = validateForm();

      // Check if the form is valid
      if (isValid) {
      if(editState){
          await updateCity(selectedCountry, stateName, cityName, CityId)
          toast.success("Country Updated Successfully")
      }else{
        await addCity(selectedCountry, stateName, cityName )
      }
        // dispatch(addCityData(cityName, selectedCountry, stateName))
        getCity(pagination.currentPage, pagination.rowsPerPage,sortOrder,column)
        setStateName('')
        dispatch(closeModal())
    }
    } catch (error) {
      console.log("Error occurred", error)
    }


  }

  const handleCountryChange = (event) => {
    dispatch(setSelectedCountry(event.target.value));
  }
  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  const handleStateChange = (event) => {
    setStateName(event.target.value);
    // getAllStates(selectedCountry);
  }

  
  const cancelDelete = () => {
    setDeleteConfirmation(null)
}

const confirmDelete = async() => {
  await deleteCity(deleteConfirmation);
  await getCity(1, pagination.rowsPerPage,sortOrder,column)
  setDeleteConfirmation(null)
}

const handleClose =() => {
    setStateName('')
    dispatch(closeModal())
}

const handleSort = async(columnName) => {
  setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  setColumn(columnName)
  await sort('city', pagination.currentPage, pagination.rowsPerPage, columnName, sortOrder)
 }
 
  return (
    <div>
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
          onClick={() => handleOpenModal()}
        >
          Add City
        </button>

        {/* Dialog Box */}

        <Dialog open={isOpen} onClose={handleCancel}>
          <DialogTitle className='flex justify-between'> {editState ? 'Edit City' : 'Add City'}
          <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Select Country"
              value={selectedCountry}
              onChange={handleCountryChange}
              fullWidth
              margin="normal"
              error={!!errors.selectedCountry}
              helperText={errors.selectedCountry}
            // disabled={editState ? true : false}
            >
              {countries.map((country) => (
                <MenuItem key={country.countryid} value={country.countryid}>
                  {country.countryname}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Select State"
              value={stateName}
              onChange={handleStateChange}
              fullWidth
              margin="normal"
              error={!!errors.stateName}
              helperText={errors.stateName}
            // disabled={editState ? true : false}
            >
              {stateData.map((state) => (
                <MenuItem key={state.stateid} value={state.stateid}>
                  {state.statename}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="City Name"
              value={cityName}
              onChange={handleCityNameChange}
              fullWidth
              margin="normal"
              error={!!errors.cityName}
              helperText={errors.cityName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              { editState ? "cancel" : "cancel"}
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </div>

      {/* Add City Modal, Search Input, and other components similar to State component */}
      <div className='mt-3'>

      <TableContainer component={Paper}  style={{ maxHeight: pagination.rowsPerPage > 5 || pagination.rowsPerPage === -1 ? '400px' : '375px', overflowY: 'auto' }}>
        <Table>
          <TableHead className='sticky top-0 bg-white'>
            <TableRow>

              <TableCell className='text-center'>City Id</TableCell>
              <TableCell className='text-center cursor-pointer' onClick={() => handleSort('cityname')}>City Name  {sortOrder === 'asc' ? '▼' : '▲'}</TableCell>
              <TableCell className='text-center cursor-pointer' onClick={() => handleSort('statename')}>State Name  {sortOrder === 'asc' ? '▼' : '▲'}</TableCell>
              <TableCell className='text-center cursor-pointer' onClick={() => handleSort('countryname')}>Country Name  {sortOrder === 'asc' ? '▼' : '▲'}</TableCell>
              {/* Add more table headers as needed */}
              <TableCell className='text-center'>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {states.map((city) => (
              <TableRow key={city.cityid}>
                <TableCell className='text-center'>{city.cityid}</TableCell>
                <TableCell className='text-center'>{city.cityname}</TableCell>
                <TableCell className='text-center'>{city.statename}</TableCell>
                <TableCell className='text-center'>{city.countryname}</TableCell>
                {/* Add more table cells for additional city data */}
                <TableCell>
                  <button className="text-slate-700 hover:underline mr-2 font-bold" onClick={() => handleEdit(city)}>Edit</button>
                  <button className="text-red-500 hover:underline font-bold" onClick={() => handleDelete(city.cityid)}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="sticky bottom-0 bg-white z-10">
      {!searchResults &&  <TablePagination
          rowsPerPageOptions={[5, 10, 25]} // Options for rows per page
          component="div"
          count={Number.isNaN(pagination.finalTotal) ? 0 : Number(pagination.finalTotal)}
          rowsPerPage={pagination.rowsPerPage}
          page={pagination.currentPage - 1} // Adjusted to 0-based index
          onPageChange={handleChangePage} // Event handler for page change
          onRowsPerPageChange={handleChangeRowsPerPage} // Event handler for rows per page change
          ActionsComponent={() => (
            <div style={{ flexShrink: 0, ml: 2.5 }}>
              <IconButton onClick={handleFirstPageButtonClick} disabled={pagination.currentPage === 1 || pagination.rowsPerPage === -1} aria-label="first page">
                <FirstPage />
              </IconButton>
              <IconButton onClick={handleBackButtonClick} disabled={pagination.currentPage === 1 || pagination.rowsPerPage === -1} aria-label="previous page">
                <KeyboardArrowLeft />
              </IconButton>
              <IconButton onClick={handleNextButtonClick} disabled={pagination.currentPage === pagination.totalPages || pagination.rowsPerPage === -1} aria-label="next page">
                <KeyboardArrowRight />
              </IconButton>
              <IconButton onClick={handleLastPageButtonClick} disabled={pagination.currentPage === pagination.totalPages || pagination.rowsPerPage === -1} aria-label="last page">
                <LastPage />
              </IconButton>
            </div>
          )}
        />}

            </div>
      </TableContainer>
      </div>

      {   deleteConfirmation  &&   <div className="fixed inset-0 z-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 "></div>
          <div className="bg-white p-8 rounded-md z-20">
            <p>Are you sure you want to delete this City?</p>
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
        </div>}
    </div>
  );
};

export default City;
