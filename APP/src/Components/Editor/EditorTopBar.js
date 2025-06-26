import React from 'react'
import { FaCode, FaSave, FaShare } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const EditorTopBar = ({name,setShowRoomDetails,handleLeaveRoom}) => {
    const navigate = useNavigate();
    const {isFileChanged} = useSelector(state => state.editor);
  return (
    <div className='h-[70px] flex justify-between mx-auto w-10/12 p-3 items-center'>
        <div className='flex items-center gap-x-2 text-xl'>
            <div className='text-3xl bg-slate-600 p-2 rounded-xl'><FaCode/></div>
            <p className='font-extrabold text-xl'>{name}</p>
        </div>
        <div className='flex gap-x-2 items-center'>
            <button className='flex items-center text-lg gap-x-1 bg-slate-700 py-3 px-5  rounded-xl
            hover:bg-slate-600 duration-200 transition-all font-extrabold relative
            '>
                <FaSave className='text-2xl'/>
                <p>Save</p>
                {isFileChanged&&<div className='h-[10px] w-[10px] bg-red-500 rounded-full absolute right-3 top-2'/>}
            </button>
            <button className='flex items-center text-lg gap-x-1 bg-slate-700 py-3 px-5  rounded-xl
            hover:bg-slate-600 duration-200 transition-all font-extrabold
            '
            onClick={()=>{setShowRoomDetails(true)}}
            >
                <FaShare className='text-2xl'/>
                <p>Share</p>
            </button>
            <button className='flex items-center text-lg gap-x-1 bg-slate-700 py-3 px-5  rounded-xl
            hover:bg-slate-600 duration-200 transition-all font-extrabold
            '
            onClick={()=>{navigate('/dashboard/stats')}}
            >
                <RxExit className='text-2xl'/>
                <p>Leave Room</p>
            </button>
        </div>
    </div>
  )
}

export default EditorTopBar