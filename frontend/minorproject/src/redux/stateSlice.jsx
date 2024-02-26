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
        searchQuery: ''

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
            state.editState = ''
        },
        setCountries: (state, action) => {
            state.countries = action.payload;
        },
        setEditState: (state, action) => {
            // console.log(action.payload)
            state.editState = action.payload
        },
        clearEditState: (state) => {
            state.editState = null
        },
        setSelectedCountry: (state, action) => {
            // console.log(action.payload)
            state.selectedCountry = action.payload;
        },
        addStateData: (state, action) => {
            const { fResult, pagination } = action.payload
            // console.log(action.payload)
            state.data = fResult;
            state.pagination.currentPage = pagination.currentPage;
            state.pagination.totalPages = pagination.totalPages;
            state.pagination.finalTotal = pagination.totalCount;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchQuery: (state) => {
            state.searchQuery = ''
        },
        filterState : (state, action) =>{
            state.data = action.payload;
            state.pagination.finalTotal = action.payload.limit;
            state.pagination.currentPage = action.payload.page
        },
        sortData: (state, action) => {
            // Update the state with the sorted data and pagination info
            const {totalPages,totalCount, currentPage} = action.payload.pagination
            // console.log(totalCount)
            state.data = action.payload.data;
            state.pagination.currentPage = currentPage;
            state.pagination.totalPages = totalPages;
            state.pagination.finalTotal = totalCount;
        },
        updateStateData: (state , action) => {
            // console.log(action.payload)
            const updatedState = action.payload
            const stateId = updatedState.stateid; // Id of the updated state

            // Find the index of the state to be updated
            const stateIndex = state.data.findIndex(state => state.stateid === stateId);

            if (stateIndex !== -1) {
                // Update the state data at the found index
                state.data[stateIndex] = updatedState;
            }
        },
        deleteStateData: (state,action) => {
            const {result, pagination} = action.payload
            state.data = result;
            state.pagination.currentPage = pagination.currentPage;
            state.pagination.totalPages = pagination.totalPages;
            state.pagination.finalTotal = pagination.totalCount;

 }
    }
});

export const { setData, setCurrentPage, setRowsPerPage, openModal, closeModal, setCountries, setEditState, clearEditState, setSelectedCountry, addStateData, setSearchQuery, clearSearchQuery,filterState, sortData,updateStateData,deleteStateData } = stateSlice.actions;

export default stateSlice.reducer;

