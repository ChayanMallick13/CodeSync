import React, { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom';
import AuthFormTemplate from '../Components/Core/AuthFormTemplate';

const LoginSignUpPage = () => {
    const {type} = useParams();
    const [isSignUp,setIsSignUp] = useState(true);
    const location = useLocation();
    useEffect(
        () => {
            setIsSignUp(type==='signup');
        },[location.pathname]
    )
  return (
    <div className='text-white flex items-center justify-center md:h-[92vh] md:mt-0 mt-12'>
        <AuthFormTemplate
            isSignUp={isSignUp}
            setSignUp={setIsSignUp}
        />
    </div>
  )
}

export default LoginSignUpPage;