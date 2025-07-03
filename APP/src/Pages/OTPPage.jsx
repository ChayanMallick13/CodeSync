import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCode } from "react-icons/fa";
import { MdOutlineSecurity } from "react-icons/md";
import OTPInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { providerTypes } from "../Utils/providerTypes";
import { signUp } from "../Services/Operations/Auth_Apis";
import { Link, Navigate, useNavigate } from "react-router-dom";

const OTPPage = () => {
  const { signUpData } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");
  const [isCounting, setIsCounting] = useState(false);
  const [count, setCount] = useState(30);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleSignUp(){

    const data = {
      ...signUpData,
      otp,
      success:true,
    }
    // console.log(data);
    dispatch(signUp(data,navigate));
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

  if(!signUpData){
    return <Navigate to={'/auth/signup'}/>
  }


  return (
    <div className="h-[80vh] text-white flex flex-col gap-y-4 justify-center items-center">
      <h2 className="text-3xl font-extrabold flex items-center gap-x-2">
        <FaCode />
        <span>CodeSync</span>
      </h2>

      <div className="border-[1px] rounded-xl border-slate-300/60 p-4">
        <h3 className="text-center text-2xl font-bold">
          Verify Your CodeSync Account
        </h3>
        <p className="text-sm text-slate-400 text-center mt-3 mb-7">
          Enter the 6-digit code sent to your email {signUpData?.email} to
          continue
        </p>
        <div className="flex justify-center items-center">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span className="w-2 md:w-4 lg:w-5" />}
            renderInput={(props) => (
              <input
                {...props}
                placeholder="-"
                className="text-white text-center bg-[#161D29] outline-yellow-400 border-b border-gray-500 rounded-xl"
                style={{
                  width: "12vw", // responsive width
                  maxWidth: 60, // prevent it from growing too much
                  minWidth: 40, // prevent it from shrinking too much
                  height: "12vw",
                  maxHeight: 60,
                  minHeight: 40,
                  fontSize: "clamp(24px, 5vw, 40px)", // responsive font size
                }}
              />
            )}
          />
        </div>

        <button
          disabled={isCounting}
          onClick={() => {
            setIsCounting(true);
          }}
          className="text-center w-full mt-8 text-slate-400"
        >
          Didn't recieve the code?
        </button>
        {isCounting && count && (
          <div className="flex justify-center font-bold underline">
            Resend Code in {count}s
          </div>
        )}
        <button
          className="w-full p-3 bg-white text-black font-bold mt-8 rounded-full hover:bg-white/60 
        duration-200 transition-all"
        onClick={handleSignUp}
        >
          Verify Account
        </button>
        <Link
          className="flex w-full items-center gap-x-2 justify-center p-5"
          to="/auth/signup"
        >
          <FaArrowLeft />
          <span>Back To Login</span>
        </Link>
      </div>

      <p className="flex items-center gap-x-2 text-sm text-slate-400">
        <MdOutlineSecurity /> Your account security is our top priority
      </p>
    </div>
  );
};

export default OTPPage;
