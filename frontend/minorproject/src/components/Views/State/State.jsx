

/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { setCurrentPage, setRowsPerPage, openModal, closeModal, setEditState, clearEditState, setSelectedCountry, addStateData } from '../../../redux/stateSlice';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect, useState } from "react";
import { useStateContext } from '../../../Context/State.context'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { SearchIcon } from '@heroicons/react/outline';



const State = () => {
  const dispatch = useDispatch();
  const { getState, getAllCountries, addState, deleteState, filterData, updateState, sort } = useStateContext()
  const { data: states, pagination, isOpen, countries, editState, selectedCountry } = useSelector((state) => state.state);
  const [stateName, setStateName] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [columnName, setColumnName] = useState('')
  const [errors, setErrors] = useState({});

  
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



  useEffect(() => {
    getState(1, 5, sortOrder, columnName)
  }, [sortOrder, columnName])

  useEffect(() => {
    getAllCountries();
  }, [])

  useEffect(() => {
    if (!editState) {
      // Reset state when modal is opened for adding a new state
      dispatch(setSelectedCountry(''));
      setStateName('');
    } else {
      // Set state values when editing an existing state
      dispatch(setSelectedCountry(editState.countryid));
      setStateName(editState.statename);
    }
  }, [editState]);

  const validateForm = () => {
    const newErrors = {};
  
    // Validate state name
    if (!stateName.match(/^[A-Za-z\s]{1,50}$/)) {
      newErrors.stateName = 'State name should contain only alphabets and spaces (max 50 characters)';
    }
    if (stateName.trim().length === 0) {
      newErrors.stateName = 'State name should not be blank';
    }
  
    // Validate selected country
    if (!selectedCountry) {
      newErrors.selectedCountry = 'Please select a country name';
    }
  
    setErrors(newErrors);
  
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };
  

  const handleDelete = (stateId) => {

    setDeleteConfirmation(stateId)

  };

  const handleChangePage = (event, newPage) => {
    dispatch(setCurrentPage(newPage + 1));
    getState(newPage + 1, pagination.rowsPerPage, sortOrder, columnName);
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    dispatch(setRowsPerPage(newRowsPerPage));
    getState(1, newRowsPerPage, sortOrder, columnName);
  };

  const handleFirstPageButtonClick = () => {
    dispatch(setCurrentPage(1));
    getState(1, pagination.rowsPerPage, sortOrder, columnName);
  }

  const handleBackButtonClick = () => {
    const newPage = Math.max(1, pagination.currentPage - 1);
    dispatch(setCurrentPage(newPage));
    getState(newPage, pagination.rowsPerPage, sortOrder, columnName);
  }

  const handleNextButtonClick = () => {
    const newPage = Math.min(pagination.totalPages, pagination.currentPage + 1);
    dispatch(setCurrentPage(newPage));
    getState(newPage, pagination.rowsPerPage, sortOrder, columnName);
  }

  const handleLastPageButtonClick = () => {
    dispatch(setCurrentPage(pagination.totalPages));
    getState(pagination.totalPages, pagination.rowsPerPage, sortOrder, columnName);
  }

  const handleOpenModal = () => {
    setErrors({})
    dispatch(openModal());
    dispatch(clearEditState())
    dispatch(setSelectedCountry(''));
  };
  // console.log(editState)

  const handleSave = async () => {
    const isValid = validateForm();

    // Check if the form is valid
    if (isValid) {
      if (editState) {
        await updateState(stateName, selectedCountry, editState.stateid);

      }
      else {
        await addState(stateName, selectedCountry, pagination.currentPage, pagination.rowsPerPage);
        // Update the Redux store with the new state data
      }
      dispatch(closeModal());
      // getState(pagination.currentPage, pagination.rowsPerPage,sortOrder,columnName) 
      dispatch(clearEditState());
      setStateName('')
    }

  };

  const handleCancel = () => {
    if (editState) {
      dispatch(closeModal())
    }
    dispatch(clearEditState());
    // dispatch(closeModal());
    setStateName('')
    setErrors({})
  };

  const handleEdit = (state) => {
    // console.log(state)
    // console.log(editState)
    dispatch(setEditState(state));
    dispatch(openModal());
  };

  const handleStateNameChange = (event) => {
    setStateName(event.target.value);
  };

  const handleCountryChange = (event) => {
    dispatch(setSelectedCountry(event.target.value));
  }

  const cancelDelete = () => {
    setDeleteConfirmation(null)
  }

  const confirmDelete =  async() => {
    await deleteState(deleteConfirmation, pagination.currentPage, pagination.rowsPerPage);
    // if (countries.length === 1 && pagination.totalPage > 1) {
      //   const newPage = pagination.currentPage > 1 ? pagination.currentPage - 1 : 1;
      //   setCurrentPage(newPage);
      // }
      // await getState(1, pagination.rowsPerPage,sortOrder,columnName)
      setDeleteConfirmation(null)
      setSearchResults('')
  }


  let searchData;
  const handleSearchChange = (e) => {
    const state = 'state';
    const query = e.target.value;
    setSearchResults(query)


    searchData = {
      search: query,
      limit: pagination.rowsPerPage,
      page: 1
    }

    if (searchData.search === '') {
      getState(1, pagination.rowsPerPage, sortOrder, columnName)
    } else {
      filterData(state, searchData)
    }

  }

  const handleSort = async (columnName) => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setColumnName(columnName);
    await sort('state', pagination.currentPage, pagination.rowsPerPage, columnName, sortOrder)
  }

  const handleClose = () => {
    dispatch(closeModal())
  }

 

  return (
    <div className='w-3/4'>
      <div className="mb-4 ">
        <div className="w-[100%] flex justify-between ">
          <div className="input-group w-[300px]">
            <input
              type="text"
              className="form-control rounded border border-black bg-transparent pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              placeholder="Search"
              aria-label="Search"
              value={searchResults}
              onChange={handleSearchChange}
            />

            <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <SearchIcon className="h-[16px] w-5 text-black" />
            </span>


          </div>
          {/* <button
            type="button"
            className="btn btn-light"
            onClick={() => handleOpenModal()}
          >
            Add State
          </button> */}
          <button
            type="button"
            className="inline-block px-4 py-2 text-sm font-bold leading-5 text-white transition-colors duration-150 bg-blue-500 border border-transparent rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            onClick={() => handleOpenModal()}
          >
            Add State
          </button>

        </div>

        <Dialog open={isOpen} onClose={handleCancel} maxWidth="md" fullWidth={false}>
          <DialogTitle className='flex justify-between'>{editState ? 'Edit State' : 'Add State'}
            <IconButton aria-label="close" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent style={{ overflow: 'auto', maxHeight: '60vh', width: '400px' }}>
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
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 130,
                      width: 250,
                    },
                  },
                },
              }}
            >
              {countries.map((country) => (
                <MenuItem key={country.countryid} value={country.countryid}>
                  {country.countryname}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="State Name"
              value={stateName}
              onChange={handleStateNameChange}
              fullWidth
              margin="normal"
              error={!!errors.stateName}
              helperText={errors.stateName}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              {editState ? 'Cancel' : 'cancel'}
            </Button>
            <Button onClick={handleSave} color="primary">
               { editState ? 'Update' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>

      </div>

      <div style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.5)' }}>

        <TableContainer component={Paper} style={{ maxHeight: pagination.rowsPerPage > 5 || pagination.rowsPerPage === -1 ? '400px' : '406px', overflowY: 'auto' }}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table" >
            <TableHead className="sticky top-0 bg-white">
              <TableRow>
                {/* <TableCell className='text-center'>
                  
                  State ID
                </TableCell> */}
                <TableCell
                  className='cursor-pointer text-center border-r border-gray-200'
                  onClick={() => handleSort('countryname')}
           
                >
                 <span className="mr-1 font-semibold">
                   Country Name  
                   </span> 
                      {sortOrder === 'asc' ? <>&#8593;</> : <>&#8595;</>}
                </TableCell>
                <TableCell
                  className='cursor-pointer text-center border-r border-gray-200'
                  onClick={() => handleSort('statename')}
              
                >
                <span className="mr-1 font-semibold"> State Name</span> 
                      {sortOrder === 'asc' ? <>&#8593;</> : <>&#8595;</>}
                </TableCell>
                <TableCell className='text-center'>
                 <span className='font-semibold'>  Action  </span>
                   </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {states.length > 0 ? (
                states.map((state) => (
                  <TableRow key={state.stateid} className='text-center hover:bg-gray-100'>
                    {/* <TableCell className='text-center'>{state.stateid}</TableCell> */}
                    <TableCell className='text-center border-r border-gray-200'>{state.countryname}</TableCell>
                    <TableCell className='text-center border-r border-gray-200'>{state.statename}</TableCell>
                    <TableCell className='text-center '>
                      <button className="text-slate-700 hover:underline mr-2 font-bold" onClick={() => handleEdit(state)}>
                        <img src="public\asset\icons8-edit-24.png" alt="EditButton" className='h-5' />
                      </button>
                      <button className="text-red-500 hover:underline font-bold" onClick={() => handleDelete(state.stateid)}>
                        <img src="public\asset\icons8-trash-30.png" alt="DeleteButton" className='h-5' />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No data found</TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
          <div className="sticky bottom-0 bg-white z-10">
            {!searchResults && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={Number.isNaN(pagination.finalTotal) ? 0 : Number(pagination.finalTotal)}
                rowsPerPage={pagination.rowsPerPage}
                page={pagination.currentPage - 1} // Adjusted to 0-based index
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={() => (
                  <div style={{ flexShrink: 0, ml: 2.5 }} className="sticky bottom-0 bg-white z-10">
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
            )}
          </div>


        </TableContainer>
      </div>


      {deleteConfirmation && <div className="fixed inset-0 z-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-black opacity-50 "></div>
        <div className="bg-white p-8 rounded-md z-20">
          <p>Are you sure you want to delete this state?</p>
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

export default State;
