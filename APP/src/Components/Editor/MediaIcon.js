import React from 'react'
import { MdPermMedia } from "react-icons/md";
import { useSelector } from 'react-redux';

const MediaIcon = ({media,addObjectToActive}) => {
  const {activeObject} = useSelector(state => state.editor);
  return (
    <button className={`flex items-center gap-x-1 cursor-pointer w-full
    ${(activeObject&&(!activeObject.isFile)&&(activeObject._id===media._id))?('bg-slate-700 p-1 rounded-full'):('bg-slate-900')}
    `}
    onClick={()=>{addObjectToActive(false,media)}}
    >
        <MdPermMedia />
        <p>{media?.name}</p>
    </button>
  )
}

export default MediaIcon