import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSave, FaUpload } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { changeUserImage, changeUserName } from "../../../../Services/Operations/Profile_Apis";
import toast from "react-hot-toast";
import ChangePassword from "./ChangePassword";
import { providerTypes } from '../../../../Utils/providerTypes';

const SettingsIndex = () => {
  const {register,
    handleSubmit,
    setValue,
    formState:{errors}
  } = useForm();
  const { user } = useSelector((state) => state.profile);
  const [userImage,setUserImage] = useState(user.image);
  const [userFile,setuserImageFile] = useState(null);
  const [disableImageBtn,setDisableImageBtn] = useState(false);
  const [disableUserNameBtn,setDisableUserNameBtn] = useState(false);
  const dispatch = useDispatch();

  function getImageUrlFromSource(source) {
    if (source instanceof Blob) {
      return URL.createObjectURL(source);
    }
    return source;
  }

  function submitHandler(data){
    if(data.firstName === user.firstName && data.lastName === user.lastName){
      toast.error('User Names Not Chnaged ...');
      return;
    }
    dispatch(changeUserName(data,setDisableUserNameBtn));
  }

  function handleImageUpload(event){
    const file = event.target.files[0];
    setUserImage(getImageUrlFromSource(file));
    setuserImageFile(file);
  }

  function handleImageChangeRequest(){
    if(!userFile || !(userFile instanceof Blob)){
      toast.error('Same Profile Picture , No Changes');
      return;
    }
    const body = new FormData();
    body.append('profilePicture',userFile);
    dispatch(changeUserImage(body,setDisableImageBtn));
  }


  useEffect(
    () => {
      setValue('firstName',user.firstName);
      setValue('lastName',user.lastName);
      setUserImage(getImageUrlFromSource(user.image));
    },[user]
  )

  return (
    <div className="text-white md:w-9/12 w-full mx-auto mt-2
    bg-slate-900 p-8 border-2 border-slate-300/60 rounded-lg
    ">
      <p
      className="text-3xl font-extrabold text-center
      bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-10
      "
      >Settings</p>
      <p className="text-2xl font-bold">Change Profile Picture</p>
      <div className="flex justify-center items-center mt-8 mb-12 flex-wrap gap-y-7">
        <img referrerPolicy="no-referrer" alt="profile" src={userImage} 
          className="md:max-w-[200px] md:max-h-[200px] max-w-[140x] max-h-[140px] border-2"
        />
        <div className="ml-8 flex flex-col">
          <div
          className="bg-slate-300 text-black font-bold rounded-lg flex items-center gap-x-2
          hover:bg-slate-400 transition-all duration-200 relative overflow-hidden cursor-pointer
          "
          >
          <input
            type="file"
            multiple={false}
            className="absolute opacity-0 top-0 bottom-0 left-0 right-0"
            onChange={handleImageUpload}
          />
          <div className="flex gap-x-2 p-3 items-center">
            <FaUpload />
            Upload
          </div>
          </div>
          <button
          className="text-black bg-yellow-300 p-3 mt-4 font-bold rounded-lg
          transition-all duration-200 hover:bg-yellow-400
          "
          disabled={disableImageBtn}
          onClick={handleImageChangeRequest}
          >Save</button>
        </div>
      </div>
      <div >
        <p className="text-2xl font-bold mb-6">Change Your Name</p>
        <form onSubmit={handleSubmit(submitHandler)}>
          <div>
            <div className="flex justify-between flex-col w-full">
              <div className="w-full mr-2">
                <label>
                  <p className="font-bold">
                    FirstName <sup className="text-sm text-red-700">*</sup>
                  </p>
                  <input
                    placeholder="Enter Your First Name"
                    type="text"
                    id="firstName"
                    className="w-full outline-none bg-gray-700 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-white mt-1 mb-3
                        "
                    {...register("firstName", {
                      required: {
                        value: true,
                        message: "FirstName is Required",
                      },
                    })}
                  />
                </label>
                {errors.firstName && (
                  <span className="text-xs text-red-500">
                    {errors.firstName.message}
                  </span>
                )}
              </div>
              <div className="w-full">
                <label>
                  <p className="font-bold">LastName</p>
                  <input
                    placeholder="Enter Your Last Name"
                    type="text"
                    id="lastName"
                    className="w-full outline-none bg-gray-700 text-white p-3 rounded-lg 
                        border-b-[1px] placeholder:text-white mt-1 mb-3
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
          </div>
          <button type="submit"
          className="flex place-self-end items-center gap-x-2 font-bold text-black bg-yellow-300 p-3 mt-3
          rounded-lg hover:bg-yellow-400 transition-all duration-200
          "
          disabled={disableUserNameBtn}
          >
                <FaSave/>
                Save Changes
          </button>
        </form>
      </div>
      {
        user?.accountType?.includes(providerTypes.TRADITIONAL)&&<ChangePassword/>
      }
    </div>
  );
};

export default SettingsIndex;
