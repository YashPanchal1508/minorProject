import { createSlice } from "@reduxjs/toolkit";

export const citySlice = createSlice({
    name: 'city',
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
        stateData: [],
        editState: null,
        selectedCountry: '',
        selectedState: '',
    },
    reducers: {
        setData : (state, action) => {
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
            state.selectedState = ''
        },
        setCountries: (state, action) => {
            state.countries = action.payload;
        },
        setSelectedCountry: (state, action) => {
            // console.log(action.payload)
            state.selectedCountry = action.payload;
        },
        setSelectedState : (state,action) => {
            // console.log(action.payload)
            state.selectedState= action.payload;
        },
        setEditState: (state, action) => {
            // console.log(action.payload)
            state.editState = action.payload
        },
        clearEditState: (state) => {
            state.editState = null
        },
        setStates: (state, action) => {
            // console.log(action.payload)
            state.stateData = action.payload;
        },
        addCityData : (state,action) => {
                state.data.push(action.payload)
        }
    }
})


export const {setData,setCurrentPage,setRowsPerPage,openModal,closeModal,setCountries,setSelectedCountry,setEditState,clearEditState,setStates,setSelectedState,addCityData} = citySlice.actions

export default citySlice.reducer;