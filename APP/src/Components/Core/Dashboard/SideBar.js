import React, { useEffect, useRef, useState } from "react";
import { dashLinks } from "../../../Utils/dashLinks";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import useOutsideClickHandler from "../../../Hooks/useClickOutsideEffect";
import { RxExit } from "react-icons/rx";
import Template1 from "../../Common/Modals/Template1";
import { useDispatch } from "react-redux";
import { logOut } from "../../../Services/Operations/Auth_Apis";

const SideBar = () => {
  const location = useLocation();
  const [light, setLight] = useState("");
  const [showDash, setShowDash] = useState(true);
  const sidebarRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogOutModal,setShowLogOutModal] = useState(false);
  useOutsideClickHandler(sidebarRef, () => {
    setShowDash(false);
  });

  useEffect(() => {
    setLight(location.pathname.split("/").at(-1));
  }, [location.pathname]);
  return (
    <div ref={sidebarRef} className="relative">
      <button className="absolute text-white z-20 -top-11 left-3 text-2xl md:hidden block"
      onClick={()=>{
        setShowDash(prev => !prev);
        // console.log('hiii ');
      }}
      >
        <GiHamburgerMenu/>
      </button>
      <div
        className={`min-h-[calc(100vh-70px)] h-full bg-slate-900 
    text-white ${
      showDash
        ? "w-[250px] p-3 border-r-[1px] border-r-slate-300/60"
        : "md:w-[250px] md:p-3 p-0 w-0 overflow-hidden md:border-r-[1px] md:border-r-slate-300/60"
    }
    md:relative absolute z-10 transition-all duration-200
    `}
      >
        <div>
          {dashLinks.map((ele, key) => {
            return (
              <div key={key}>
                <Link
                  to={ele.link}
                  className={`flex items-center text-xl gap-y-5 gap-x-4 transition-all duration-200
                ${
                  ele.link.split("/").at(-1) === light
                    ? "border-2 rounded-xl bg-gray-500"
                    : "hover:text-slate-600"
                } mb-3
                px-2 py-2
                `}
                >
                  <ele.icon />
                  <span>{ele.name}</span>
                </Link>
              </div>
            );
          })}
          <button
          className={`flex items-center text-xl gap-y-5 gap-x-4 transition-all duration-200 px-2 py-2 w-full`}
          onClick={()=>{setShowLogOutModal(true)}}
          >
            <RxExit/>
            Log Out
          </button>
        </div>
      </div>
      {showLogOutModal&&
        <Template1
          btn1Text={'Cancel'}
          btn2Text={'Log Out'}
          heading={'Log Out'}
          description={'Confirm Your Log Out'}
          btn1Handler={()=>{
            setShowLogOutModal(false);
          }}
          btn2Handler={()=>{
            dispatch(logOut(navigate));
          }}
        />
      }
    </div>
  );
};

export default SideBar;
