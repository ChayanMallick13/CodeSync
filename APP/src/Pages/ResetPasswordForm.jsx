import React, { useState } from 'react'
import { FaArrowLeft, FaCode, FaLock } from 'react-icons/fa'
import { FaShield } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

const ResetPasswordForm = ({email,setEmail,sendEmail,setMailSent}) => {
    const [disableSendMail,setDisableSentMail] = useState(false);
    async function handleSendMail(){
        setDisableSentMail(true);
        try {
            await sendEmail(email,setMailSent);
        } catch (error) {
            
        }
        setDisableSentMail(false);
    }
    

  return (
    <div className='text-white flex flex-col mt-40 justify-center items-center'>
        <div className='flex items-center gap-x-3 font-extrabold text-3xl'>
            <FaCode/>
            CodeSync
        </div>
        <div className='border-2 border-slate-200/30 bg-slate-900 p-4 md:max-w-[500px] max-w-[370px]
        rounded-lg mt-5
        '>
            <div className='flex items-center justify-center bg-orange-500 p-5 w-max place-self-center
            rounded-full text-xl mb-6
            '>
                <FaLock/>
            </div>
            <h3 className='text-2xl font-bold text-center'>Reset Your Password</h3>
            <p className='text-sm text-slate-400 text-center mb-6'>Enter your Email to Send Reset Mail</p>
            <p className='text-sm font-bold'>Enter Email</p>
            <input
                type='email'
                placeholder='Enter Your Email'
                className='w-full bg-slate-700 text-white placeholder:text-gray-200
                p-3 rounded-xl border-b-2 outline-none
                '
                value={email}
                onChange={(event)=>{
                    setEmail(event.target.value);
                }}
            />
            <button className='w-full bg-yellow-300 text-black font-bold mt-7 p-3 rounded-full
            transition-all duration-200 hover:bg-yellow-400'
            onClick={()=>{handleSendMail()}}
            disabled={disableSendMail}
            >
                Send Reset password Mail
            </button>
            <Link
            className='bg-slate-700 flex items-center gap-x-2 justify-center mt-4 p-3 rounded-full
            transition-all duration-200 hover:bg-slate-600
            '
            to={'/auth/login'}
            >
                <FaArrowLeft/>
                Back to Login
            </Link>
        </div>
        <p className='text-sm items-center flex text-slate-400 gap-x-3 mt-6'>
            <FaShield/> Your Password is encrypted and secure
        </p>
    </div>
  )
}

export default ResetPasswordForm