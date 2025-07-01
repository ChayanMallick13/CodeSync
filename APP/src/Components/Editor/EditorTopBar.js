import React from 'react'
import { FaCode, FaSave, FaShare } from 'react-icons/fa';
import { RxExit } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetActiveObjectsSet } from '../../Reducer/Slices/EditorSlice';

const EditorTopBar = ({name,setShowRoomDetails,handleLeaveRoom}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {isFileSynced,activeObject} = useSelector(state => state.editor);
  return (
    <div className='h-[70px] flex justify-between mx-auto w-10/12 p-3 items-center'>
        <div className='flex items-center gap-x-2 text-xl'>
            <div className='text-3xl bg-slate-600 p-2 rounded-xl'><FaCode/></div>
            <p className='font-extrabold text-xl'>{name}</p>
        </div>
        <div className='flex gap-x-2 items-center'>
            {activeObject&&
                <div className='flex items-center text-lg gap-x-1 bg-slate-700 py-3 px-5  rounded-xl
            hover:bg-slate-600 duration-200 transition-all font-extrabold
            '>
                    <div className={`${isFileSynced?('bg-green-500'):('bg-red-500')}
                    h-[15px] w-[15px] rounded-full
                    `}/>
                    <p>{isFileSynced?('Synced'):('Not Synced')}</p>
                </div>
            }
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
            onClick={()=>{ dispatch(resetActiveObjectsSet());navigate('/dashboard/stats')}}
            >
                <RxExit className='text-2xl'/>
                <p>Leave Room</p>
            </button>
        </div>
    </div>
  )
}

export default EditorTopBar