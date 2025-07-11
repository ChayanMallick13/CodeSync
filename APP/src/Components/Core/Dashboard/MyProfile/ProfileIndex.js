import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { providerTypes } from "../../../../Utils/providerTypes";
import { Link, useNavigate } from "react-router-dom";
import {
  SignInWithGoogle,
  SignWithGithub,
} from "../../../../Services/Operations/Auth_Apis";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { FaCheck, FaGithub, FaGoogle, FaPen } from "react-icons/fa";
import Loader from "../../../../Pages/Loader";

const ProfileIndex = () => {
  const { user } = useSelector((state) => state.profile);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { authLoading } = useSelector((state) => state.auth);

  // console.log(user);

  function signInwithGoogleHandler(res) {
    dispatch(SignInWithGoogle(res.credential, navigate));
  }

  function signInwithGithubHandler() {
    dispatch(SignWithGithub());
  }

  if(!user){
    return <Loader/>
  }
  return (
    <div className="mx-auto text-white border-2 border-slate-400/70 md:w-9/12 w-full py-7 md:px-7 px-2 rounded-xl bg-slate-900 
    backdrop-blur-xl mt-1">
      <h3 className="text-3xl font-extrabold mb-10 text-center 
      bg-gradient-to-b from-blue-700 to-blue-100 bg-clip-text text-transparent
      ">Profile</h3>
      <div className="flex flex-col gap-y-4 mb-10 gap-x-6 items-center justify-center w-[100%]">
        <img
          alt="profile"
          referrerPolicy="no-referrer"
          src={user.image}
          className="w-[150px] h-[150px] aspect-square rounded-full
                border-4 object-cover
                "
        />
        <div className="text-xl flex gap-x-2 font-extrabold">
          <p>{user.firstName}</p>
          <p>{user.lastName}</p>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col  w-full justify-between">
        <div className="lg:w-[48%] md:mb-0 mb-6">
          <p className="text-lg text-slate-400">First Name</p>
          <p className="bg-slate-700 p-5 w-full rounded-xl md:text-xl text-sm font-extrabold border-[1px] border-slate-200/70">
            {user.firstName}
          </p>
        </div>
       <div className="lg:w-[48%] md:mb-0 mb-3">
          <p className="text-lg text-slate-400">Last Name</p>
          <p className="bg-slate-700 p-5 w-full rounded-xl md:text-xl text-sm font-extrabold border-[1px] border-slate-200/70">
            {user.lastName || 'No_LastName_Given'}
          </p>
        </div>
      </div>
      <div>
        <p className="text-lg text-slate-400 mt-3">Email</p>
        <p className="bg-slate-700 p-5 w-full rounded-xl font-extrabold md:text-xl text-sm border-[1px] border-slate-200/70">
          {user.email}
        </p>
      </div>
      <div>
        <h3 className="text-2xl mt-5 underline pb-6">
          Connected Platforms
        </h3>
        <div className="flex justify-between items-center px-6 rounded-full border-2 py-2 border-slate-600/60
        hover:border-slate-600 duration-200 transition-all
        ">
          <p className="text-xl flex items-center gap-x-2"><FaGithub/> Github</p>
          {user.accountType.includes(providerTypes.GITHUB) ? (
            <div
              className="bg-green-700 text-white flex gap-x-3 items-center font-extrabold 
            p-3 rounded-lg border-4 border-green-400"
            >
              <FaCheck />
              <span>Connected</span>
            </div>
          ) : (
            <button
              type="button"
              class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none
         focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
         inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-slate-800 me-2 
         mb-2 gap-x-3 justify-center"
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
          )}
        </div>
        <div className="flex justify-between items-center px-6 rounded-full border-2 p-2 border-slate-600/60
        hover:border-slate-600 duration-200 transition-all mt-5 mb-3
        ">
          <p className="text-xl flex items-center gap-x-2"><FaGoogle/> Google</p>
          {user?.accountType?.includes(providerTypes.GOOGLE) ? (
            <div
              className="bg-green-700 text-white flex gap-x-3 items-center font-extrabold 
            p-3 rounded-lg border-4 border-green-400"
            >
              <FaCheck />
              <span>Connected</span>
            </div>
          ) : (
            <GoogleLogin
              onSuccess={(res) => {
                if (!authLoading) signInwithGoogleHandler(res);
              }}
              onError={(err) => {
                toast.error("Some Problem in Signing In WIth Google");
              }}
            />
          )}
        </div>
      </div>
      <Link to={'/dashboard/settings'}
      className="bg-yellow-500 text-black p-3 font-extrabold rounded-xl border-2 border-slate-200
      flex gap-x-3 w-max items-center hover:bg-yellow-200 transition-all duration-200
      "
      >
          <FaPen/> Edit Details
      </Link>
    </div>
  );
};

export default ProfileIndex;
