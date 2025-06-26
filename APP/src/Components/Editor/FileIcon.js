import React from 'react'
import { FaFile } from "react-icons/fa";
import { useSelector } from 'react-redux';

const FileIcon = ({file,addObjectToActive}) => {
  const {activeObject} = useSelector(state => state.editor);
  return (
    <button className={`flex items-center gap-x-1 cursor-pointer w-full
     ${(activeObject&&activeObject.isFile&&(activeObject._id===file._id))?('bg-slate-700 p-1 rounded-full'):('bg-slate-900')}
    `}
    onClick={()=>{addObjectToActive(true,file)}}
    >
        <FaFile/>
        <p>{file?.name}</p>
    </button>
  )
}

export default FileIcon