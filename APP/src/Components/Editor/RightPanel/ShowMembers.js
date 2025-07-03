import React, { useEffect, useRef, useState } from "react";
import { SlOptionsVertical } from "react-icons/sl";
import useOutsideClickHandler from "../../../Hooks/useClickOutsideEffect";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { changePermissions } from "../../../Services/Operations/Room_Apis";
import { useSelector } from "react-redux";

const ShowMembers = ({
  permittedUsers,
  activeUsers,
  owner,
  thisUsersPermissions,
  socket,
  showChat,
}) => {
  console.log(permittedUsers, "pp");
  const { id } = useParams();
  let activeusersId = activeUsers?.map((ele) => ele.user._id);
  const [showChangeOption, setShowChangeOptions] = useState(false);
  const positions = ["moderator", "writer", "reader"];
  const boxRef = useRef(null);
  const [userPosition, setUserPosition] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const [banUser, setBanUser] = useState(false);
  async function handlePermissionChange(
    body,
    targetUser,
    targetId,
    newPos,
    oldPos
  ) {
    console.log(body);
    const res = await changePermissions(
      body,
      setDisableBtn,
      setShowChangeOptions
    );
    if (res.success) {
      toast.success("Permission Change Successfull");
      // console.log(socket.emit,res);
      const data = {
        item: res.permission,
        targetName: targetUser,
        userName: `${user.firstName} ${user.lastName}`,
        roomId: id,
        targetId,
        newPos,
        oldPos,
      };
      socket.emit("userPermissionChange", data);
    }
  }
  const positionsMap = {
    moderator: {
      isread: true,
      iswrite: true,
      isdelete: true,
    },
    writer: {
      isread: true,
      iswrite: true,
      isdelete: false,
    },
    reader: {
      isread: true,
      iswrite: false,
      isdelete: false,
    },
  };
  function getDefaultUserRole(per) {
    if (!per.write) {
      return "reader";
    } else if (!per.delete) {
      return "writer";
    } else {
      return "moderator";
    }
  }
  useOutsideClickHandler(boxRef, () => {
    setShowChangeOptions(false);
  });
  function getUserActiveColor(id) {
    const val = activeUsers.filter((ele) => ele.user._id === id);
    if (val.length === 0) return null;
    return val[0].cursorColor;
  }
  return (
    <div
      className={`flex flex-col gap-y-4 p-2
    ${!showChat ? "block" : "hidden"}
    `}
    ref={boxRef}
    >
      <div className="flex gap-x-2 items-center">
        <img
          referrerPolicy="no-referrer"
          alt="user"
          src={owner?.image}
          className="h-[70px] w-[70px] object-cover rounded-full aspect-square"
        />
        <div>
          <p className="font-extrabold">
            {owner?.firstName} {owner?.lastName}
          </p>
          <p className="text-sm text-yellow-400">Owner</p>
          <div className="flex items-center gap-x-6">
            <p
              className={`text-sm font-extrabold ${
                activeusersId.includes(owner._id)
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {activeusersId.includes(owner._id) ? "Active" : "Inactive"}
            </p>
            <div
              className="h-[10px] w-[10px] rounded-full"
              style={{
                backgroundColor:
                  getUserActiveColor(owner?._id) || "transparent",
              }}
            />
          </div>
        </div>
      </div>
      {permittedUsers.map((userParams, key) => {
        return (
          <div
            key={key}
            className="flex gap-x-2 items-center w-full relative"
          >
            <img
              referrerPolicy="no-referrer"
              alt="user"
              src={userParams?.image}
              className="h-[70px] w-[70px] object-cover rounded-full aspect-square"
            />
            <div className="w-full">
              <p>
                {userParams?.firstName} {userParams?.lastName}
              </p>
              <p
                className={`text-sm font-bold
              ${
                userParams.permissions.delete
                  ? "text-indigo-600"
                  : userParams.permissions.write
                  ? "text-orange-600"
                  : "text-blue-600"
              }
              flex items-center justify-between
              `}
              >
                {userParams.permissions.delete
                  ? "Moderator"
                  : userParams.permissions.write
                  ? "Writer"
                  : "Reader"}
                {thisUsersPermissions.delete && (
                  <button
                    onClick={() => {
                      setShowChangeOptions(key+1);
                      console.clear();
                      console.log(showChangeOption);
                    }}
                  >
                    <SlOptionsVertical />
                  </button>
                )}
              </p>
              <div className="flex items-center gap-x-6">
                <p
                  className={`text-sm font-extrabold ${
                    activeusersId.includes(userParams?._id)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {activeusersId.includes(userParams?._id)
                    ? "Active"
                    : "Inactive"}
                </p>
                <div
                  className="h-[10px] w-[10px] rounded-full"
                  style={{
                    backgroundColor:
                      getUserActiveColor(userParams?._id) || "transparent",
                  }}
                />
              </div>
            </div>
            {(showChangeOption===(key+1)) && (
              <div
                className="absolute bg-slate-700 border-slate-100/60 border-[1px] p-2 w-full
              rounded-xl flex flex-col gap-y-2  z-20
              "
              >
                <h3 className="font-bold">
                  Change Role for {userParams.firstName} {userParams.lastName}
                </h3>
                <select
                  defaultValue={getDefaultUserRole(userParams.permissions)}
                  className="bg-slate-400 p-2 rounded-xl focus:border-slate-100/50 focus:border-[1px]
                outline-none text-black font-bold
                "
                  onChange={(e) => {
                    setUserPosition(e.target.value);
                  }}
                >
                  {positions.map((ele) => {
                    return (
                      <option key={ele} value={ele}>
                        {ele}
                      </option>
                    );
                  })}
                </select>
                <div className="flex items-center justify-around">
                  <button
                    onClick={() => {
                      setShowChangeOptions(false);
                    }}
                    className="bg-slate-400 py-2 px-6 mt-2 text-black font-bold hover:bg-slate-300
                  duration-200 transition-all rounded-xl
                  "
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-yellow-400 py-2 px-6 mt-2 text-black font-bold hover:bg-yellow-300
                  duration-200 transition-all rounded-xl
                  "
                    onClick={(e) => {
                      const oldPos = getDefaultUserRole(userParams.permissions);
                      if (!userPosition || oldPos === userPosition) {
                        toast.error("No Changes Made ...");
                        return;
                      }
                      let body = {
                        targetUser: userParams._id,
                        roomId: id,
                      };
                      body = { ...body, ...positionsMap[userPosition] };
                      handlePermissionChange(
                        body,
                        `${userParams.firstName} ${userParams.lastName}`,
                        userParams._id,
                        userPosition,
                        oldPos
                      );
                    }}
                    disabled={disableBtn}
                  >
                    Save
                  </button>
                </div>
                {((owner._id===user._id) || (thisUsersPermissions.delete && !userParams.permissions.delete))&&
                  <div>
                    <div>
                      <label
                        className="flex items-center gap-x-3 text-sm mt-3 text-orange-500 font-bold
                      cursor-pointer
                      "
                      >
                        <input
                          type="checkbox"
                          checked={banUser}
                          onChange={(e) => {
                            setBanUser(e.target.checked);
                          }}
                        />
                        <p>Ban User</p>
                      </label>
                    </div>

                    <button
                      className="font-bold text-center w-full text-red-500"
                      onClick={() => {
                        socket.emit("leaveRoomByUser", {
                          targetUserId: userParams._id,
                          userId: user._id,
                          kick: true,
                          ban: banUser,
                          roomId: id,
                          targetUser: `${user.firstName} ${user.lastName}`,
                          kickedBy: `${userParams.firstName} ${userParams.lastName}`,
                        });
                        setShowChangeOptions(false);
                      }}
                    >
                      Remove {`${userParams.firstName} ${userParams.lastName}`}
                    </button>
                  </div>
                }
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShowMembers;
