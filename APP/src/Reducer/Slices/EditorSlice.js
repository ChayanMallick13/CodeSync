import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    activeObjects:[],
    activeObject:null,
    undoStack:[],
    redoStack:[],
    chnagedFiles:[],
    isFileSynced:false,
};

const editorSlice = createSlice(
    {
        name:'editor',
        initialState,
        reducers:{
            addActiveObject(state,action){
                let added = false;
                let newState = state.activeObjects.map(ele => {
                    if(ele._id!==action.payload._id){
                        return ele;
                    }
                    else{
                        added = true;
                        return action.payload;
                    }
                });
                if(!added){
                    newState.push(action.payload);
                }
                // console.log('in slice new array ',newState);
                state.activeObjects= newState;
            },
            removeActiveObject(state,action){

                state.activeObjects = state.activeObjects.filter(ele => ele._id!==action.payload);
                
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
            },
            setActiveObject(state,action){
                // console.log('settingActiveObject',action.payload);
                state.activeObject = action.payload;
            },
            unsetActiveObject(state){
                state.activeObject = null;
            },
            resetActiveObjectsSet(state){
                state.activeObject= null;
                state.activeObjects = [];
            },
            trackFileChange(state,action){
                const {item,content,roomId} = action.payload;
                const val = state.chnagedFiles.filter(ele => ele.fileId!==item._id);
                if(item.content!==content){
                    val.push({
                        fileId:item._id,
                        roomId,
                        content,
                    });
                }
                // console.log(val);
                state.chnagedFiles = val;
            },
            setIsFileSynced(state,action){
                state.isFileSynced = action.payload;
            },
            resetRoom(state){
                state.activeObject = null;
                state.activeObjects = [];
                state.chnagedFiles = [];
                state.isFileSynced = true;
            }
        }
    }
)

export const {addActiveObject,removeActiveObject,setActiveObject,unsetActiveObject
    ,resetActiveObjectsSet,trackFileChange,setIsFileSynced,resetRoom
} = editorSlice.actions;
export default editorSlice.reducer;