import { configureStore } from '@reduxjs/toolkit';
import stateReducer from './stateSlice';
import cityReducer from './CitySlice'

export const store = configureStore({
    reducer: {
        state: stateReducer,
        city: cityReducer
    }
});
