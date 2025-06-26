import React from 'react'
import logo from '../../../Assets/Logo/LOGO_CODE_SYNC.png'

const WelComePage = () => {
  return (
    <div className='h-full flex flex-col justify-center items-center opacity-50'>
        <img alt='logo' src={logo}/>
        <p className='text-4xl font-extrabold'>Welcome To CodeSync Start Collaborating</p>
    </div>
  )
}

export default WelComePage