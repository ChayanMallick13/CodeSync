import React, { useEffect, useState } from "react";
import { getAllMessages } from "../../../Services/Operations/Room_Apis";
import { useParams } from "react-router-dom";
import { IoSend } from "react-icons/io5";
import { useSelector } from "react-redux";
import { FaDotCircle } from "react-icons/fa";
import { formatToAMPM } from "../../../Utils/AMPMDateFormatter";
import { GoDotFill } from "react-icons/go";

const ChatBox = ({ socketRef ,showChat}) => {
  const { user } = useSelector((state) => state.profile);
  const [chats, setChats] = useState([]);
  const { id } = useParams();
  const [msg, setMsg] = useState("");

  // console.log('p',chats);

  function sendMessageHandler() {
    const data = {
      Sender: user._id,
      Room: id,
      Message: msg,
    };
    socketRef.current?.emit("sendMessage", data);
    setMsg("");
  }

  useEffect(() => {
    socketRef.current?.on("newMessageAdd", (newMsg) => {
      console.log("newMessageAdd");
      setChats((prev) => [...prev, newMsg]);
    });
  }, []);

  useEffect(() => {
    const body = {
      roomId: id,
    };
    getAllMessages(setChats, body);
  }, []);
  return (
    <div className={`w-full h-full overflow-hidden relative
    ${showChat?('block'):('hidden')}
    `}>
      <div className="overflow-y-auto overflow-x-hidden mb-2 h-[calc(100%-130px)]">
        {chats.map((msg, key) => {
          return (
            <div key={key} className="p-2 flex items-center gap-x-3 w-full">
              <img
                alt="user"
                referrerPolicy="no-referrer"
                src={msg.Sender.image}
                className="h-[40px] w-[40px] object-cover rounded-full aspect-square"
              />
              <div className="flex flex-col">
                <div className="flex items-center text-slate-400 gap-x-1">
                  <p>{msg?.Sender?.firstName}</p>
                  <GoDotFill />
                  <p>{formatToAMPM(msg?.sentAt)}</p>
                </div>
                <div className="font-extrabold">{msg?.Message}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div
        className="h-[60px] flex items-center gap-x-2 px-1 py-2 bg-slate-700 w-full justify-between
        border-[1px]
        "
      >
        <input
          className="w-[93%] rounded-xl p-3 text-sm text-slate-800 placeholder:text-slate-600 bg-slate-400
                outline-none focus:border-slate-100/70 border-slate-300/60 border-[1px]
                "
          placeholder="Enter Your Message"
          value={msg}
          onChange={(event) => {
            setMsg(event.target.value);
          }}
          onKeyDown={(event) => {
            if(event.key==='Enter'){
              sendMessageHandler();
            }
          }}
        />
        <button
          className="text-xl"
          onClick={() => {
            sendMessageHandler();
          }}
        >
          <IoSend />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
