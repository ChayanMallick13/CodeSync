import React, { useEffect } from 'react'
import SideBar from '../Components/Core/Dashboard/SideBar'
import { Outlet, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getProfileDetails } from '../Services/Operations/Profile_Apis';
import Loader from '../Pages/Loader.js';

const Dashboard = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const {user} = useSelector(state => state.profile);

    useEffect(
        () => {
            dispatch(getProfileDetails());
            // console.log(user,location.pathname);
        },[location.pathname]
    )
    // if(!user){
    //     return <Loader/>
    // }
  return (
    <div className='flex bg-black relative'>
        <SideBar/>
        <div className='w-full p-3'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Dashboard