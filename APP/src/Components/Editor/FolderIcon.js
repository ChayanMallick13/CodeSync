import React from 'react'
import { FaAngleDown, FaAngleUp, FaFolder } from 'react-icons/fa'

const FolderIcon = ({name,setdropDown,dropDown}) => {
  return (
    <div className='flex items-center gap-x-1 w-full'>
        <button
        onClick={()=>{setdropDown(prev => !prev)}}
        >
            {(dropDown)?(<FaAngleUp />):(<FaAngleDown/>)}
        </button>
        <FaFolder />
        <p>{name}</p>
    </div>
  )
}

export default FolderIcon