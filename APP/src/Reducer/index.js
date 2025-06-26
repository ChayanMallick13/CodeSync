import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './Slices/authSlice';
import profileSlice from './Slices/profileSlice';
import preferenceSlice from './Slices/preferenceSlice';
import EditorSlice from './Slices/EditorSlice';

const rootReducer = combineReducers(
    {
        auth:authReducer,
        profile:profileSlice,
        preference:preferenceSlice,
        editor:EditorSlice,
    }
);


export default rootReducer;