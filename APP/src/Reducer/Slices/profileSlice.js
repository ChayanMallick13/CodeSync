import { createSlice } from "@reduxjs/toolkit"


const initialState = ({
    user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
})

const profileSlice = createSlice({
    name:'profile',
    initialState,
    reducers:{
        setUser(state,value){
            localStorage.setItem('user',JSON.stringify(value.payload));
            state.user = value.payload;
        },
        resetProfile(state){
            state.user = null;
            localStorage.removeItem('user');
        }
    }
})

export const {setUser,resetProfile} = profileSlice.actions;
export default profileSlice.reducer;