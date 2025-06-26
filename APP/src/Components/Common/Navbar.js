import React, { useRef, useState } from "react";
import LOGO from "../../Assets/Logo/LOGO_CODE_SYNC.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";
import ProfileDropDown from "../Core/ProfileDropDown";
import useOutsideClickHandler from "../../Hooks/useClickOutsideEffect";
import AddReviewModal from "./Modals/AddReviewModal";
import JoinRoomModal from "./Modals/JoinRoomModal";

const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state) => state.profile
  );
  const [showProfileDropDown, setShowProfileDropDown] = useState(false);
  const [openReviewModal,setOpenReviewModal] = useState(false);
  const [joinRoomModal,setJoinRoomModal] = useState(false);
  const boxRef = useRef();
  useOutsideClickHandler(boxRef, () => {
    setShowProfileDropDown(false);
  });
  const location = useLocation();
  return (
    <div
      className={`w-[100%] text-white border-b-[1px] border-b-slate-400/20 h-[70px]
    ${location.pathname !== "/" && "bg-slate-900"}
    `}
    >
      <div className="md:w-10/12 w-[99%] mx-auto py-2 flex items-center justify-between md:pl-0 pl-7">
        {/* logo */}
        <Link to="/">
          <img alt="logo" src={LOGO} height={70} width={180} />
        </Link>

        {!user && (
          <div className="flex gap-x-5">
            <button
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden 
text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 
to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white
 dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 
 dark:focus:ring-green-800"
              onClick={() => {
                navigate("/auth/login");
              }}
            >
              <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                Login
              </span>
            </button>
            <button
              className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 
overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600
 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white 
 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              onClick={() => {
                navigate("/auth/signup");
              }}
            >
              <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent">
                SignUp
              </span>
            </button>
          </div>
        )}
        {user && (
          <div className="flex gap-x-2 relative">
            <button className="md:flex items-center gap-x-2 bg-slate-900 px-2 border-[1px] rounded-md border-slate-400/50 hidden"
            onClick={()=>{setJoinRoomModal(true)}}
            >
              <FaPlus />
              <span>Join Room by Code</span>
            </button>
            <div ref={boxRef}>
              <button
                onClick={() => {
                  setShowProfileDropDown(true);
                }}
              >
                <img
                  src={user.image}
                  referrerPolicy="no-referrer"
                  alt="profile"
                  className="w-[50px] h-[50px] aspect-square rounded-full object-cover"
                />
              </button>
              {showProfileDropDown && <ProfileDropDown 
                setOpenReviewModal={setOpenReviewModal}
                setJoinRoomModal={setJoinRoomModal}
              />}
              {openReviewModal&&<AddReviewModal
                openReviewModal={openReviewModal}
                setOpenReviewModal={setOpenReviewModal}
              />}
            </div>
          </div>
        )}
      </div>
      {
        joinRoomModal&&<JoinRoomModal
          setShowMadal={setJoinRoomModal}
        />
      }
    </div>
  );
};

export default Navbar;
