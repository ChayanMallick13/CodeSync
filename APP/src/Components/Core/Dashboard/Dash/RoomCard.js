import { useEffect, useState,useRef} from "react";
import toast from "react-hot-toast";
import { FaCrown, FaEye, FaPen } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { deleteARoom } from "../../../../Services/Operations/Room_Apis";
import { deleteFromRooms, setUser } from "../../../../Reducer/Slices/profileSlice";
import { io } from "socket.io-client";

const RoomCard = ({ activeUsers, name, owner,description,_id ,permissions}) => {
  // console.log(permissions,'permi');
  const [confirmDelete,setConfirmDelete] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const [disableBtn,setDisableBtn] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socketRef = useRef();
  const [activeUsersStat,setActiveUsersState] = useState(activeUsers);
  const [activeUsersList,setactiveUsersList] = useState(activeUsers?.map(ele => ele?.user?.image) || []);
  const [isDeleted,setIsdeleted] = useState(false);


  useEffect(
    () => {
        setactiveUsersList(activeUsersStat?.map(ele => ele?.user?.image) || []);
    },[activeUsersStat]
  )

  async function handleRoomDelete(){
    if(!confirmDelete){
      toast.error('Check The CheckBox to Confirm Deletion');
      return;
    }
    if(activeUsersStat?.length!==0){
      toast.error('Users Are Using The Room Try After SomeTime');
      return;
    }
    const val = await deleteARoom({roomId:_id,userName:`${user.firstName} ${user.lastName}`,name},
      setDisableBtn,dispatch,socketRef.current);
  }

  function handleLeaveRoom() {
    socketRef.current?.disconnect();
  }
  function activeUsersChangeHandler(data) {
    const {room} = data;
    setActiveUsersState(room.activeUsers);
  }
  function checkisDeletd(data){
    const {roomId,name,userName} = data;
    if(roomId===_id){
      toast.error(`Room ${name} deleted by Owner ${userName}`);
      setIsdeleted(true);
    }
  }

  useEffect(
    () => {
        const socket = io(process.env.REACT_APP_SOCKET_IO_BACKEND);
        socketRef.current = socket;

        window.addEventListener('beforeunload',handleLeaveRoom);

        socket.on('connect',() => {
            // toast.success('Room Socket Connection Successfull');
            console.log('Socket Io Connection Successfull');
            const userDetails = {...user,permissions};
            const data = {isDash:true,roomId:_id,userDetails};
            // console.log(data);
            socket.emit('connect_To_Room',data);
        })

        socket.on('connect_error',()=>{
            // toast.error('Some Error in Connecting You to Room');
            console.log('Some Error in cnnection');
        })

        socket.on('user-join-event',activeUsersChangeHandler);

        socket.on('user-leave-event',activeUsersChangeHandler);

        socket.on('roomDeletedCheck',checkisDeletd);


        socket.on("disconnect", () => {
            // toast.success('Disconnected from Room');
            console.log('Socket Io DisConnection Successfull');
        });


        return () => {
            handleLeaveRoom();
            socket.off('user-join-event',activeUsersChangeHandler);
            socket.off('user-leave-event',activeUsersChangeHandler);
            socket.off('roomDeletedCheck',checkisDeletd);
            window.removeEventListener('beforeunload',handleLeaveRoom);
        }
    },[_id]
  )

  if(isDeleted){
    handleLeaveRoom();
    dispatch(deleteFromRooms(_id));
    return <></>
  }

  return (
    <div className="bg-slate-900 border-[1px] border-slate-400/50 p-4 w-[450px] h-[290px] flex flex-col
    justify-between rounded-lg">
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2 text-slate-400">
          <div
            className={`h-[15px] w-[15px] rounded-full ${
              activeUsersList?.length ? "bg-green-700" : "bg-red-700"
            }`}
          />
          <p>{activeUsersList?.length ? "ACTIVE" : "INACTIVE"}</p>
        </div>
        {
            (user._id === owner) && (
          <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
            <FaCrown />
            <p>Owner</p>
          </div>
        )}
        {
            (permissions?.write) && (user._id !== owner)&&<div>
                <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
                    <FaPen/>
                    <p>Write</p>
                </div>
            </div>
        }
        {
            (!permissions?.write) && (user._id !== owner)&&<div>
                <div className="flex items-center gap-x-1 text-sm text-slate-400 font-extrabold">
                    <FaEye />
                    <p>Read</p>
                </div>
            </div>
        }
      </div>
      <p className="text-xl font-extrabold">{name}</p>
      <p className="text-sm text-slate-400">{description?.substr(0,120)}</p>
      {
        <div className="flex gap-x-2">
        <p>Active Users : </p>
        <div className="flex gap-x-1">
            {
                activeUsersList.slice(0,3).map(
                    (ele,key) => {
                        return <img src={ele} key={key} alt="UserUmage" 
                        className="h-[30px] w-[30px] rounded-full object-cover aspect-square"
                         />
                    }
                )
            }
        </div>
        {
            (activeUsersList.length>3)&&<p
            className="bg-slate-600 p-1 rounded-full"
            >{(`+ ${(activeUsersList?.length-3) || 0}`)}</p>
        }
      </div>
      }
      <button
      className="bg-slate-500 p-2 font-extrabold rounded-xl
      transition-all duration-200 hover:bg-slate-600 text-center
      "
      onClick={()=>{
        setUser({...user,permissions});
        navigate(`/room/${_id}`);
      }}
      >
        Join Room
      </button>
      {
        (user._id === owner)&&<div className="text-xl flex items-center gap-x-3">
          <div class="checkbox-wrapper-39">
            <label>
              <input type="checkbox"
                checked={confirmDelete}
                onChange={(e)=>{setConfirmDelete(e.target.checked)}}
              />
              <span class="checkbox"></span>
            </label>
          </div>
          <button className="font-extrabold text-red-600"
          onClick={handleRoomDelete}
          disabled={disableBtn}
          >
            Delete This Room
          </button>
        </div>
      }
      {
        (user._id !== owner)&&<button className="font-extrabold text-red-600"
        onClick={()=>{
          socketRef.current.emit('leaveRoomByUser',{
            targetUserId:user._id,
            kick:false,
            ban:false,
            roomId:_id,
          })
          setIsdeleted(true);
        }}
        >
          Leave Room
        </button>
      }
    </div>
  );
};

export default RoomCard;
