import { createSlice } from "@reduxjs/toolkit";




const initialState = ({
    fontSize:localStorage.getItem('fontSize')||12,
    theme:localStorage.getItem('theme')||'dark',
    defaultLanguage:localStorage.getItem('language')||'javascript',
    miniMap:localStorage.getItem('miniMap')|| true,
    fontFamily:localStorage.getItem('fontFamily')||'Fira Code',
    ligature:localStorage.getItem('ligature')|| false,
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
        setItem(state,action){
            const {label,value} = action.payload;
            localStorage.setItem(label,value);
            state[label] = value;
        },
        resetPreferenceState(state){
            localStorage.removeItem('fontSize');
            localStorage.removeItem('theme');
            localStorage.removeItem('language');
            localStorage.removeItem('miniMap');
            localStorage.removeItem('fontFamily');
            localStorage.removeItem('ligature');
            state.fontSize = 12;
            state.theme = 'dark';
            state.defaultLanguage = 'javascript';
            state.fontFamily='Fira Code';
            state.miniMap=true;
            state.ligature = false;
        }
    }
});

export const {setDefaultLanguage,setTheme,setfontSize,resetPreferenceState
    ,setItem
} = preferenceSlice.actions;
export default preferenceSlice.reducer;