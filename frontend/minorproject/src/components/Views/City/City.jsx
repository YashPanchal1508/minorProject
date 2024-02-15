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
import { setRowsPerPage, setCurrentPage, openModal, closeModal, clearEditState, setSelectedCountry, setSelectedState, setEditState } from '../../../redux/CitySlice';

const City = () => {
  const dispatch = useDispatch();
  // const cities = useSelector((state) => state.city.data); // Get city data from Redux store
  // const pagination = useSelector((state) => state.city.pagination); // Get pagination info
  // const [deleteConfirmation, setDeleteConfirmation] = useState(null);

  const [cityName, setCityName] = useState('');
  const [stateName, setStateName] = useState('');
  const { data: states, pagination, isOpen, countries, editState, selectedCountry, stateData, selectedState } = useSelector((state) => state.city);

  const { getCity, getAllCountries, getAllStates } = useCityContext()

  useEffect(() => {
    getCity(1, 5)
  }, []);

  useEffect(() => {
    getAllCountries();
    getAllStates();
  }, [])

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

    }
  }, [editState]);



  const handleEdit = (city) => {
    // console.log(state)
    // console.log(editState)
    // SetEdit state have all row data
    dispatch(setEditState(city));
    dispatch(openModal());
  };

  const handleDelete = () => {

  }
  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
    getCity(newPage + 1, pagination.rowsPerPage);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setRowsPerPage(newRowsPerPage));
    getCity(1, newRowsPerPage);
  };

  const handleFirstPageButtonClick = () => {
    dispatch(setCurrentPage(1));
    getCity(1, pagination.rowsPerPage);
  }

  const handleBackButtonClick = () => {
    const newPage = Math.max(1, pagination.currentPage - 1);
    dispatch(setCurrentPage(newPage));
    getCity(newPage, pagination.rowsPerPage);
  }

  const handleNextButtonClick = () => {
    const newPage = Math.min(pagination.totalPages, pagination.currentPage + 1);
    dispatch(setCurrentPage(newPage));
    getCity(newPage, pagination.rowsPerPage);
  }

  const handleLastPageButtonClick = () => {
    dispatch(setCurrentPage(pagination.totalPages));
    getCity(pagination.totalPages, pagination.rowsPerPage);
  }

  const handleOpenModal = () => {
    dispatch(openModal());
    dispatch(clearEditState())
    dispatch(setSelectedCountry(''));
  };


  const handleCancel = () => {
    dispatch(clearEditState());
    dispatch(closeModal());
    setCityName('')
    setStateName('')
  };

  const handleSearchChange = () => {

  }
  const handleSave = () => {

  }
  const handleCountryChange = (event) => {
    dispatch(setSelectedCountry(event.target.value));
  }
  const handleCityNameChange = (event) => {
    setCityName(event.target.value);
  };

  const handleStateChange = (event) => {
    setStateName(event.target.value);
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
          <DialogTitle>{editState ? 'Edit City' : 'Add City'}</DialogTitle>
          <DialogContent>
            <TextField
              select
              label="Select Country"
              value={selectedCountry}
              onChange={handleCountryChange}
              fullWidth
              margin="normal"
              className='text-center'
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
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

      </div>

      {/* Add City Modal, Search Input, and other components similar to State component */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>

              <TableCell>City Id</TableCell>
              <TableCell>City Name</TableCell>
              <TableCell>State Name</TableCell>
              <TableCell>Country Name</TableCell>
              {/* Add more table headers as needed */}
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {states.map((city) => (
              <TableRow key={city.cityid}>
                <TableCell>{city.cityid}</TableCell>
                <TableCell>{city.cityname}</TableCell>
                <TableCell>{city.statename}</TableCell>
                <TableCell>{city.countryname}</TableCell>
                {/* Add more table cells for additional city data */}
                <TableCell>
                  <button className="text-slate-700 hover:underline mr-2 font-bold" onClick={() => handleEdit(city)}>Edit</button>
                  <button className="text-red-500 hover:underline font-bold" onClick={() => handleDelete(city.cityid)}>Delete</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
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
        />

      </TableContainer>

    </div>
  );
};

export default City;
