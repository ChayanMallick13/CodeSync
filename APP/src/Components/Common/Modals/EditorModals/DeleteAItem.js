import React, { useState } from 'react'
import { deleteAItem } from '../../../../Services/Operations/Room_Apis';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

const DeleteAItem = ({type,name,setShowDeleteModal,socket,itemId,prevFolderId}) => {
  const [confirmDelete,setconfirmDelete] = useState(false);
  const [disableBtn,setDisableBtn] = useState(false);
  const {id} = useParams();
  const {user} = useSelector(state => state.profile);

  async function handleDelete(){
    if(!confirmDelete){
        toast.error('Click The CheckBox First');
        return;
    }
    let body = {
        prevFolderId,roomId:id,softDelete:true,softDeleteVal:true,
    } ;
    if(type==='file'){
        body.fileId = itemId;
    }
    else if(type==='folder'){
        body.folderId = itemId;
    }
    else{
        body.mediaId = itemId;
    }
    const success = await deleteAItem(body,setShowDeleteModal,setDisableBtn,type);
    if(!success){
        console.log('Problem in Delete');
        return;
    }
    const data = {
        itemId,type,roomId:id,userName:`${user?.firstName} ${user?.lastName}`,operation:'delete',oldName:name,isnew:false,
    }
    socket?.emit('fileChnaged',data);
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
            className='text-3xl font-extrabold text-center text-red-600'
            >Delete a {type}</h3>
            <div>
                <p
                className='text-slate-400 text-sm'
                >Once the {type} is Deleted It Can Be Recoverd till any user is connected to the Room</p>
                <label className='flex flex-row gap-x-2 mt-4 cursor-pointer'>
                    <p
                    className='text-sm font-extrabold'
                    >I Confirm Delete for {name} <sup className='text-red-600'>*</sup></p>
                    <input
                        type='checkbox'
                        checked={confirmDelete}
                        onChange={(e)=>{setconfirmDelete(e.target.checked)}}
                        placeholder='Enter a New Name for the Item'
                        className='bg-slate-600 p-2 rounded-xl outline-none focus:border-slate-100
                        focus:border-[1px] h-[20px] w-[20px]
                        '
                    />
                </label>
            </div>
            <div className='w-full flex items-center justify-around mt-4 mb-4'>
                <button onClick={()=>{setShowDeleteModal(false)}}
                className='bg-slate-500 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-slate-700
                '
                >
                    Cancel
                </button>
                <button
                className='bg-yellow-400 py-3 px-10 rounded-xl transition-all duration-200
                hover:bg-yellow-200 text-red-500 font-extrabold
                '
                disabled={disableBtn}
                onClick={handleDelete}
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
  )
}

export default DeleteAItem;