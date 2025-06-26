import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaCheck, FaClock, FaCode, FaLock } from 'react-icons/fa';
import { GoDotFill } from "react-icons/go";
import ResetPasswordForm from './ResetPasswordForm';
import { forgotPassword } from '../Services/Operations/Auth_Apis';
import { Link } from 'react-router-dom';

const ResetMailSentPage = () => {
    const [sentMail,setsentMail] = useState(false);
    const [email,setEmail] = useState('');

    const [isCounting, setIsCounting] = useState(false);
    const [count, setCount] = useState(30);

    async function sendEmail(email,setMailSent) {
        await forgotPassword(email,setMailSent);
    }
    async function handleResendMail() {
        try {
            await sendEmail(email,setsentMail);
            setIsCounting(true);
        } catch (error) {
            
        }
    }

    useEffect(() => {
    if (!isCounting) {
      return;
    }

    const id = setInterval(() => {
      setCount((prev) => {
        if (prev === 1) {
          clearInterval(id);
          setIsCounting(false);
          setCount(30);
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(id);
    };
  }, [isCounting]);

    if(!sentMail){
        return <ResetPasswordForm
            email={email}
            setEmail={setEmail}
            sendEmail={sendEmail}
            setMailSent={setsentMail}
        />
    }
  return (
    <div className='text-white'>
        <div className='flex justify-center mt-40 flex-col items-center gap-y-6'>
            <div className='bg-green-500 p-4 rounded-full flex justify-center items-center
            text-4xl
            '>
                <FaCheck />
            </div>
            <div className='border-[2px] border-slate-400/90 p-4 md:max-w-[500px] max-w-[370px]
            rounded-xl flex flex-col gap-y-3
            '>
                <h3
                className='text-xl font-bold text-center'
                >Reset Email Sent Successfully</h3>
                <p className='text-sm text-center text-slate-500'>We've Sent a password reset link to your registred email.Please check your inbox.</p>
                <Link
                className='bg-slate-500 flex items-center justify-center gap-x-3 p-3 mt-3 rounded-full transition-all
                duration-200 hover:bg-slate-600'
                to={'/auth/login'}
                >
                    <FaArrowLeft/>
                    Back to Login
                </Link>
                <button
                className='text-sm text-slate-400 mt-4 mb-2 hover:text-slate-300
                transition-all duration-200'
                disabled={isCounting}
                onClick={()=> {
                    handleResendMail();
                }}
                >
                    Didn't get the email? Resend
                </button>
                {
                    isCounting&&<p
                    className='text-center text-sm text-slate-300'
                    >Resend Again in {count}s</p>
                }
                <hr/>
                <p
                className='text-sm text-slate-400 flex items-center justify-center gap-x-2
                mt-2'
                ><FaClock/> The reset link will expire in 15 minutes</p>
                <p
                className='text-sm text-slate-400 flex items-center justify-center gap-x-2
                mt-2'
                >Check Your spam folder if you didn't see the mail</p>
            </div>
            <div 
            className='text-sm text-slate-400 flex items-center justify-center gap-x-2
                mt-2'>
                <div className='flex items-center gap-x-2'>
                    <FaCode/> CodeSync
                </div>
                <GoDotFill />
                <p>Secure Developer Platform</p>
            </div>
        </div>
    </div>
  )
}

export default ResetMailSentPage