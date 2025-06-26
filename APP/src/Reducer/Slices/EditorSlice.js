import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    activeObjects:[],
    activeObject:null,
    undoStack:[],
    redoStack:[],
    isFileChanged:false,
};

const editorSlice = createSlice(
    {
        name:'editor',
        initialState,
        reducers:{
            addActiveObject(state,action){
                const alreadyPresent = state.activeObjects.filter(ele => ele._id===action.payload._id);
                // console.log(alreadyPresent);
                if(alreadyPresent.length){
                    return;
                }
                state.activeObjects.push(action.payload);
            },
            removeActiveObject(state,action){

                state.activeObjects = state.activeObjects.filter(ele => ele._id!==action.payload);
                
                // console.log(JSON.parse(JSON.stringify(state.activeObject)),action.payload);
                // console.log(state.activeObjects.length);
                if(state.activeObject?._id===action.payload){
                    if(state.activeObjects.length>0){
                        // console.log('pp');
                        state.activeObject = state.activeObjects[0];
                    }
                    else{
                        // console.log('second');
                        state.activeObject = null;
                    }
                }
            //    console.log(JSON.parse(JSON.stringify(state.activeObject)),action.payload);
            },
            setActiveObject(state,action){
                state.activeObject = action.payload;
            },
            unsetActiveObject(state){
                state.activeObject = null;
            },
            setFileChanged(state,action){
                state.isFileChanged = action.payload;
            }
        }
    }
)

export const {addActiveObject,removeActiveObject,setActiveObject,unsetActiveObject,setFileChanged} = editorSlice.actions;
export default editorSlice.reducer;