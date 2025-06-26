import React, { useEffect } from "react";

const ShowMembers = ({ permittedUsers, activeUsers, owner }) => {
  console.log(permittedUsers, "pp");
  let activeusersId = activeUsers?.map((ele) => ele.user._id);
  function getUserActiveColor(id) {
    const val = activeUsers.filter((ele) => ele.user._id === id);
    if (val.length === 0) return null;
    return val[0].cursorColor;
  }
  return (
    <div className="flex flex-col gap-y-4 p-2">
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
      {permittedUsers.map((user, key) => {
        return (
          <div key={key} className="flex gap-x-2 items-center">
            <img
              referrerPolicy="no-referrer"
              alt="user"
              src={user?.image}
              className="h-[70px] w-[70px] object-cover rounded-full aspect-square"
            />
            <div>
              <p>
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-slate-400">Member</p>
              <div className="flex items-center justify-between">
                <p
                  className={`text-sm font-extrabold ${
                    activeusersId.includes(user?._id)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {activeusersId.includes(user?._id) ? "Active" : "Inactive"}
                </p>
                <div
                  className="h-[10px] w-[10px] rounded-full"
                  style={{
                    backgroundColor:
                      getUserActiveColor(user?._id) || "transparent",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ShowMembers;
