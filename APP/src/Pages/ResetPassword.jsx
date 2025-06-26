import React, { useState } from 'react'
import { FaArrowLeft, FaCode, FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { FaShield } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PasswordStrengthBar from 'react-password-strength-bar';
import { resetPasswordVerify } from '../Services/Operations/Auth_Apis';

const ResetPassword = () => {
    const [password,setPassword] = useState('');
    const [confirmPassword,setconfirmPassword] = useState('');
    const [showpass,setshowpass] = useState(false);
    const [showconfirmPass,setConfirmPass] = useState(false);
    const [disableBtn,setDisableBtn] = useState(false);
    const {token} = useParams();
    const navigate = useNavigate();

    function handlePasswordChange() {
        const body = {
            password,
            confirmPassword,
            token,
        };
        resetPasswordVerify(body,navigate,setDisableBtn);
    }

  return (
    <div className='text-white flex flex-col mt-40 justify-center items-center'>
        <div className='flex items-center gap-x-3 font-extrabold text-3xl'>
            <FaCode/>
            CodeSync
        </div>
        <div className='border-2 border-slate-200/30 bg-slate-900 p-4 md:w-[500px] w-[370px]
        rounded-lg mt-5
        '>
            <div className='flex items-center justify-center bg-yellow-500 p-5 w-max place-self-center
            rounded-full text-xl mb-6
            '>
                <FaLock/>
            </div>
            <h3 className='text-2xl font-bold text-center'>Reset Your Password</h3>
            <p className='text-sm text-slate-400 text-center mb-6'>Enter your New Password to secure your 
            account</p>
            <div className='relative mb-6'>
                <p className='text-sm font-bold'>Enter Password</p>
                <input
                    type={(showpass)?('text'):('password')}
                    placeholder='Enter Your Password'
                    className='w-full bg-slate-700 text-white placeholder:text-gray-200
                    p-3 rounded-xl border-b-2 outline-none mb-3
                    '
                    value={password}
                    onChange={(event)=>{
                        setPassword(event.target.value);
                    }}
                />
                <PasswordStrengthBar
                    password={password}
                />
                <button
                className='absolute right-3 top-[30%] text-xl'
                onClick={()=>{setshowpass(prev=>!prev)}}
                >
                    {(showpass)?(<FaEyeSlash/>):(<FaEye/>)}
                </button>
            </div>
            <div className='relative'>
                <p className='text-sm font-bold'>Confirm Passoword</p>
                <input
                    type={(showconfirmPass)?('text'):('password')}
                    placeholder='Confirm Your Password'
                    className='w-full bg-slate-700 text-white placeholder:text-gray-200
                    p-3 rounded-xl border-b-2 outline-none
                    '
                    value={confirmPassword}
                    onChange={(event)=>{
                        setconfirmPassword(event.target.value);
                    }}
                />
                <button
                className='absolute right-3 top-[50%] text-xl'
                onClick={()=>{setConfirmPass(prev=>!prev)}}
                >
                    {(showconfirmPass)?(<FaEyeSlash/>):(<FaEye/>)}
                </button>
            </div>
            <button className='w-full bg-yellow-300 text-black font-bold mt-7 p-3 rounded-full
            transition-all duration-200 hover:bg-yellow-400'
            disabled={disableBtn}
            onClick={handlePasswordChange}
            >
                Change Password
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

export default ResetPassword