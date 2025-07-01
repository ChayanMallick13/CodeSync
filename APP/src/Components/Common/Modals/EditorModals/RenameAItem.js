import React, { useEffect, useState } from 'react'
import { renameItem } from '../../../../Services/Operations/Room_Apis';
import { useSelector } from 'react-redux';

const RenameAItem = ({type,name,setShowRenameModal,roomId,itemId,socket}) => {
  const [newName,setNewName] = useState(name);
  const [disableBtn,setDisableBtn] = useState(false);
  const {user} = useSelector(state => state.profile);


    async function handleRename(){
        let body = {
            roomId,newName,
        };
        if(type==='file'){
            body.fileId = itemId;
        }
        else if(type==='folder'){
            body.folderId = itemId;
        }
        else{
            body.mediaId = itemId;
        }
        const res = await renameItem(body,setShowRenameModal,setDisableBtn,type);
        if(res){
            const data = {
                itemId,type,roomId,userName:`${user?.firstName} ${user?.lastName}`,operation:'rename',oldName:name,isnew:false,
            }
            socket?.emit('fileChnaged',data);
            // console.log(data);
        }
    }



  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
          backdrop-blur-md flex justify-center items-center
          '>
        <div 
        className='flex flex-col bg-slate-900 p-3 min-w-[400px] rounded-xl
        border-slate-400 border-[1px] gap-y-4
        '
        >
            <h3
            className='text-3xl font-extrabold text-center'
            >Rename a {type}</h3>
            <div>
                <label className='flex flex-col gap-y-2'>
                    <p
                    className='text-sm font-extrabold'
                    >Enter a New Name for {name} <sup className='text-red-600'>*</sup></p>
                    <input
                        type='text'
                        value={newName}
                        onChange={(e)=>{setNewName(e.target.value)}}
                        placeholder='Enter a New Name for the Item'
                        className='bg-slate-600 p-2 rounded-xl outline-none focus:border-slate-100
                        focus:border-[1px]
                        '
                    />
                </label>
            </div>
            <div className='w-full flex items-center justify-around mt-4 mb-4'>
                <button onClick={()=>{setShowRenameModal(false)}}
                className='bg-slate-500 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-slate-700
                '
                >
                    Cancel
                </button>
                <button
                className='bg-yellow-400 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-yellow-200 text-black font-extrabold
                '
                disabled={disableBtn}
                onClick={()=>{handleRename()}}
                >
                    Rename
                </button>
            </div>
        </div>
    </div>
  )
}

export default RenameAItem;