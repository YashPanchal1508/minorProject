import { createSlice } from "@reduxjs/toolkit";

export const stateSlice = createSlice({
    name: 'state',
    initialState: {
        data: [],
        pagination: {
            finalTotal: 0,
            totalPages: 1,
            currentPage: 1,
            rowsPerPage: 5
        },
        modal: {
            isOpen: false,
            mode: 'add'
          }
    },
    reducers: {
        setData: (state, action) => {
            const { data, pagination } = action.payload;
            state.data = data;
            state.pagination.finalTotal = pagination.finalTotal; // Total rows in the database
            state.pagination.totalPages = pagination.totalPages; // Total pages based on limit
        },
        setCurrentPage: (state, action) => {
            state.pagination.currentPage = action.payload;
        },
        setRowsPerPage: (state, action) => {
            state.pagination.rowsPerPage = action.payload;
        },
        openModal: (state, action) => {
            state.modal.isOpen = true;
            state.modal.mode = action.payload.mode;
          },
          closeModal: (state) => {
            state.modal.isOpen = false;
            state.modal.mode = 'add';
          }
       
    }
});



export const { setData, setCurrentPage, setRowsPerPage, openModal,closeModal } = stateSlice.actions;

export default stateSlice.reducer;
