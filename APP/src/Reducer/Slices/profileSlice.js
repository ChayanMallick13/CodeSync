import { createSlice } from "@reduxjs/toolkit"


const initialState = ({
    user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):null,
    userRooms:[],
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
        },
        setUserRooms(state,action){
            state.userRooms = action.payload;
        },
        deleteFromRooms(state,action){
            state.userRooms = state.userRooms.filter(ele => ele._id!==action.payload);
        }
    }
})

export const {setUser,resetProfile,setUserRooms,deleteFromRooms} = profileSlice.actions;
export default profileSlice.reducer;