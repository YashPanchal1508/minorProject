/* eslint-disable react-hooks/exhaustive-deps */
import { useSelector, useDispatch } from 'react-redux';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import TablePagination from '@mui/material/TablePagination';
import { setCurrentPage, setRowsPerPage,openModal,closeModal, } from '../../../redux/stateSlice';
import { FirstPage, KeyboardArrowLeft, KeyboardArrowRight, LastPage } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useEffect } from "react";
import {useStateContext} from '../../../Context/State.context'
import Modal from '../utils/Modal';


const State = () => {
    const dispatch = useDispatch();
    const { getState } = useStateContext()
    const { data: states, pagination } = useSelector((state) => state.state);
    const { isOpen, mode, selectedCountry } = useSelector((state) => state.state.modal);

    useEffect(() => {
          getState(1,5)
    }, [])
    
    // console.log(pagination.finalTotal)

    const handleChangePage = (event, newPage) => {
        dispatch(setCurrentPage(newPage + 1));
        getState(newPage + 1, pagination.rowsPerPage);
    };

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        dispatch(setRowsPerPage(newRowsPerPage));
        getState(1, newRowsPerPage);
    };

    const handleFirstPageButtonClick = () => {
        dispatch(setCurrentPage(1));
        getState(1, pagination.rowsPerPage);
    }

    const handleBackButtonClick = () => {
        const newPage = Math.max(1, pagination.currentPage - 1);
        dispatch(setCurrentPage(newPage));
        getState(newPage, pagination.rowsPerPage);
    }

    const handleNextButtonClick = () => {
        const newPage = Math.min(pagination.totalPages, pagination.currentPage + 1);
        dispatch(setCurrentPage(newPage));
        getState(newPage, pagination.rowsPerPage);
    }

    const handleLastPageButtonClick = () => {
        dispatch(setCurrentPage(pagination.totalPages));
        getState(pagination.totalPages, pagination.rowsPerPage);
    }

    const handleOpenModal = (mode) => {
      dispatch(openModal({ mode }));
    };
  
    const handleCloseModal = () => {
      dispatch(closeModal());
    };
  
    const handleSave = () => {}
  
    const handleSearchChange =() =>{}

    return (
        <div>
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

          <Modal isOpen={isOpen} onClose={handleCloseModal} Mode={mode} onSave={handleSave} selectedCountry={selectedCountry} />


        </div>
            <TableContainer component={Paper}  style={{ maxHeight: pagination.rowsPerPage > 5 || pagination.rowsPerPage === -1 ? '400px' : 'none', overflowY: 'auto' }}>
                <Table  sx={{ minWidth: 500 }}>
                    <TableHead className="sticky top-0 bg-white">
                        <TableRow>
                            <TableCell>Country ID</TableCell>
                            <TableCell>State ID</TableCell>
                            <TableCell>State Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {states.map((state) => (
                            <TableRow key={state.stateid}>
                                <TableCell>{state.countryid}</TableCell>
                                <TableCell>{state.stateid}</TableCell>
                                <TableCell>{state.statename}</TableCell>
                                <TableCell>
                                    <button className="text-blue-600 hover:underline mr-2 font-bold" onClick={() => handleOpenModal('edit', state)}>Edit</button>
                                    <button className="text-red-500 hover:underline font-bold" onClick={() => handleDelete(state.stateid)}>Delete</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <div className="sticky bottom-0 bg-white z-10">
                 <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={Number(pagination.finalTotal)}
                    rowsPerPage={pagination.rowsPerPage}
                    page={pagination.currentPage - 1} // Adjusted to 0-based index
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
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
                </div>

            </TableContainer>
        </div>
    );
};

export default State;
