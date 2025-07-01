import React, { useEffect, useState } from "react";
import { MdDriveFileRenameOutline, MdPermMedia } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import RenameAItem from "../Common/Modals/EditorModals/RenameAItem";
import DeleteAItem from "../Common/Modals/EditorModals/DeleteAItem";
import { getItemDetails } from "../../Services/Operations/Room_Apis";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const MediaIconComponet = ({ mediaId, addObjectToActive, socketRef,isDeleted,permissions }) => {
  const { activeObject } = useSelector((state) => state.editor);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [media, setMedia] = useState(null);
  

  const socket = socketRef?.current;
  function handleChange({item,userName,oldName,type,operation}){
    // console.log(item?._id,type,operation,mediaId,'media');
    // console.log(item?._id,mediaId,item?._id===mediaId,type);
    if(mediaId===item?._id && type==='media'){
      setMedia(item);
      if(activeObject?._id===item?._id){
        addObjectToActive(false,item);
      }
      if(operation==='rename')
        toast.success(`Media ${oldName} renamed to ${item?.name} by ${userName}`);
      else
        toast.success(`Media ${item?.name} deleted by ${userName}`);
    }
  }

  const { id } = useParams();

  useEffect(() => {
    getItemDetails(mediaId, id, setMedia, "media");
  }, [mediaId]);

  useEffect(() => {
    socket?.on("fileChnagedSocketRes", handleChange);
    return () => {
      socket?.off("fileChnagedSocketRes", handleChange);
    };
  },[]);

  if (!media) {
    return <></>;
  }

  return (
    <div className="relative group flex items-center">
      <button
        className={`flex items-center gap-x-1 cursor-pointer w-full
    ${
      activeObject && !activeObject.isFile && activeObject._id === media._id
        ? "bg-slate-700 p-1 rounded-full"
        : `bg-slate-900`
    }
    ${(media?.isDeleted || isDeleted)?('opacity-20'):('')}
    `}
        onClick={() => {
          addObjectToActive(false, media);
        }}
      >
        <MdPermMedia />
        <p>{media?.name}</p>
      </button>

      {permissions?.delete &&
          <div
          className={`w-0 group-hover:w-max absolute right-0 text-lg items-center flex gap-x-1 
              bg-slate-900 px-0 group-hover:px-2 font-extrabold ${(media?.isDeleted)?('hidden'):('')}`}
        >
          <button
            onClick={() => {
              setShowRenameModal(true);
            }}
          >
            <MdDriveFileRenameOutline />
          </button>
          <button
            onClick={() => {
              setShowDeleteModal(true);
            }}
          >
            <RiDeleteBin5Line />
          </button>
        </div>
      }
      {showRenameModal && (
        <RenameAItem
          name={media?.name}
          type={"media"}
          setShowRenameModal={setShowRenameModal}
          itemId={mediaId}
          roomId={id}
          socket={socketRef?.current}
        />
      )}
      {showDeleteModal && (
        <DeleteAItem
          name={media?.name}
          type={"media"}
          setShowDeleteModal={setShowDeleteModal}
          socket={socketRef?.current}
          itemId={mediaId}
        />
      )}
    </div>
  );
};

const MediaIcon = React.memo(MediaIconComponet);

export default MediaIcon;
