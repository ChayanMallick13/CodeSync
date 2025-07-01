import React, { useState } from 'react'
import { FaArrowRight, FaLink, FaLock } from 'react-icons/fa';
import { joinRoom } from '../../../Services/Operations/Room_Apis';
import { useDispatch } from 'react-redux';

const JoinRoomModal = ({setShowMadal}) => {
    const [roomId,setRoomId] = useState('');
    const [joinCode,setJoinCode] = useState('');
    const [disableBtn,setdisableBtn] = useState(false);
    const dispatch = useDispatch();
    function handleJoinRoom(){
        const body = {
            roomId,
            joinCode,
        }
        joinRoom(body,setdisableBtn,setShowMadal,dispatch);
    }
  return (
    <div className='text-white fixed bg-slate-500/10 top-0 left-0 right-0 bottom-0 z-30
    backdrop-blur-md flex justify-center items-center
    '>

        <div className='bg-slate-900 p-5 flex flex-col gap-y-4 w-[400px] rounded-xl'>
            <h3 className='text-xl font-extrabold text-center'>Join a Room</h3>
            <p className='text-sm text-slate-400 text-center'>Enter Your credentials to access the collaborative session</p>
            <div className='mb-5'>
                <label>
                    <div className='flex items-center gap-x-3 mb-2'>
                        <FaLink className='text-slate-400'/>
                        <p>Room ID</p>
                    </div>
                    <input
                        placeholder='Enter Room ID'
                        type='text'
                        value={roomId}
                        onChange={(event) => {setRoomId(event.target.value)}}
                        className='w-full p-2 rounded-xl outline-none bg-slate-700 border-[1px] border-slate-500/60
                        focus:border-slate-300/60'
                    />
                </label>
            </div>
            <div className='mb-5'>
                <label>
                    <div className='flex items-center gap-x-3 mb-2'>
                        <FaLock className='text-slate-400'/>
                        <p>Join Code</p>
                    </div>
                    <input
                        placeholder='Enter Join Code'
                        type='text'
                        value={joinCode}
                        onChange={(event) => {setJoinCode(event.target.value)}}
                        className='w-full p-2 rounded-xl outline-none bg-slate-700 border-[1px] border-slate-500/60
                        focus:border-slate-300/60'
                    />
                </label>
            </div>
            <div className='flex items-center justify-between'>
                <button
                onClick={()=>{setShowMadal(false)}}
                className='bg-slate-600 py-3 px-16 rounded-xl transition-all duration-200
                hover:bg-slate-500
                '
                >
                    Cancel
                </button>
                <button className='flex items-center gap-x-2 bg-slate-500 py-3 px-8 rounded-xl transition-all
                duration-200 hover:bg-slate-400 hover:scale-105'
                disabled={disableBtn}
                onClick={handleJoinRoom}
                >
                    <FaArrowRight/>
                    <p>Join Room</p>
                </button>
            </div>
        </div>

    </div>
  )
}

export default JoinRoomModal