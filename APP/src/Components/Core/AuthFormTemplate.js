import { GoogleLogin } from "@react-oauth/google";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaCode, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {  Link, useNavigate } from "react-router-dom";
import { sendOtp, signIn, SignInWithGoogle, SignWithGithub } from "../../Services/Operations/Auth_Apis";
import toast from "react-hot-toast";

const AuthFormTemplate = ({ isSignUp, setSignUp }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {authLoading} = useSelector(state => state.auth);
  console.log(authLoading);

  function signInwithGoogleHandler(res){
    dispatch(SignInWithGoogle(res.credential,navigate));
  }

  function signInwithGithubHandler(){
    dispatch(SignWithGithub());
  }

  function submitHandler(formData){
    if(isSignUp){
      dispatch(sendOtp(formData,navigate));
    }
    else{
      dispatch(signIn(formData,navigate));
    }
  }

  return (
    <div
      className="border-[1px] border-slate-400/60 rounded-lg
    p-7 sm:w-[500px] w-[370px]
    "
    >
      <h2
        className="text-3xl font-extrabold flex items-center gap-x-3
        justify-center mb-4
        "
      >
        <FaCode /> CodeSync
      </h2>
      <p className="text-lg text-slate-500 text-center mb-7">
        Welcome back to your coding workspace
      </p>
      <div className="bg-gray-900 rounded-lg backdrop-blur-lg mb-8">
        <button
          className={`w-[50%] text-center ${
            !isSignUp && "bg-gray-700/70 border-[1px] border-slate-300/50"
          }
            p-3 rounded-lg
            `}
          onClick={() => {
            navigate("/auth/login");
          }}
        >
          Login
        </button>
        <button
          className={`w-[50%] text-center ${
            isSignUp && "bg-gray-700/70 border-[1px] border-slate-300/50"
          }
            p-3 rounded-lg 
            `}
          onClick={() => {
            navigate("/auth/signup");
          }}
        >
          SignUp
        </button>
      </div>
      <form onSubmit={handleSubmit(submitHandler)}>
        {isSignUp && (
          <div className="flex justify-between sm:flex-row flex-col w-full">
            <div className="md:w-[50%] w-full mr-2">
              <label>
                <p className="font-bold">
                  FirstName <sup className="text-sm text-red-700">*</sup>
                </p>
                <input
                  placeholder="Enter Your First Name"
                  type="text"
                  id="firstName"
                  className="w-full outline-none bg-gray-900 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-slate-500 mt-1 mb-3
                        "
                  {...register("firstName", {
                    required: { value: true, message: "FirstName is Required" },
                  })}
                />
              </label>
              {errors.firstName && (
                <span className="text-xs text-red-500">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="md:w-[50%] w-full">
              <label>
                <p className="font-bold">LastName</p>
                <input
                  placeholder="Enter Your Last Name"
                  type="text"
                  id="lastName"
                  className="w-full outline-none bg-gray-900 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-slate-500 mt-1 mb-3
                        "
                  {...register("lastName")}
                />
              </label>
              {errors.lastName && (
                <span className="text-xs text-red-500">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
        )}
        <div>
          <label>
            <p className="font-bold">
              Email <sup className="text-sm text-red-700">*</sup>
            </p>
            <input
              type="email"
              placeholder="Enter Your Email"
              id="email"
              className="w-[100%] outline-none bg-gray-900 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-slate-500 mt-1 mb-3
                        "
              {...register("email", {
                required: { value: true, message: "Email is Required" },
              })}
            />
          </label>
          {errors.email && (
            <span className="text-xs text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>
        <div>
          <label className="relative">
            <p className="font-bold">
              Password <sup className="text-sm text-red-700">*</sup>
            </p>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              id="password"
              className="w-[100%] outline-none bg-gray-900 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-slate-500 mt-1 mb-3
                        "
              {...register("password", {
                required: { value: true, message: "Password is Required" },
              })}
            />
            {
              <button
                className="absolute right-3 top-[70%]"
                onClick={() => {
                  setShowPassword((prev) => !prev);
                }}
                type="button"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            }
          </label>
          {errors.password && (
            <span className="text-xs text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
        {isSignUp && (
          <div>
            <label className="relative">
              <p className="font-bold">
                Confirm Password <sup className="text-sm text-red-700">*</sup>
              </p>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Your Password"
                id="confirmPassword"
                className="w-[100%] outline-none bg-gray-900 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-slate-500 mt-1 mb-3
                        "
                {...register("confirmPassword", {
                  required: {
                    value: true,
                    message: "Confirm Password is Required",
                  },
                })}
              />
              <button
                className="absolute right-3 top-[70%]"
                onClick={() => {
                  setShowConfirmPassword((prev) => !prev);
                }}
                type="button"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </label>
            {errors.confirmPassword && (
              <span className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        )}
        {!isSignUp && (
          <Link
            type="button"
            className="text-sm text-blue-600 flex place-self-end"
            to={'/reset-password/request'}
          >
            Forgot Password?
          </Link>
        )}

        <button
          className="flex gap-x-2 items-center text-lg font-extrabold justify-center w-[100%] 
            bg-slate-700 p-3 mt-2 rounded-lg"
          disabled={authLoading}
        >
          <FaSignInAlt />
          {<span>{isSignUp ? "Sign Up" : "Log In"}</span>}
        </button>
      </form>

      <div className="flex items-center gap-x-2 mt-3 mb-2">
        <div className="w-full h-[1px] bg-white/50" />
        <p className="min-w-max text-slate-400">or continue with</p>
        <div className="w-full h-[1px] bg-white/50" />
      </div>

      <button
        type="button"
        class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none
         focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
         inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-slate-800 me-2 
         mb-2 gap-x-3 w-full justify-center"
         onClick={signInwithGithubHandler}
         disabled={authLoading}
      >
        <svg
          class="w-4 h-4 me-2"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M10 .333A9.911 
        9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 
        2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 
        1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 
        4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 
        2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 
        0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z"
            clip-rule="evenodd"
          />
        </svg>
        Continue with Github
      </button>
      <GoogleLogin
        onSuccess={(res) => {
          if(!authLoading)
            signInwithGoogleHandler(res);
        }}
        onError={(err) => {
          toast.error('Some Problem in Signing In WIth Google');
        }}
      />
    </div>
  );
};

export default AuthFormTemplate;
