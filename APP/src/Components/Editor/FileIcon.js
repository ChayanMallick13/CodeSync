import React, { useEffect, useRef, useState } from "react";
import { FaFile } from "react-icons/fa";
import { useSelector } from "react-redux";
import { AiOutlineFileAdd } from "react-icons/ai";
import { MdDriveFileRenameOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import RenameAItem from "../Common/Modals/EditorModals/RenameAItem";
import DeleteAItem from "../Common/Modals/EditorModals/DeleteAItem";
import { useParams } from "react-router-dom";
import { getItemDetails, handleUndoDelete } from "../../Services/Operations/Room_Apis";
import toast from "react-hot-toast";
import { setActiveObject } from "../../Reducer/Slices/EditorSlice";
import { languageToDeviconMap } from "../../Utils/allLanguages";

const FileIconComponent = ({ fileId, addObjectToActive, socketRef,isDeleted,permissions }) => {
  const { activeObject,activeObjects } = useSelector((state) => state.editor);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const activeObjectRef = useRef(activeObject);
  const [disableBtn,setDisableBtn] = useState(false);
    const {user} = useSelector(state => state.profile);
  

  const [file, setfile] = useState(null);
  const { id } = useParams();
  const socket = socketRef?.current;



  function getLanguageIconUrl(language) {
  const deviconName = languageToDeviconMap[language];

  if (deviconName) {
    return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${deviconName}/${deviconName}-original.svg`;
  }

  // fallback to iconify (only lowercase works here)
  return null;
}


  
  function handleChange({item,userName,oldName,type,operation,recover}){
    // console.log(item?._id,type,operation,fileId,'file');
    if((item?._id===fileId) && (type==='file')){
      setfile(item);
      console.log(activeObjectRef.current?._id,item._id,fileId,activeObjects);
      if(activeObjectRef.current?._id===item?._id){
        addObjectToActive(true,item);
        // console.log('item');
      }
      if(operation==='rename'){
        toast.success(`File ${oldName} renamed to ${item?.name} by ${userName}`);
      }
      else if(operation==='delete'){
        toast.success(`File ${item?.name} ${recover?('Recovered'):('Deleted')} by ${userName}`);
      }
      else{
        toast.success('yo yo');
      }
    }
  }

  useEffect(() => {
    getItemDetails(fileId, id, setfile, "file");
  }, [fileId,id]);

  useEffect(()=>{
    activeObjectRef.current = activeObject;
  },[activeObject])

  useEffect(() => {
    socket?.on("fileChnagedSocketRes", handleChange);
    return () => {
      socket?.off("fileChnagedSocketRes", handleChange);
    };
  },[socket]);

  if (!file) {
    return <></>;
  }

  return (
    <div className="relative group flex items-center">
      <button
        className={`flex items-center gap-x-1 cursor-pointer w-full
     ${
       activeObject && activeObject.isFile && activeObject._id === file._id
         ? "bg-slate-700 p-1 rounded-full"
         : `bg-slate-900`
     }
     ${((file?.isDeleted || isDeleted))?('opacity-20'):('')}
    `}
        onClick={() => {
          addObjectToActive(true, file);
        }}
      >
        {(file?.language && getLanguageIconUrl(file?.language))?(<img alt="file" src={getLanguageIconUrl(file?.language)} className="w-[17px] h-[17px]"
          referrerPolicy="no-referrer"
        />):(<FaFile/>)}
        <p>{file?.name}</p>
      </button>

      {
        permissions?.delete &&
          <div
        className={`w-0 group-hover:w-max absolute right-0 text-lg items-center flex gap-x-1 
      bg-slate-900 px-0 group-hover:px-2 ${(file?.isDeleted || isDeleted)?('hidden'):('')}`}
      >
        <button>
          <MdDriveFileRenameOutline
            onClick={() => {
              setShowRenameModal(true);
            }}
          />
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
      {
        permissions?.delete&&<button className={`${(isDeleted || file?.isDeleted)?('block'):('hidden')} font-extrabold
        text-green-400 absolute right-0
        `}
        disabled={disableBtn}
        onClick={()=>{
          console.clear();
          console.log('Hello');
          handleUndoDelete(null,id,'file',fileId,()=>{},setDisableBtn,user,socketRef?.current,file?.name);
        }}
        >
          Recover
        </button>
      }
      {showRenameModal && (
        <RenameAItem
          name={file?.name}
          type={"file"}
          setShowRenameModal={setShowRenameModal}
          itemId={fileId}
          roomId={id}
          socket={socketRef?.current}
        />
      )}
      {showDeleteModal && (
        <DeleteAItem
          name={file?.name}
          type={"file"}
          setShowDeleteModal={setShowDeleteModal}
          socket={socketRef?.current}
          itemId={fileId}
        />
      )}
    </div>
  );
};

const FileIcon = React.memo(FileIconComponent);

export default FileIcon;
