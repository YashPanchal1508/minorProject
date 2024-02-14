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
            isOpen: false,
            countries: [],
            editState: null,
            selectedCountry: '',
  
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
        openModal: (state) => {
            state.isOpen = true;
        },
        closeModal: (state) => {
            state.isOpen = false;
        },
        setCountries: (state,action) =>{
                state.countries = action.payload;
        },
        setEditState: (state,action) => {
            state.editState = action.payload
        },
        clearEditState: (state) => {
            state.editState = null
        },
        setSelectedCountry: (state, action) => {
            state.selectedCountry = action.payload;
          },
          addStateData: (state, action) => {
            state.data.push(action.payload);
          },
          deleteStateData: (state, action) => {
            state.data = state.data.filter(state => state.stateid !== action.payload.stateid);
          }
      
    }
});

export const { setData, setCurrentPage, setRowsPerPage, openModal, closeModal, setCountries, setEditState, clearEditState,setSelectedCountry,addStateData, deleteStateData  } = stateSlice.actions;

export default stateSlice.reducer;

