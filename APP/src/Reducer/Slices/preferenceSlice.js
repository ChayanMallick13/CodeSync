import { createSlice } from "@reduxjs/toolkit";




const initialState = ({
    fontSize:localStorage.getItem('fontSize')||12,
    theme:localStorage.getItem('theme')||'dark',
    defaultLanguage:localStorage.getItem('language')||'javascript',
});



const preferenceSlice = createSlice({
    name:'preference',
    initialState,
    reducers:{
        setfontSize(state,action){
            localStorage.setItem('fontSize',action.payload);
            state.fontSize = action.payload;
        },
        setTheme(state,action){
            localStorage.setItem('theme',action.payload);
            state.theme = action.payload;
        },
        setDefaultLanguage(state,action){
            localStorage.setItem('language',action.payload);
            state.defaultLanguage = action.payload;
        },
        resetPreferenceState(state){
            localStorage.removeItem('fontSize');
            localStorage.removeItem('theme');
            localStorage.removeItem('language');
            state.fontSize = 12;
            state.theme = 'dark';
            state.defaultLanguage = 'javascript';
        }
    }
});

export const {setDefaultLanguage,setTheme,setfontSize,resetPreferenceState} = preferenceSlice.actions;
export default preferenceSlice.reducer;