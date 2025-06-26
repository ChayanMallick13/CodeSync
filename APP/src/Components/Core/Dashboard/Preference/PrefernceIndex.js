import React, { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaCode, FaMoon, FaSave, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { monacoSupportedLanguages } from "../../../../Utils/allLanguages";
import { setDefaultLanguage, setfontSize, setTheme } from "../../../../Reducer/Slices/preferenceSlice";
import toast from "react-hot-toast";

const PrefernceIndex = () => {
  const { fontSize, theme, defaultLanguage } = useSelector(
    (state) => state.preference
  );
  const [nowTheme,setnowTheme] = useState(theme);
  const [nowFont,setNowFont] = useState(fontSize);
  const [nowLang,setNowLang] = useState(defaultLanguage);
  const dispatch = useDispatch();

  function changeHandler(){
    dispatch(setTheme(nowTheme));
    dispatch(setDefaultLanguage(nowLang));
    dispatch(setfontSize(nowFont));
    toast.success('Changes Saved');
  }

  useEffect(
    () => {
      setNowFont(fontSize);
      setNowLang(defaultLanguage);
      setnowTheme(theme);
    },[fontSize,theme,defaultLanguage]
  )

  return (
    <div className="text-white md:w-9/12 bg-slate-900 mx-auto p-4 border-2 rounded-xl">
      <h3 className="flex items-center gap-x-1 text-2xl font-bold mt-3">
        <IoSettingsOutline />{" "}
        <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Editor Preferences
        </span>
      </h3>
      <div className="bg-slate-800 mt-6 flex items-center justify-between p-3 rounded-xl mb-8">
        <div className="flex items-center gap-x-4">
          <div className="bg-slate-700 p-4 rounded-2xl">
            {theme === "dark" ? <FaMoon /> : <FaSun />}
          </div>
          <div>
            <p className="text-white font-bold">Theme</p>
            <p className="text-sm text-slate-300">
              Switch between dark and light mode
            </p>
          </div>
        </div>
        <div>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={nowTheme === "dark"}
              className="sr-only peer"
              onChange={(event)=>{setnowTheme(event.target.checked?('dark'):('light'))}}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
      <div className="bg-slate-800 mt-6 flex flex-col p-3 rounded-xl mb-8">
        <div className="bg-slate-800 flex items-center rounded-xl gap-x-4 mb-7">
          <div className="bg-slate-700 py-4 px-5 rounded-2xl font-bold">A</div>
          <div>
            <p className="text-white font-bold">Font Size</p>
            <p className="text-sm text-slate-300">Adjust editor font size</p>
          </div>
        </div>
        <div className="w-full flex justify-between text-slate-300">
          <p>12px</p>
          <p>{nowFont}px</p>
          <p>22px</p>
        </div>
        <div>
          <input
            id="default-range"
            type="range"
            value={nowFont}
            onChange={(event)=>{setNowFont(event.target.value)}}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            min={12}
            max={22}
          />
        </div>
      </div>
      <div className="bg-slate-800 mt-6 flex flex-col p-3 rounded-xl mb-8">
        <div className="flex items-center gap-x-4 mb-5">
          <div className="bg-slate-700 p-4 rounded-2xl">
            <FaCode />
          </div>
          <div>
            <p className="text-white font-bold">Default Language</p>
            <p className="text-sm text-slate-300">Choose your preferred Default Language in Editor</p>
          </div>
        </div>
        <select
        className="bg-slate-600 p-3 rounded-xl outline-none"
        value={nowLang}
        onChange={(event)=>{setNowLang(event.target.value)}}
        >
          {
            monacoSupportedLanguages.map(
              (ele,key) => {
                return <option value={ele} key={key}>
                  {ele}
                </option>
              }
            )
          }
        </select>
      </div>
      <button
      className="flex place-self-end items-center bg-yellow-300 text-black font-bold gap-x-2 p-3
      rounded-lg transition-all duration-200 hover:bg-yellow-400
      "
      onClick={changeHandler}
      >
        <FaSave/>
        Save Changes
      </button>
    </div>
  );
};

export default PrefernceIndex;
