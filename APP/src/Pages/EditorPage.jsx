import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { getRoomInfo } from "../Services/Operations/Room_Apis";
import { Navigate, useParams } from "react-router-dom";
import EditorTopBar from "../Components/Editor/EditorTopBar";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import FIleExplorer from "../Components/Editor/FIleExplorer";
import RightPanelIndex from "../Components/Editor/RightPanel/RightPanelIndex";
import ShareRoomCode from "../Components/Common/Modals/ShareRoomCode";
import EditorIndex from "../Components/Editor/MonacoEditor/EditorIndex";
import { resetRoom } from "../Reducer/Slices/EditorSlice";

const EditorPage = () => {
  
  const { user } = useSelector((state) => state.profile);
  const socketRef = useRef(null);
  const [showRoomDetails,setShowRoomDetails] = useState(false);
  const [permissions,setPermissions] = useState(null);
  const {chnagedFiles} = useSelector(state => state.editor); 
  const chnagedFilesRef = useRef(chnagedFiles);
  const dispatch = useDispatch();
  const roomRef = useRef(null);
  const [room, setRoom] = useState(null);
  const permissionsRef = useRef();
  const navigate = useRef();

  useEffect(
    () => {
      chnagedFilesRef.current = chnagedFiles;
    },[chnagedFiles]
  )

  useEffect(
    () => {
      permissionsRef.current = permissions;
    },[permissions]
  )

  useEffect(
    () => {
      roomRef.current = room;
    },[room?.activeUsers,room,room?.permittedUsers]
  )

  const { id } = useParams();

  function handleLeaveRoom(){
    const data = {
        roomId:id,
        userId:user._id,
        changedFiles:chnagedFilesRef.current,
      }
    console.log('The Value is -> ',chnagedFilesRef.current);
    socketRef.current?.emit('disconnect_from_room',data);
    socketRef.current?.disconnect();
    dispatch(resetRoom());
    
  }

  function newUserJoinGandler(data){
    const {newUser,room} = data;
    setRoom(prev => ({...prev,activeUsers:room.activeUsers}));
    toast.success(`${newUser} Joined The Session`);
  }

  function userLeaveHandler(data){
    const {newUser,room} = data;
    setRoom(prev => ({...prev,activeUsers:room.activeUsers}));
    toast.error(`${newUser} has Left The Session`);
  }

  function checkNewMember(data){
    const {userDetails,remove,targetUser,kickedBy} = data;
    if(userDetails._id===roomRef.current.owner._id){
      return;
    }
    let arr = roomRef.current.permittedUsers.filter(ele => ele._id === userDetails._id);
    console.clear();
    if(remove && arr.length!==0){
      arr = roomRef.current.permittedUsers.filter(ele => ele._id !== userDetails._id)
    }
    else if(!remove && arr.length===0){
      arr = [...roomRef.current.permittedUsers,userDetails];
    }
    if(remove){
      toast.success(`${targetUser} removed from Room by ${kickedBy}`);
    }
    setRoom(prev => ({...prev,permittedUsers:arr}));
  }

  function handlePermissionUpdate(data){
    const {item,targetName,userName,targetId,newPos,oldPos} = data;
    const arr = roomRef.current?.permittedUsers?.map(ele => {
      if(user._id===targetId){
        setPermissions(item);
      }
      if(ele._id!==targetId){
        return ele;
      }
      else{
        return {...ele,permissions:item}
      }
    })
    setRoom(prev => ({...prev,permittedUsers:arr}));
    toast.success(`${userName} updated ${targetName} role from ${oldPos} to ${newPos}`);
  }

  useEffect(() => {
    const body = {
      roomId: id,
    };
    getRoomInfo(setRoom,body,setPermissions,user);
  }, []);



  // for y web socket server and socket io
  useEffect(
    () => {
        const socket = io(process.env.REACT_APP_SOCKET_IO_BACKEND);
        socketRef.current = socket;

        window.addEventListener('beforeunload',handleLeaveRoom);

        socket.on('connect',() => {
            // toast.success('Room Socket Connection Successfull');
            console.log('Socket Io Connection Successfull');
            const data = {
                roomId:id,
                userId:user._id,
            };
            console.log(data);
            socket.emit('connect_To_Room',data);
        })

        socket.on('connect_error',()=>{
            // toast.error('Some Error in Connecting You to Room');
            console.log('Some Error in cnnection');
        })

        socket.on('user-join-event',newUserJoinGandler);

        socket.on('user-leave-event',userLeaveHandler);

        socket.on('updateRoomPermissions',handlePermissionUpdate);

        socket.on('checkNewMember',checkNewMember);

        socket.on("disconnect", () => {
            // toast.success('Disconnected from Room');
            console.log('Socket Io DisConnection Successfull');
        });


        return () => {
            socket.off('user-join-event',newUserJoinGandler);
            socket.off('user-leave-event',userLeaveHandler);
            socket.off('updateRoomPermissions',handlePermissionUpdate);
            socket.off('checkNewMember',checkNewMember);
            handleLeaveRoom();
            window.removeEventListener('beforeunload',handleLeaveRoom);
        }
    },[user,id]
  )

  if (!room) {
    return <Loader />;
  }

  if(room && (room.permittedUsers?.filter(ele => ele._id===user._id)?.length===0) && ((room.owner?._id!==user._id))){
    // console.log(room,user);
    toast.error('Your Are Not Permitted in The Room');
    return <Navigate to={'/dashboard/stats'}/>
  }

  return (
    <div className="text-white">
      <div className="h-[70px] w-full bg-slate-900 border-b-[1px] border-b-slate-400/50">
        <EditorTopBar name={room.name} setShowRoomDetails={setShowRoomDetails}
            handleLeaveRoom={handleLeaveRoom}
        />
      </div>
      <PanelGroup direction="horizontal">
        <Panel defaultSize={17} minSize={0} className="bg-yellow-100 h-[calc(100vh-70px)]">
          <FIleExplorer
            {...room?.rootFolder}
            permissions={permissions}
            socketRef = {socketRef}
          />
        </Panel>
        <PanelResizeHandle />
        <Panel minSize={50} className="bg-green-100 h-[calc(100vh-70px)]">
          <EditorIndex room={room} permissions={permissions}/>
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={15} minSize={0} className="bg-red-100 h-[calc(100vh-70px)]">
          <RightPanelIndex
            room={room}
            socketRef = {socketRef}
            permissions={permissions}
          />
        </Panel>
      </PanelGroup>
      {
        showRoomDetails&&<ShareRoomCode {...room} setClose={setShowRoomDetails}/>
      }
    </div>
  );
};

export default EditorPage;
