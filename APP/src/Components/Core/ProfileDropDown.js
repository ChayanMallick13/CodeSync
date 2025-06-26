import React, { useState } from 'react'
import { FaPen, FaPlus } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { logOut } from '../../Services/Operations/Auth_Apis'
import toast from 'react-hot-toast'

const ProfileDropDown = ({setOpenReviewModal,setJoinRoomModal}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  return (
    <div className='absolute right-0 -bottom-[216px] z-10 bg-slate-800 border-2 rounded-lg
    min-w-[130px]
    '
    >
        <div className='absolute bg-slate-800 h-[20px] w-[20px] border-l-2 border-t-2 right-[1px] -top-[10px]
        rotate-45
        '/>
        <div className='flex flex-col'>
          <Link to={'/'}><p className='border-[1px] border-slate-600/90 p-2'>Home</p></Link>
          <Link to={'/dashboard/Profile'}><p className='border-[1px] border-slate-600/90 p-2'>My Profile</p></Link>
          <button className="flex items-center border-[1px] border-slate-600/90 p-2"
          onClick={()=>{setJoinRoomModal(true)}}
          >
              <FaPlus />
              <span>Join Room</span>
          </button>
          <button className="flex items-center border-[1px] border-slate-600/90 p-2 gap-x-1"
          onClick={()=>{
            setOpenReviewModal(true);
          }}
          >
            <FaPen/> Add a Review
          </button>
          <button 
          className='border-[1px] border-slate-600/90 p-2 text-left'
          onClick={()=>{dispatch(logOut(navigate))}}
          >
            <p>LogOut</p>
          </button>
        </div>
    </div>
  )
}

export default ProfileDropDown