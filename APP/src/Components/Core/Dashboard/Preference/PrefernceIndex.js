import React, { useEffect, useState } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { FaCode, FaMoon, FaSave, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { monacoSupportedLanguages } from "../../../../Utils/allLanguages";
import { setDefaultLanguage, setfontSize, setItem, setTheme } from "../../../../Reducer/Slices/preferenceSlice";
import { HiMiniMap } from "react-icons/hi2";
import toast from "react-hot-toast";
import { RxFontFamily } from "react-icons/rx";
import { monacoFontOptions } from "../../../../Utils/MonacoFonts";
import { LuLigature } from "react-icons/lu";

const PrefernceIndex = () => {
  const { fontSize, theme, defaultLanguage,miniMap,fontFamily,ligature } = useSelector(
    (state) => state.preference
  );
  const [nowTheme,setnowTheme] = useState(theme);
  const [nowFont,setNowFont] = useState(fontSize);
  const [nowLang,setNowLang] = useState(defaultLanguage);
  const [ligatureState,setLigature] = useState(ligature);
  const [fontFamilyState,setFontFamily] = useState(fontFamily);
  const [miniMapState,setMiniMap] = useState(miniMap);
  const [showLigatureOptionFalse,setShowLigature] = useState(ligature);
  const dispatch = useDispatch();


  function changeHandler(){
    dispatch(setTheme(nowTheme));
    dispatch(setDefaultLanguage(nowLang));
    dispatch(setfontSize(nowFont));
    dispatch(setItem({label:'miniMap',value:miniMapState}));
    dispatch(setItem({label:'fontFamily',value:fontFamilyState}));
    dispatch(setItem({label:'ligature',value:ligatureState}));
    toast.success('Changes Saved');
  }




  useEffect(
    () => {
      changeHandler();
    },[fontFamilyState,ligatureState,nowFont,nowLang,nowTheme,miniMapState]
  )

  return (
    <div className="text-white md:w-9/12 bg-slate-900 mx-auto p-4 border-2 rounded-xl">
      <h3 className="flex items-center gap-x-1 text-2xl font-bold mt-3">
        <IoSettingsOutline />{" "}
        <span className="bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
          Editor Preferences
        </span>
      </h3>
      {/* // theme  */}
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
        <div className="flex items-center gap-x-4 font-bold">
          <p>{nowTheme}</p>
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

      {/* mini map  */}
      <div className="bg-slate-800 mt-6 flex items-center justify-between p-3 rounded-xl mb-8">
        <div className="flex items-center gap-x-4">
          <div className="bg-slate-700 p-4 rounded-2xl">
            <HiMiniMap/>
          </div>
          <div>
            <p className="text-white font-bold">Minimap</p>
            <p className="text-sm text-slate-300">
              Jump To Any Section Of Code Easily
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4 font-bold">
          <p>{miniMapState?('On'):('Off')}</p>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={miniMapState}
              className="sr-only peer"
              onChange={(event)=>{setMiniMap(event.target.checked)}}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* // font size  */}
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

      {/* // font family  */}
      <div className="bg-slate-800 mt-6 flex flex-col p-3 rounded-xl mb-8">
        <div className="flex items-center gap-x-4 mb-5">
          <div className="bg-slate-700 p-4 rounded-2xl">
            <RxFontFamily />
          </div>
          <div>
            <p className="text-white font-bold">Font Family</p>
            <p className="text-sm text-slate-300">Choose your preferred Font Family in Editor</p>
          </div>
        </div>
        <select
        className="bg-slate-600 p-3 rounded-xl outline-none"
        value={fontFamilyState}
        onChange={(event)=>{setFontFamily(event.target.value)}}
        >
          {
            monacoFontOptions.map(
              (ele,key) => {
                return <option value={ele} key={key}>
                  {ele}
                </option>
              }
            )
          }
        </select>
      </div>
      
      {/* // font ligature  */}
      <div className="bg-slate-800 mt-6 flex items-center justify-between p-3 rounded-xl mb-8">
        <div className="flex items-center gap-x-4">
          <div className="bg-slate-700 p-4 rounded-2xl">
            <LuLigature/>
          </div>
          <div>
            <p className="text-white font-bold">Font Ligature</p>
            <p className="text-sm text-slate-300">
              Activate Or Deactivate Font Ligatures
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4 font-bold">
          <p>{ligatureState?('On'):('Off')}</p>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={ligatureState}
              className="sr-only peer"
              onChange={(event)=>{setLigature(event.target.checked)}}
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
          </label>
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
    </div>
  );
};

export default PrefernceIndex;
