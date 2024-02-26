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
            console.log(action.payload)
            const { fResult, pagination } = action.payload
            state.data = fResult;
            state.pagination.currentPage = pagination.currentPage;
            state.pagination.totalPages = pagination.totalPages;
            state.pagination.finalTotal = pagination.totalCount;
        },
        filterCity: (state,action) => {
            state.data = action.payload;
            state.pagination.finalTotal = action.payload.limit;
            state.pagination.currentPage = action.payload.page
        },
        sortData :(state, action) => {
            const {totalPages,totalCount, currentPage} = action.payload.pagination
            state.data = action.payload.data;
            state.pagination.currentPage = currentPage;
            state.pagination.totalPages = totalPages;
            state.pagination.finalTotal = totalCount;
        },
        updateCityData: (state,action) => {
            const updateCity = action.payload
            const cityId = updateCity.cityid; // Id of the updated state

            // Find the index of the state to be updated
            const cityIndex = state.data.findIndex(city => city.cityid === cityId);

            if (cityIndex !== -1) {
                // Update the state data at the found index
                state.data[cityIndex] = updateCity;
            }
        } ,
        deleteCityData: (state,action) => {
            const {result, pagination} = action.payload
            state.data = result;
            state.pagination.currentPage = pagination.currentPage;
            state.pagination.totalPages = pagination.totalPages;
            state.pagination.finalTotal = pagination.totalCount;
        }
          
    },
})


export const {setData,setCurrentPage,setRowsPerPage,openModal,closeModal,setCountries,setSelectedCountry,setEditState,clearEditState,setStates,setSelectedState,addCityData,filterCity,sortData,updateCityData,deleteCityData} = citySlice.actions

export default citySlice.reducer;