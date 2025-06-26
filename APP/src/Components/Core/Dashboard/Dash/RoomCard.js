import React, { useEffect, useState } from "react";
import { FaCrown, FaEye, FaPen } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const RoomCard = ({ activeUsers, name, owner,description,_id ,permissions}) => {
  console.log(permissions,'permi');
  const { user } = useSelector((state) => state.profile);
  const activeUsersList = activeUsers?.map(ele => ele?.user?.image) || [];
  return (
    <div className="bg-slate-900 border-[1px] border-slate-400/50 p-4 w-[450px] h-[290px] flex flex-col
    justify-between rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2 text-slate-400">
          <div
            className={`h-[15px] w-[15px] rounded-full ${
              activeUsersList?.length ? "bg-green-700" : "bg-red-700"
            }`}
          />
          <p>{activeUsersList?.length ? "ACTIVE" : "INACTIVE"}</p>
        </div>
        {
            (user._id === owner) && (
          <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
            <FaCrown />
            <p>Owner</p>
          </div>
        )}
        {
            (permissions?.write) && (user._id !== owner)&&<div>
                <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
                    <FaPen/>
                    <p>Write</p>
                </div>
            </div>
        }
        {
            (!permissions?.write) && (user._id !== owner)&&<div>
                <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
                    <FaEye />
                    <p>Read</p>
                </div>
            </div>
        }
      </div>
      <p className="text-xl font-extrabold">{name}</p>
      <p className="text-sm text-slate-400">{description?.substr(0,120)}</p>
      {
        <div className="flex gap-x-2">
        <p>Active Users : </p>
        <div className="flex gap-x-1">
            {
                activeUsersList.slice(0,3).map(
                    (ele,key) => {
                        return <img src={ele} key={key} alt="UserUmage" 
                        className="h-[30px] w-[30px] rounded-full object-cover aspect-square"
                         />
                    }
                )
            }
        </div>
        {
            (activeUsersList.length>3)&&<p
            className="bg-slate-600 p-1 rounded-full"
            >{(`+ ${(activeUsersList?.length-3) || 0}`)}</p>
        }
      </div>
      }
      <Link
      className="bg-slate-500 p-2 font-extrabold rounded-xl
      transition-all duration-200 hover:bg-slate-600 text-center
      "
      to={`/room/${_id}`}
      >
        Join Room
      </Link>
    </div>
  );
};

export default RoomCard;
