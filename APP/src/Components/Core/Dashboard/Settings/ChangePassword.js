import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash, FaKey } from "react-icons/fa";
import { changePassword } from "../../../../Services/Operations/Profile_Apis";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [disableUserNameBtn, setDisableUserNameBtn] = useState(false);
  const [showNewPassword,setshowNewPassword] = useState(false);
  const [showOldPassword,setshowOldPassword] = useState(false);
  function submitHandler(data) {
    changePassword(data,setDisableUserNameBtn);
  }
  return (
    <div>
      <p className="text-2xl font-bold mb-6">Change Password</p>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div>
          <div>
            <label className="relative">
              <p className="font-bold">
                Old Password <sup className="text-sm text-red-700">*</sup>
              </p>
              <input
                type={showOldPassword ? "text" : "password"}
                placeholder="Enter Your Old Password"
                id="oldPassword"
                className="w-[100%] outline-none bg-gray-700 text-white p-3 rounded-lg 
                                    border-b-[1px] placeholder:text-white mt-1 mb-3
                                    "
                {...register("oldPassword", {
                  required: { value: true, message: "Old Password is Required" },
                })}
              />
              {
                <button
                  className="absolute right-3 top-[70%]"
                  onClick={() => {
                    setshowOldPassword((prev) => !prev);
                  }}
                  type="button"
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            </label>
            {errors.oldPassword && (
              <span className="text-xs text-red-500">
                {errors.oldPassword.message}
              </span>
            )}
          </div>

          <div>
            <label className="relative">
              <p className="font-bold">
                New Password <sup className="text-sm text-red-700">*</sup>
              </p>
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="Enter Your New Password"
                id="newPassword"
                className="w-[100%] outline-none bg-gray-700 text-white p-3 rounded-lg 
                                    border-b-[1px] placeholder:text-white mt-1 mb-3
                                    "
                {...register("newPassword", {
                  required: { value: true, message: "New Password is Required" },
                })}
              />
              {
                <button
                  className="absolute right-3 top-[70%]"
                  onClick={() => {
                    setshowNewPassword((prev) => !prev);
                  }}
                  type="button"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              }
            </label>
            {errors.newPassword && (
              <span className="text-xs text-red-500">
                {errors.newPassword.message}
              </span>
            )}
          </div>
        </div>
        <button
          type="submit"
          className="flex place-self-end items-center gap-x-2 font-bold text-black bg-yellow-300 p-3 mt-3
          rounded-lg hover:bg-yellow-400 transition-all duration-200
          "
          disabled={disableUserNameBtn}
        >
            <FaKey/>
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
