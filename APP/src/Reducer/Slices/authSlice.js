import { createSlice } from "@reduxjs/toolkit";


const initialState = ({
    authLoading:false,
    signUpData:null,
    isLoggedIn:localStorage.getItem('isLoggedIn')??false,
});

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setAuthLoading(state,value){
            state.authLoading = value.payload;
        },
        setSignUpData(state,value){
            state.signUpData = value.payload;
        },
        setIsLoggedIn(state){
            state.isLoggedIn = true;
            localStorage.setItem('isLoggedIn','true');
        },
        resetAuth(state){
            state.authLoading = false;
            state.signUpData = null;
            state.isLoggedIn = false;
            localStorage.removeItem('isLoggedIn');
        }
    }
});

export const {setAuthLoading,setIsLoggedIn,setSignUpData,resetAuth} = authSlice.actions;
export default authSlice.reducer;
