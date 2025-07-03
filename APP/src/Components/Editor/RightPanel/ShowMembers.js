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
  const { id } = useParams();
  const [showChangeOption, setShowChangeOptions] = useState(false);
  const [userPosition, setUserPosition] = useState(null);
  const [disableBtn, setDisableBtn] = useState(false);
  const [banUser, setBanUser] = useState(false);
  const boxRef = useRef(null);
  const { user } = useSelector((state) => state.profile);

  const activeUserIds = activeUsers?.map((ele) => ele?.user?._id) || [];

  const positions = ["moderator", "writer", "reader"];
  const positionsMap = {
    moderator: { isread: true, iswrite: true, isdelete: true },
    writer: { isread: true, iswrite: true, isdelete: false },
    reader: { isread: true, iswrite: false, isdelete: false },
  };

  useOutsideClickHandler(boxRef, () => setShowChangeOptions(false));

  if (!owner || !user || !permittedUsers) return null;

  function getDefaultUserRole(per) {
    if (!per.write) return "reader";
    if (!per.delete) return "writer";
    return "moderator";
  }

  function getUserActiveColor(userId) {
    const user = activeUsers?.find((ele) => ele?.user?._id === userId);
    return user?.cursorColor || "transparent";
  }

  async function handlePermissionChange(
    body,
    targetUser,
    targetId,
    newPos,
    oldPos
  ) {
    const res = await changePermissions(
      body,
      setDisableBtn,
      setShowChangeOptions
    );
    if (res.success) {
      toast.success("Permission Change Successful");
      socket.emit("userPermissionChange", {
        item: res.permission,
        targetName: targetUser,
        userName: `${user.firstName} ${user.lastName}`,
        roomId: id,
        targetId,
        newPos,
        oldPos,
      });
    }
  }

  return (
    <div
      className={`flex flex-col gap-y-4 p-2 ${!showChat ? "block" : "hidden"}`}
      ref={boxRef}
    >
      {/* Owner section */}
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
                activeUserIds.includes(owner?._id)
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {activeUserIds.includes(owner?._id) ? "Active" : "Inactive"}
            </p>
            <div
              className="h-[10px] w-[10px] rounded-full"
              style={{ backgroundColor: getUserActiveColor(owner?._id) }}
            />
          </div>
        </div>
      </div>

      {/* Permitted users section */}
      {permittedUsers.map((userParams, key) => {
        const isActive = activeUserIds.includes(userParams?._id);
        const role = getDefaultUserRole(userParams?.permissions);
        const canShowOptions =
          thisUsersPermissions?.delete && userParams?._id !== user?._id;

        return (
          <div key={key} className="flex gap-x-2 items-center w-full relative">
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
                className={`text-sm font-bold ${
                  role === "moderator"
                    ? "text-indigo-600"
                    : role === "writer"
                    ? "text-orange-600"
                    : "text-blue-600"
                } flex items-center justify-between`}
              >
                {role}
                {canShowOptions && (
                  <button onClick={() => setShowChangeOptions(key + 1)}>
                    <SlOptionsVertical />
                  </button>
                )}
              </p>
              <div className="flex items-center gap-x-6">
                <p
                  className={`text-sm font-extrabold ${
                    isActive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isActive ? "Active" : "Inactive"}
                </p>
                <div
                  className="h-[10px] w-[10px] rounded-full"
                  style={{
                    backgroundColor: getUserActiveColor(userParams?._id),
                  }}
                />
              </div>
            </div>

            {/* Dropdown: Change Role / Ban / Kick */}
            {showChangeOption === key + 1 && (
              <div
                className="absolute bg-slate-700 border-slate-100/60 border-[1px] p-2 w-full
              rounded-xl flex flex-col gap-y-2 z-20"
              >
                <h3 className="font-bold">
                  Change Role for {userParams.firstName} {userParams.lastName}
                </h3>

                <select
                  defaultValue={role}
                  className="bg-slate-400 p-2 rounded-xl focus:border-slate-100/50 focus:border-[1px]
                outline-none text-black font-bold"
                  onChange={(e) => setUserPosition(e.target.value)}
                >
                  {positions.map((ele) => (
                    <option key={ele} value={ele}>
                      {ele}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-around">
                  <button
                    onClick={() => setShowChangeOptions(false)}
                    className="bg-slate-400 py-2 px-6 mt-2 text-black font-bold hover:bg-slate-300
                    duration-200 transition-all rounded-xl"
                  >
                    Cancel
                  </button>

                  <button
                    className="bg-yellow-400 py-2 px-6 mt-2 text-black font-bold hover:bg-yellow-300
                    duration-200 transition-all rounded-xl"
                    onClick={() => {
                      const oldPos = role;
                      if (!userPosition || oldPos === userPosition) {
                        toast.error("No Changes Made ...");
                        return;
                      }
                      let body = {
                        targetUser: userParams._id,
                        roomId: id,
                        ...positionsMap[userPosition],
                      };
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

                {(owner?._id === user?._id ||
                  (thisUsersPermissions?.delete &&
                    !userParams.permissions?.delete)) && (
                  <div>
                    <label
                      className="flex items-center gap-x-3 text-sm mt-3 text-orange-500 font-bold cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={banUser}
                        onChange={(e) => setBanUser(e.target.checked)}
                      />
                      <p>Ban User</p>
                    </label>

                    <button
                      className="font-bold text-center w-full text-red-500"
                      onClick={() => {
                        socket.emit("leaveRoomByUser", {
                          targetUserId: userParams._id,
                          userId: user._id,
                          kick: true,
                          ban: banUser,
                          roomId: id,
                          targetUser: `${userParams.firstName} ${userParams.lastName}`,
                          kickedBy: `${user.firstName} ${user.lastName}`,
                        });
                        setShowChangeOptions(false);
                      }}
                    >
                      Remove {`${userParams.firstName} ${userParams.lastName}`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ShowMembers;
