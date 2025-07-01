import React, { useState } from 'react'
import ShowMembers from './ShowMembers';
import ChatBox from './ChatBox';

const RightPanelIndex = ({room,socketRef,permissions}) => {
    const [showChat,setshowChat] = useState(false);
  return (
    <div className='w-full h-full bg-slate-900 border-l-[1px]'>
        <div className='border-[1px] border-slate-500/60 p-3 flex items-center justify-between'>
            <button
            onClick={() => {setshowChat(true)}}
            className={`w-full ${showChat&&'bg-slate-400'} p-2 rounded-xl duration-200 transition-all
            `}
            >Chat</button>
            <button
            onClick={() => {setshowChat(false)}}
            className={`w-full ${!showChat&&'bg-slate-400'} p-2 rounded-xl duration-200 transition-all
            `}
            >Members</button>
        </div>
        <ChatBox socketRef={socketRef}
            showChat={showChat}
        />
        <ShowMembers
            {...room}
            thisUsersPermissions={permissions}
            socket = {socketRef?.current}
            showChat={showChat}
        />
    </div>
  )
}

export default RightPanelIndex