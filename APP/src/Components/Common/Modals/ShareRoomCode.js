import React from 'react'
import { FaCopy } from 'react-icons/fa';
import { IoCloseSharp } from "react-icons/io5";
import { copyToClipBoard } from '../../../Utils/copyToClipBoard';

const ShareRoomCode = ({_id,joinCode,setClose}) => {
    
  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
    backdrop-blur-md flex justify-center items-center
    '>
        <div className='bg-slate-900 p-5 flex flex-col gap-y-4 w-[400px] rounded-xl'>
            <div className='flex items-center justify-between border-b-[1px] border-b-slate-400/40 p-2'>
                <p className='text-xl font-bold'>Share Room Details</p>
                <button className='text-2xl'
                onClick={() => {setClose(false)}}
                ><IoCloseSharp /></button>
            </div>
            <div>
                <p className='text-lg pl-2'>Room ID</p>
                <div className='flex p-2 border-[1px] border-slate-300/40 rounded-xl
                justify-between items-center bg-slate-700 text-xl'>
                    <p>{_id}</p>
                    <button
                    onClick={()=> {
                        copyToClipBoard(_id,navigator)
                    }}
                    ><FaCopy /></button>
                </div>
            </div>
            <div className='mb-2'>
                <p className='text-lg pl-2'>Join Code</p>
                <div className='flex p-2 border-[1px] border-slate-300/40 rounded-xl
                justify-between items-center bg-slate-700 text-xl'>
                    <p>{joinCode}</p>
                    <button
                    onClick={()=> {
                        copyToClipBoard(joinCode,navigator)
                    }}
                    ><FaCopy /></button>
                </div>
            </div>
        </div>
    </div>
  )
}

export default ShareRoomCode